import CollabModel from "./collab-model.js";
import dotenv from "dotenv";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

// Read .env from root parent folder if docker is not used
if (process.env.IS_DOCKER != "true") {
    dotenv.config({ path: '../../.env' });
}

let mongoDBUri = process.env.DB_URI;

mongoose.set('strictQuery', true);

mongoose.connect(mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.on("connected", () => console.log("MongoDB Connected!"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function findSessionInfoByHash(hash) {
    const foundSession = await CollabModel.findOne({ hash: hash })
    if(foundSession) {
        return foundSession;
      }
      return "";
}

export async function addSessionInfo(hash, questionid) {
    const newSession = new CollabModel({
      _id: new mongoose.Types.ObjectId(),
      hash: hash,
      questionid: questionid,
    });
    return await newSession.save();
  }