import {
  ormGetMatchRecord,
  ormCreateFindMatchRecord,
  ormGetMatchPartner,
  ormCreateRoom,
  ormUpdateMatchRecordRoomId,
} from "../model/matching-orm.js";

export async function respHelloWorld(req, res) {
  try {
    console.log(req.body)
    return res.status(200).json({ message: `Hello World! Email:` });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

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

async function findMatchPartner(matchRecord, level) {
  try {
    const partner = await ormGetMatchPartner(matchRecord.userId, level);
    if (partner) {
      const room = await createRoom([matchRecord.userId, partner.userId], level);
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

async function createRoom(userIds, level) {
  try {
    const newRoom = await ormCreateRoom(userIds, level);
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
  const { userId, level } = req.body;
  if (userId && level) {
    try {
      const newRecord = await ormCreateFindMatchRecord(userId, level);
      const matchPartner = await findMatchPartner(newRecord, level);
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
