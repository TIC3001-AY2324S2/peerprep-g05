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
    },
    category: {
        type: String,
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
    },
});

MatchingModelSchema.index({ createdAt: -1 })

export default mongoose.model("MatchingModel", MatchingModelSchema);