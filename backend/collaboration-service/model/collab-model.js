import mongoose from "mongoose";

var Schema = mongoose.Schema;

let CollabModelSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,

  hash: {
    type: String,
    primaryKey: true,
    unique: true,
    required: true,
  },
  

  questionid: {
    type: Number,
    required: true,
  },


});

export default mongoose.model("CollabModel", CollabModelSchema);