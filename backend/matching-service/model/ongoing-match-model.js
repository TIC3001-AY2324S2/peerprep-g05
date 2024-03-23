import mongoose from "mongoose";

var Schema = mongoose.Schema;

let OngoingMatchModelSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now, // Setting default to the current date/time
    },
    level: {
        type: Number,
        required: true,
    }
});

OngoingMatchModelSchema.index({ createdAt: 1 })

export default mongoose.model("OngoingMatchModel", OngoingMatchModelSchema);