import MatchingModel from "./matching-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";


let mongoDBUri =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

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
  return await MatchingModel.findOne({"createdAt":{"$gte": new Date() - 1000 * 10, "$lte": new Date()}})
}