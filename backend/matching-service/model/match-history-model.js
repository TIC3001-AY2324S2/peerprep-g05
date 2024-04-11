import mongoose from "mongoose";

var Schema = mongoose.Schema;

let MatchHistoryModelSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: Number,
        allowNull: false,
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

const CounterSchema = Schema({
    _id: { type: String, required: true },
    email: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

CounterSchema.pre('save', function(next) {
    this._id = `${this.email}-${this.seq}`;
    next();
});

const counter = mongoose.model('counter', CounterSchema);

MatchHistoryModelSchema.pre('save', async function(next) {
    const doc = this;
    try {
        const counterDoc = await counter.findOneAndUpdate(
            { email: doc.email },
            { $inc: { seq: 1 } },
            { upsert: true, new: true }
        );
        doc.id = counterDoc.seq;
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model("MatchHistoryModel", MatchHistoryModelSchema);