const mqtt = require('mqtt');

// MQTT Broker connection
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

import {
  ormGetMatchRecord,
  ormCreateFindMatchRecord,
  ormGetMatchPartner,
  ormCreateRoom,
  ormUpdateMatchRecordRoomId,
} from "../model/matching-orm.js";

const categoryList = [
  'Strings',
  'Algorithms',
  'Brainteaser',
  'Data Structure',
  'Databases',
  'Recursion',
  'Bit Manipulation'
];

const complexity = ['easy', 'medium', 'hard'];

let userQueue = {};

complexity.forEach(complexity => {
  userQueue[complexity] = {};

  categoryList.forEach(category => {
      userQueue[complexity][category.toLowerCase()] = [];
  });
});

console.log(userQueue);

//Start match endpoint
export async function startMatch(req, res){
  const { userId, complexity, category } = req.body;

   client.subscribe(userId);

   const matchingUser = userQueue[complexity][category].find(user => user !== userId);

   if (matchingUser) {
       const hash = generateHash(userId, matchingUser);

       // Publish hash
       client.publish(userId, hash);
       client.publish(matchingUser, hash);

       // Remove users from global variable
       userQueue[complexity][category] = userQueue[complexity][category].filter(user => user !== userId && user !== matchingUser);

       res.status(200).json({ message: 'Match found' });
   } else {
       if (!userQueue[complexity][category]) {
           userQueue[complexity][category] = [];
       }
       userQueue[complexity][category].push(userId);

       res.status(200).json({ message: 'Added to queue' });
   }
}


//Cancle macth endpoint
export async function cancleMatch(req, res){
  const { userId, complexity, category } = req.body;

  userQueue[complexity][category] = userQueue[complexity][category].filter(user => user !== userId);

  res.status(200).json({ message: 'Match Cancled' });
}


//generator hash function
function generateHash(userA, userB) {
  const hashInput = `${userA}-${userB}-${Date.now()}`;
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
  return hash;
}


// export async function respHelloWorld(req, res) {
//   try {
//     console.log(req.body)
//     return res.status(200).json({ message: `Hello World! Email:` });
//   } catch (err) {
//     return res.status(500).json({ message: "Internal Server Error!" });
//   }
// }

export async function getMatchRecord(req, res) {
  const recordId = req.body.recordId;
  if (recordId) {
    try {
      const response = await ormGetMatchRecord(recordId);
      if (response) {
        return res.status(200).json({ message: "Match record found!", record: response });
      } else {
        return res.status(400).json({ message: "Match record not found!" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Database failure when getting match record!" });
    }
  } else {
    return res.status(400).json({ message: "Record ID is missing!" });
  }
}

async function findMatchPartner(matchRecord, complexity, category) {
  try {
    const partner = await ormGetMatchPartner(matchRecord.userId, complexity, category);
    if (partner) {
      const room = await createRoom([matchRecord.userId, partner.userId], complexity, category);
      await updateRoomId(partner._id, room._id);
      await updateRoomId(matchRecord._id, room._id);
      matchRecord.roomId = room._id;
      partner.roomId = room._id;
      return partner;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return { err };
  }
}

async function createRoom(userIds, complexity, category) {
  try {
    const newRoom = await ormCreateRoom(userIds, complexity, category);
    if (newRoom) {
      return newRoom;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return { err };
  }
}

async function updateRoomId(recordId, roomId) {
  try {
    const response = await ormUpdateMatchRecordRoomId(recordId, roomId);
    if (response) {
      return response;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function createMatchRecord(req, res) {
  const { userId, complexity, category } = req.body;
  if (userId && complexity) {
    try {
      const newRecord = await ormCreateFindMatchRecord(userId, complexity, category);
      const matchPartner = await findMatchPartner(newRecord, complexity, category);
      console.log(matchPartner)
      if (matchPartner) {        
        return res.status(200).json({ message: "Match found!", record: newRecord, partner: matchPartner });
      } else {
        return res.status(200).json({ message: "Match not found!", record: newRecord });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Database failure when creating match record!" });
    }
  } else {
    return res.status(400).json({ message: "User ID or level is missing!" });
  }
}
