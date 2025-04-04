import mongoose from "mongoose";

const EscrowSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Escrow must be associated with a project"],
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Escrow must have a client"],
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Escrow must have a freelancer"],
    },
    totalAmount: {
        type: Number,
        required: [true, "Please specify total amount"],
        min: [0, "Amount cannot be negative"],
    },
    currency: {
        type: String,
        required: [true, "Please specify currency"],
        enum: ["USD", "EUR", "GBP", "BTC", "ETH", "INR"], // Add other currencies as needed
    },
    paymentType: {
        type: String,
        required: [true, "Please specify payment type"],
        enum: {
            values: ["traditional", "crypto"],
            message: "{VALUE} is not supported",
        },
        default: "traditional",
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [
                "pending",
                "funded",
                "partially-released",
                "released",
                "refunded",
                "disputed",
            ],
            message: "{VALUE} is not supported",
        },
        default: "pending",
    },
    milestones: [
        {
            title: {
                type: String,
                required: true,
                trim: true,
            },
            description: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
                min: [0, "Amount cannot be negative"],
            },
            dueDate: {
                type: Date,
                required: true,
            },
            status: {
                type: String,
                required: true,
                enum: ["pending", "funded", "released", "disputed"],
                default: "pending",
            },
            fundedAt: {
                type: Date,
            },
            releasedAt: {
                type: Date,
            },
            disputedAt: {
                type: Date,
            },
        },
    ],
    transactions: [
        {
            type: {
                type: String,
                required: true,
                enum: ["fund", "release", "refund"],
            },
            amount: {
                type: Number,
                required: true,
                min: [0, "Amount cannot be negative"],
            },
            date: {
                type: Date,
                required: true,
                default: Date.now,
            },
            reference: {
                type: String,
            },
            status: {
                type: String,
                required: true,
                enum: ["pending", "completed", "failed"],
                default: "pending",
            },
        },
    ],
    smartContractAddress: {
        type: String,
    },
    expiryDate: {
        type: Date,
    },
    disputeReason: {
        type: String,
    },
    disputeStatus: {
        type: String,
        enum: ["open", "client-favor", "freelancer-favor", "settled"],
    },
    disputeResolvedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for released amount
EscrowSchema.virtual("releasedAmount").get(function () {
    if (!this.transactions || this.transactions.length === 0) {
        return 0;
    }
    return this.transactions
        .filter(function (transaction) {
            return transaction.type === "release" && transaction.status === "completed";
        })
        .reduce(function (total, transaction) { return total + transaction.amount; }, 0);
});
// Virtual for remaining amount
EscrowSchema.virtual("remainingAmount").get(function () {
    var released = this.transactions
        .filter(function (transaction) {
            return transaction.type === "release" && transaction.status === "completed";
        })
        .reduce(function (total, transaction) { return total + transaction.amount; }, 0);
    var refunded = this.transactions
        .filter(function (transaction) {
            return transaction.type === "refund" && transaction.status === "completed";
        })
        .reduce(function (total, transaction) { return total + transaction.amount; }, 0);
    return this.totalAmount - released - refunded;
});

EscrowSchema.statics.createEscrow = async function (project, client, freelancer, totalAmount, currency, paymentType, milestones) {
    try {
        const escrow = await this.create({
            project: project._id,
            client: client,
            freelancer: freelancer._id,
            totalAmount: totalAmount,
            currency: currency,
            paymentType: paymentType,
            milestones: milestones,
        });
        return escrow;
    } catch (error) {
        console.error("Error creating escrow:", error);
        throw error; // Re-throw the error to be caught by the asyncHandler
    }
};

export default mongoose.model("Escrow", EscrowSchema);