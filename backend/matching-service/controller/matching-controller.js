import { ormCreateFindMatchRecord } from "../model/matching-orm.js";

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
      const response = await ormCreateFindMatchRecord(userId, level);
      if (response.err) {
        return res.status(400).json({ message: "Could not create the match!" });
      } else {
        console.log(`Match created successfully!`);
        return res.status(200).json({ message: "Match created successfully!" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Database failure when creating match!" });
    }
  } else {
    return res.status(400).json({ message: "User ID or Level is missing!" });
  }
}