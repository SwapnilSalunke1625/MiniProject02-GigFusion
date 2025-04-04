import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewDescription: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);