import mongoose from "mongoose";

const JobMatchingSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Match must be associated with a project']
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Match must be associated with a freelancer']
    },
    matchScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    factors: {
        skillsMatch: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        experienceMatch: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        rateMatch: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        locationMatch: {
            type: Number,
            min: 0,
            max: 100
        },
        availabilityMatch: {
            type: Number,
            min: 0,
            max: 100
        },
        pastPerformanceMatch: {
            type: Number,
            min: 0,
            max: 100
        },
        clientPreferenceMatch: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    isRecommended: {
        type: Boolean,
        default: false
    },
    isViewed: {
        type: Boolean,
        default: false
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    isApplied: {
        type: Boolean,
        default: false
    },
    viewedAt: {
        type: Date
    },
    savedAt: {
        type: Date
    },
    appliedAt: {
        type: Date
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
    }
}, {
    timestamps: true
});

// Custom validation to ensure matchScore is derived from factors
JobMatchingSchema.pre('validate', function (next) {
    const factors = this.factors;
    // Basic calculation - can be enhanced with weighted values
    const factorValues = [
        factors.skillsMatch || 0,
        factors.experienceMatch || 0,
        factors.rateMatch || 0,
        factors.locationMatch || 0,
        factors.availabilityMatch || 0,
        factors.pastPerformanceMatch || 0,
        factors.clientPreferenceMatch || 0
    ];

    const nonZeroFactors = factorValues.filter(v => v > 0);
    if (nonZeroFactors.length === 0) {
        this.matchScore = 0;
    } else {
        // Calculate average of non-zero factors
        const sum = nonZeroFactors.reduce((a, b) => a + b, 0);
        this.matchScore = Math.round(sum / nonZeroFactors.length);
    }

    next();
});

export default mongoose.model('JobMatching', JobMatchingSchema);