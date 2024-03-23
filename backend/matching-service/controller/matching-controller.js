import {
  ormCreateFindMatchRecord,
  ormfindIfMatchRecordExists,
  ormGetMatchRecord
} from "../model/matching-orm.js";

export async function respHelloWorld(req, res) {
  try {
    console.log(req.body)
    return res.status(200).json({ message: `Hello World! Email:` });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function findMatch(req, res) {
  const { userId, level } = req.body;
  if (userId && level) {
    console.log(`FIND MATCH: User ID: ${userId}, Level: ${level}`);
    try {
      const response = await ormfindIfMatchRecordExists(userId, new Date());
      if (response) {
        return res.status(400).json({ 
          message: "Existing Record is not expired!", 
          recordId: response._id, 
          matchId: response.matchId });
      } else {
        const response = await ormCreateFindMatchRecord(userId, level);
        if (response.err) {
          return res.status(400).json({ message: "Could not create the match!" });
        } else {
          console.log(`Match created successfully!`);
          return res.status(200).json({ 
            message: "Match created successfully!", 
            recordId: response._id,
            matchId: response.matchId });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Database failure when finding match!" });
    }
  } else {
    return res.status(400).json({ message: "User ID or Level is missing!" });
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