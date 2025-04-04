import mongoose from 'mongoose';
import { User } from './user.model.js';

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    stars: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);