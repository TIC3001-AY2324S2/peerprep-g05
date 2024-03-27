import mongoose from "mongoose";

var Schema = mongoose.Schema;

let QuestionModelSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    require: true,
  },
  complexity: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  testCase: {
    type: Array,
    required: true,
  },

});

export default mongoose.model("QuestionModel", QuestionModelSchema, "Question");