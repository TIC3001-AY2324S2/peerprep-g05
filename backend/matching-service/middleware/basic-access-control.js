import {
    ormfindIfMatchRecordExists,
  } from "../model/matching-orm.js";

export async function verifyIfRecordExists(req, res, next) {
  const { userId } = req.body;
  if (userId) {
    try {
      const response = await ormfindIfMatchRecordExists(userId, new Date());
      if (response) {
        return res.status(400).json({ 
          message: "Existing Record is not expired!", 
          recordId: response._id, 
          matchId: response.matchId });
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Database failure when finding match!" });
    }
  } else {
    return res.status(400).json({ message: "User ID is missing!" });
  }
}
