import mongoose from "mongoose";

var Schema = mongoose.Schema;

let MatchingModelSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Setting default to the current date/time
    },
    level: {
        type: Number,
        required: true,
    }
    });

MatchingModelSchema.index({createdAt: 1}, {expireAfterSeconds: 15})

export default mongoose.model("MatchingModel", MatchingModelSchema);