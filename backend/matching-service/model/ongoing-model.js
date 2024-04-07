import mongoose from "mongoose";

var Schema = mongoose.Schema;

let OngoingModelSchema = new Schema({
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
    },
    category: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

OngoingModelSchema.index({ createdAt: -1, isActive: 1 })

export default mongoose.model("OngoingModel", OngoingModelSchema);