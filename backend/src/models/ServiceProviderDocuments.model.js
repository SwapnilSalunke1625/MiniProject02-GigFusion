import mongoose from 'mongoose';

const workerDocumentSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true,
        unique: true
    },
    IdentityProof: {
        type: String, // cloudinary document url
        required: true,
        // enum: ['Aadhar Card', 'Voter ID', 'Driving License', 'Passport']
    },
    IdentityProofNumber: {
        type: String,
        required: true,
        unique: true,
    },
    AddressProof: {
        type: String, // cloudinary document url
        required: true,
        // enum: ['Electricity Bill', 'Water Bill', 'Gas Bill', 'Telephone Bill']
    },
    AddressProofNumber: {
        type: String,
        required: true,
        unique: true,
    },
    BankDetails: {
        type: String,
        required: true
    },
    BankAccountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    IFSCCode: {
        type: String,
        required: true
    },
    BankBranch: {
        type: String,
        required: true
    },
    BankName: {
        type: String,
        required: true
    },
    authorized: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default mongoose.model('WorkerDocuments', workerDocumentSchema);