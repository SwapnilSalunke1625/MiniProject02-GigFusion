import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a project title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a project description'],
        maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project must belong to a client']
    },
    category: {
        type: String,
        enum: ['web-development', 'mobile-development', 'ui-ux-design', 'graphic-design', 'content-writing', 'video-editing', 'audio-editing', 'data-entry', 'virtual-assistant', 'other'],
        required: [true, 'Please specify a category']
    },
    skills: {
        type: [String],
        required: [true, 'Please specify at least one required skill'],
        validate: {
            validator: function (val) {
                return val.length > 0;
            },
            message: 'Please add at least one skill'
        }
    },
    budget: {
        minAmount: {
            type: Number,
            required: [true, 'Please specify minimum budget amount'],
            min: [0, 'Budget cannot be negative']
        },
        maxAmount: {
            type: Number,
            required: [true, 'Please specify maximum budget amount'],
            min: [0, 'Budget cannot be negative']
        },
        currency: {
            type: String,
            required: [true, 'Please specify currency'],
            default: 'INR',
            enum: ['USD', 'EUR', 'GBP', 'BTC', 'ETH', 'INR'] // Add other currencies as needed
        }
    },
    paymentType: {
        type: String,
        required: [true, 'Please specify payment type'],
        enum: {
            values: ['fixed', 'hourly'],
            message: '{VALUE} is not supported'
        }
    },
    duration: {
        type: String,
        required: [true, 'Please specify project duration'],
        enum: {
            values: ['less-than-1-week', '1-2-weeks', '2-4-weeks', '1-3-months', '3-6-months', 'more-than-6-months'],
            message: '{VALUE} is not supported'
        }
    },
    experienceLevel: {
        type: String,
        required: [true, 'Please specify required experience level'],
        enum: {
            values: ['beginner', 'intermediate', 'expert'],
            message: '{VALUE} is not supported'
        }
    },
    attachments: {
        type: [String]
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['open', 'in-progress', 'completed', 'cancelled'],
            message: '{VALUE} is not supported'
        },
        default: 'open'
    },
    visibility: {
        type: String,
        required: true,
        enum: {
            values: ['public', 'private', 'invite-only'],
            message: '{VALUE} is not supported'
        },
        default: 'public'
    },
    proposals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Proposal'
        }
    ],
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    escrow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Escrow'
    },
    smartContract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SmartContract'
    },
    milestones: [
        {
            title: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true
            },
            dueDate: {
                type: Date,
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: [0, 'Amount cannot be negative']
            },
            status: {
                type: String,
                required: true,
                enum: ['pending', 'in-progress', 'completed', 'approved', 'rejected'],
                default: 'pending'
            },
            completedAt: {
                type: Date
            },
            approvedAt: {
                type: Date
            },
            rejectedAt: {
                type: Date
            },
            feedback: {
                type: String
            }
        }
    ],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    completionDate: {
        type: Date
    },
    rating: {
        type: Number,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for total budget
ProjectSchema.virtual('totalBudget').get(function () {
    if (this.milestones && this.milestones.length > 0) {
        return this.milestones.reduce(function (total, milestone) { return total + milestone.amount; }, 0);
    }
    return (this.budget.minAmount + this.budget.maxAmount) / 2;
});

// Virtual for completion percentage
ProjectSchema.virtual('completionPercentage').get(function () {
    if (!this.milestones || this.milestones.length === 0) {
        return 0;
    }
    var completedMilestones = this.milestones.filter(function (milestone) { return ['completed', 'approved'].includes(milestone.status); }).length;
    return Math.round((completedMilestones / this.milestones.length) * 100);
});

export default mongoose.model('Project', ProjectSchema);