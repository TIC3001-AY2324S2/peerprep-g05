import mqtt from 'mqtt';
import crypto from 'crypto';
import { ormCreateMatchRecordForUser, ormGetMatchesForUser } from '../model/match-history-orm.js';
import dotenv from "dotenv";
import "dotenv/config";
import axios from 'axios';

// Read .env from root parent folder if docker is not used
if (process.env.IS_DOCKER != "true") {
    dotenv.config({ path: '../../.env' });
}

const mqttBrokerUrl = process.env.DOCKER_MATCHING_BROKER_SVC_URL || 'ws://test.mosquitto.org:9001';
const userServiceURL = process.env.DOCKER_USER_SVC_URL || 'http://localhost:3001';
const questionServiceUrl = process.env.DOCKER_QUESTION_SVC_URL || 'http://localhost:3002';
const collabServiceUrl = process.env.DOCKER_COLLABORATION_SVC_URL || 'http://localhost:3004';
// MQTT Broker connection
const client = mqtt.connect(mqttBrokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

const userQueue = {};
const userToEmailMap = {};

//Start match endpoint
export async function startMatch(req, res){
  try {
    const { username, email, complexity, category } = req.body;
    userQueue[complexity] = userQueue[complexity] ?? {};
    userQueue[complexity][category] = userQueue[complexity][category] ?? [];
    userToEmailMap[username] = email;

    if (userQueue[complexity][category].length > 0) {
      if (userQueue[complexity][category] === username) {
        return res.status(200).json({ message: 'Already added to queue' });
      }

      const partner = userQueue[complexity][category].pop();
      const hash = generateHash(username, partner);

      client.publish(`user/${username}`, JSON.stringify({ partner, hash}));
      client.publish(`user/${partner}`, JSON.stringify({ partner: username, hash }));

      console.log(`session: ${hash}, complexity: ${complexity}, category: ${category}`);
      try{
        const resp = await axios.get(`${questionServiceUrl}/api/question/complexity/${complexity}/category/${category}`,
          { headers: { Authorization: req.headers.authorization } }
        ); 
        const data = resp.data;
        const qid = data.question[0].id;
        console.log(`<<< posting to ${collabServiceUrl}/api/collaboration/session/${hash}/qid/${qid} >>>`);
        await axios.post(`${collabServiceUrl}/api/collaboration/session/${hash}/qid/${qid}`);
      } catch (err) {
        if (err.response) {
          console.log(`Error on collab, status: ${err.response.status}, message: ${err.response.statusText}`);
          console.log(`Response data: ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          console.log(`No response received, request was: ${JSON.stringify(err.request)}`);
        } else {
          console.log(`Error on collab: ${err.message}`);
        }
      }

      ormCreateMatchRecordForUser(email, partner, complexity, category)
      ormCreateMatchRecordForUser(userToEmailMap[partner], username, complexity, category)

      console.log(`Match [${hash}] found for ${username} and ${partner}`);
      return res.status(200).json({ message: 'Match found' });
    } else {
      userQueue[complexity][category].push(username);
    }
    return res.status(200).json({ message: 'Added to queue' });
  } catch (error) {
    console.log(`Error in startMatch: ${error}`);
    return res.status(500).json({ message: "Error in startMatch" });
  }
}


//Cancel match endpoint
export async function cancelMatch(req, res) {
  try {
    const { username, complexity, category } = req.body;

    if (userQueue[complexity] && userQueue[complexity][category]) {
      userQueue[complexity][category] = userQueue[complexity][category].filter(user => user !== username);
    }

    return res.status(200).json({ message: 'Match Cancelled' });
  } catch (error) {
    console.log(`Error in cancelMatch: ${error}`);
    return res.status(500).json({ message: "Error in cancelMatch" });
  }
}


//generator hash function
function generateHash(userA, userB) {
  const hashInput = `${userA}-${userB}-${Date.now()}`;
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
  return hash;
}

// Retrieves the match history for the user
export async function getMatchesForUser(req, res) {
  try {
    const { email } = req.params;
    const limit = req.query.limit;
    const page = req.query.page;

    console.log(`GET ${limit} MATCH HISTORY FOR email [${email}] PAGE ${page}`);

    const response = await ormGetMatchesForUser(email);

    if (response === null) {
      return res.status(200).json({
        message: `No history In Repository`,
        history: response,
      });
    } else if (response.err) {
      return res.status(400).json({message: "Error With History Repository"});
    } else {
      console.log(`Match history loaded!`);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const totalPages = Math.ceil(response.length / limit);

      const slicedResponse = response.slice(startIndex, endIndex);
      return res.status(200).json({
          message: `History loaded!`,
          history: slicedResponse,
          totalPages: totalPages,
      });
    }
  } catch (error) {
    console.log(`Error in getMatchesForUser: ${error}`);
    return res.status(500).json({ message: "Error in getMatchesForUser" });
  }
}