import {
  ormGetMatchRecord,
  ormCreateFindMatchRecord,
  ormGetMatchPartner,
  ormCreateRoom,
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

async function findMatchPartner(userId, level) {
  try {
    const response = await ormGetMatchPartner(userId, level);
    if (response) {
      await ormCreateRoom([userId, response.userId], level);
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
      const matchPartner = await findMatchPartner(userId, level);
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
