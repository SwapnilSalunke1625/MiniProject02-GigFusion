import mongoose from "mongoose";

const ProposalSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Proposal must be for a project']
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Proposal must be from a freelancer']
    },
    coverLetter: {
        type: String,
        required: [true, 'Please provide a cover letter/proposal description'],
        maxlength: [3000, 'Cover letter cannot be more than 3000 characters']
    },
    attachments: {
        type: [String]
    },
    bidAmount: {
        type: Number,
        required: [true, 'Please specify bid amount'],
        min: [0, 'Bid amount cannot be negative']
    },
    bidType: {
        type: String,
        required: [true, 'Please specify bid type'],
        enum: {
            values: ['fixed', 'hourly'],
            message: '{VALUE} is not supported'
        }
    },
    currency: {
        type: String,
        required: [true, 'Please specify currency'],
        default: 'INR',
        enum: ['USD', 'EUR', 'GBP', 'BTC', 'ETH', "INR"] // Add other currencies as needed
    },
    estimatedDuration: {
        type: String,
        required: [true, 'Please specify estimated duration'],
        enum: {
            values: ['less-than-1-week', '1-2-weeks', '2-4-weeks', '1-3-months', '3-6-months', 'more-than-6-months'],
            message: '{VALUE} is not supported'
        }
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
            amount: {
                type: Number,
                required: true,
                min: [0, 'Amount cannot be negative']
            },
            dueDate: {
                type: Date
            }
        }
    ],
    status: {
        type: String,
        required: true,
        enum: {
            values: ['pending', 'accepted', 'rejected', 'withdrawn'],
            message: '{VALUE} is not supported'
        },
        default: 'pending'
    },
    acceptedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    },
    withdrawnAt: {
        type: Date
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
    }
}, {
    timestamps: true
});
// Compound index to ensure a freelancer can only submit one proposal per project
ProposalSchema.index({ project: 1, freelancer: 1 }, { unique: true });

export default mongoose.model('Proposal', ProposalSchema);