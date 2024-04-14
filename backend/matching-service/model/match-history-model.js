import mongoose from "mongoose";

var Schema = mongoose.Schema;

let MatchHistoryModelSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hash: {
        type: String,
        allowNull: false,
        primaryKey: true,
        required: true,
    },
    email: { // user's email
        type: String,
        primaryKey: true,
        required: true,
    },
    partner: { // partner's username
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Setting default to the current date/time
    },
    complexity: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});

export default mongoose.model("MatchHistoryModel", MatchHistoryModelSchema);