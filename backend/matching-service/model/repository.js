import MatchingModel from "./match-history-model.js";
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

export async function findMatchesForUser(email) {
  return await MatchingModel.find({ email: email });
}

export async function createMatchRecordForUser(email, partner, complexity, category) {
  const newRecord = new MatchingModel({
    _id: new mongoose.Types.ObjectId(),
    email,
    partner,
    complexity,
    category,
  });

  return await newRecord.save();
}