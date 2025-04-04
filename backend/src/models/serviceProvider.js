import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";

const serviceProviderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        professions: {
            type: String,
            default: '',
        },
        experience: {
            type: Number,
            required: true,
            min: 0
        },
        location: {
            type: Object,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        availability: {
            type: Boolean,
            default: true
        },
        badges: {
            type: [String],
            default: [],
            enum: ["elite", "pro", "verified", "featured", "top-rated", "new", "experienced", "local", "remote", "onsite", "online", "emergency", "24x7", "discount", "free-consultation", "free-quote", "free-visit", "free-trial", "free-estimate", "free-delivery", "free-shipping", "free-installation", "free-setup", "free-repair", "free-replacement", "free-maintenance", "free-support", "free-upgrade", "free-training", "free-consultation", "free-advice", "free-counseling", "free-coaching", "free"],
        },
        totalEarnings: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
);

serviceProviderSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

serviceProviderSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

serviceProviderSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, userType: this.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

export const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);