import mongoose from "mongoose";

var Schema = mongoose.Schema;

let CollabModelSchema = new Schema({
  hash: {
    type: String,
    primaryKey: true,
    unique: true,
    required: true,
  },
  
  _id: mongoose.Schema.Types.ObjectId,
  questionid: {
    type: Number,
    required: true,
  },


});

export default mongoose.model("CollabModel", CollabModelSchema);