import QuestionModel from "./question-model.js";
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

export async function findAllQuestion() {
  return QuestionModel.find();
}

export async function findQuestionByID(id) {
  const foundQuestion = await QuestionModel.findOne({ id: id })
  if(foundQuestion) {
    return foundQuestion;
  }
  return "";
}

export async function findOneQuestionByComplexity(complexity) {
  return QuestionModel.aggregate([
    { $match: { complexity: complexity } },
    { $sample: { size: 1 } }
  ]);
}

export async function findAllQuestionByComplexity(complexity) {
  return QuestionModel.find(
    {complexity: complexity }
  );
}

export async function createQuestion({ title, description, categories, complexity, testCase }) {
  const lastQuestion = await QuestionModel.findOne().sort('-id');
  const highestId = lastQuestion ? lastQuestion.id : 0;
  const newQuestion = new QuestionModel({
    _id: new mongoose.Types.ObjectId(),
    id: highestId + 1, title: title, description: description, categories: categories, complexity: complexity, testCase: testCase
  });
  return await newQuestion.save();
}

export async function getTotalQuestionCount() {
  const lastQuestion = await QuestionModel.findOne().sort('-id');
  const highestId = lastQuestion ? lastQuestion.id : 0;
  return highestId;
}

export async function deleteQuestion(id) {
  const deletedQuestion = await QuestionModel.deleteOne({ id: id });
  // Update all questions with id greater than the deleted question
  await QuestionModel.updateMany({ id: { $gt: id } }, { $inc: { id: -1 } });
  return deletedQuestion;
}

export async function updateQuestion(id, { title, description, categories, complexity, testCase }) {
  return await QuestionModel.updateOne(
    { id: id },
    { title: title, description: description, categories: categories, complexity: complexity, testCase: testCase }
  );
}