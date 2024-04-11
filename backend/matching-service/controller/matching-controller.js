import mqtt from 'mqtt';
import crypto from 'crypto';
import { ormCreateMatchRecordForUser, ormGetMatchesForUser } from '../model/matching-orm.js';
import dotenv from "dotenv";
import "dotenv/config";

// Read .env from root parent folder if docker is not used
if (process.env.IS_DOCKER != "true") {
    dotenv.config({ path: '../../.env' });
}

const mqttBrokerUrl = process.env.DOCKER_MATCHING_BROKER_SVC_URL || 'ws://test.mosquitto.org:9001';

// MQTT Broker connection
const client = mqtt.connect(mqttBrokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

const userQueue = {};
const userToEmailMap = {};

//Start match endpoint
export async function startMatch(req, res){
  const { username, email, complexity, category } = req.body;
  console.log(req.body)

  userQueue[complexity] = userQueue[complexity] ?? {};
  userQueue[complexity][category] = userQueue[complexity][category] ?? [];
  userToEmailMap[username] = email;

  console.log(userQueue);

  if (userQueue[complexity][category].length > 0) {
    if (userQueue[complexity][category] === username) {
      return res.status(200).json({ message: 'Already added to queue' });
    }

    const partner = userQueue[complexity][category].pop();

    // for assignment 4 return the partner name instead of hash
    const hash = generateHash(username, partner);
    client.publish(`user/${username}`, JSON.stringify({ partner, hash}));
    client.publish(`user/${partner}`, JSON.stringify({ partner: username, hash }));

    ormCreateMatchRecordForUser(email, partner, complexity, category)
    ormCreateMatchRecordForUser(userToEmailMap[partner], username, complexity, category)

    console.log(`Match [${hash}] found for ${username} and ${partner}`);
    return res.status(200).json({ message: 'Match found' });
  } else {
    userQueue[complexity][category].push(username);
  }
  return res.status(200).json({ message: 'Added to queue' });
}


//Cancel match endpoint
export async function cancelMatch(req, res){
  const { username, complexity, category } = req.body;

  if (userQueue[complexity] && userQueue[complexity][category]) {
    userQueue[complexity][category] = userQueue[complexity][category].filter(user => user !== username);
  }

  res.status(200).json({ message: 'Match Cancelled' });
}


//generator hash function
function generateHash(userA, userB) {
  const hashInput = `${userA}-${userB}-${Date.now()}`;
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
  return hash;
}

// Retrieves the match history for the user
export async function getMatchesForUser(req, res) {
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
}