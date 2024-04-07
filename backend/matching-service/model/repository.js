import MatchingModel from "./matching-model.js";
import OngoingModel from "./ongoing-model.js";
import dotenv from "dotenv";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";


//let mongoDBUri =
  //process.env.ENV == "PROD"
    //? process.env.DB_CLOUD_URI
    //: process.env.DB_LOCAL_URI;

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

export async function createFindMatchRecord(params) {
  params._id = new mongoose.Types.ObjectId();

  return new MatchingModel(params);
}

export async function findIfMatchRecordExists(userId, createdAt) {
  return await MatchingModel.findOne({ "createdAt": { "$gte": createdAt - 1000 * 30, "$lte": createdAt }, userId: userId });
}

export async function findMatchRecord(recordId) {
  return await MatchingModel.findOne({ _id: recordId, createdAt: { "$gte": new Date() - 1000 * 30, "$lte": new Date() } });
}

export async function findMatchPartner(userId, level) {
  return await MatchingModel.findOne({ userId: { "$ne": userId }, level: level, createdAt: { "$gte": new Date() - 1000 * 30, "$lte": new Date() }, roomId: null });
}

export async function createRoom(params) {
  params._id = new mongoose.Types.ObjectId();

  return new OngoingModel(params);
}

export async function findRoom(roomId) {
  return await OngoingModel.findOne({ _id: roomId });
}
