import mongoose from "mongoose";
/*
who is posting the job?
who is providing the service?
what is the job?
what is the service required?
what is the price?
what is the location?
what is the rating?
what is the availability?
what are the additional details?
time of job posting?
what are the badges?
*/

const jobPostSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    additionalDetails: {
        type: String,
        trim: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "pending",
        // enum: ["pending", "accepted", "rejected", "completed"],
    },
    jobProgress: {
        type: String,
        default: "new",
        // enum: ["new", "pending", "completed"],
    },
    userConsentForJobCompletion: {
        type: Boolean,
        default: false,
    },
    serviceProviderConsentForJobCompletion: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

jobPostSchema.pre('save', function(next) {
    if (this.userConsentForJobCompletion) {
        this.status = 'completed';
        this.jobProgress = 'completed';
    }
    next();
});

export const JobPost = mongoose.model("JobPost", jobPostSchema);
