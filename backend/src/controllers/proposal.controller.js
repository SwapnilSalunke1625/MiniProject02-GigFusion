import Proposal from "../models/proposal.model.js";
// import Project from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Escrow from "../models/escrow.model.js"; // Import the Escrow model
let Project;

// Submit a proposal for a project
const submitProposal = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { projectId } = req.params;
    const {
        coverLetter,
        bidAmount,
        bidType,
        currency,
        estimatedDuration,
        milestones
    } = req.body;

    // Validate required fields
    if (!coverLetter || !bidAmount || !bidType || !estimatedDuration) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Get the project to validate
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if project is open for proposals
    if (project.status !== 'open') {
        throw new ApiError(400, "Project is not open for proposals");
    }

    // Check if user has already submitted a proposal for this project
    const existingProposal = await Proposal.findOne({
        project: projectId,
        freelancer: req.user._id
    });

    if (existingProposal) {
        throw new ApiError(400, "You have already submitted a proposal for this project");
    }

    // Validate bid amount against project budget
    if (bidAmount < project.budget.minAmount || bidAmount > project.budget.maxAmount) {
        throw new ApiError(400, `Bid amount must be between ${project.budget.minAmount} and ${project.budget.maxAmount}`);
    }

    // Validate bid type matches project payment type
    if (bidType !== project.paymentType) {
        throw new ApiError(400, `Bid type must match project payment type: ${project.paymentType}`);
    }

    // Create the proposal
    const proposal = await Proposal.create({
        project: projectId,
        freelancer: req.user._id,
        coverLetter,
        attachments: req.body.attachments || [],
        bidAmount,
        bidType,
        currency: currency || 'USD',
        estimatedDuration,
        milestones: milestones || [],
        status: 'pending'
    });

    // Update project with proposal reference
    await Project.findByIdAndUpdate(
        projectId,
        { $push: { proposals: proposal._id } }
    );

    return res.status(201).json(
        new ApiResponse(201, proposal, "Proposal submitted successfully")
    );
});

// Get all proposals for a specific project (for project owner)
const getProjectProposals = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { projectId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Get the project
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user is project owner
    if (project.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to view these proposals");
    }

    // Build query
    const query = { project: projectId };
    if (status) query.status = status;

    // Pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: { path: 'freelancer', select: 'fullName email avatar' }
    };

    // Execute query with pagination
    const proposals = await Proposal.find(query)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(options.sort)
        .populate(options.populate);

    // Get total count for pagination
    const totalProposals = await Proposal.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            proposals,
            pagination: {
                total: totalProposals,
                page: options.page,
                limit: options.limit,
                pages: Math.ceil(totalProposals / options.limit)
            }
        }, "Proposals retrieved successfully")
    );
});

// Get a proposal by ID
const getProposalById = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { proposalId } = req.params;

    const proposal = await Proposal.findById(proposalId)
        .populate('project')
        .populate('freelancer', 'fullName email avatar');

    if (!proposal) {
        throw new ApiError(404, "Proposal not found");
    }

    // Check permission - only the proposal owner or project owner can view
    const project = await Project.findById(proposal.project);
    if (
        proposal.freelancer._id.toString() !== req.user._id.toString() &&
        project.client.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "You don't have permission to view this proposal");
    }

    return res.status(200).json(
        new ApiResponse(200, proposal, "Proposal retrieved successfully")
    );
});

// Get all proposals submitted by the authenticated freelancer
const getUserProposals = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { freelancer: userId };
    if (status) query.status = status;

    // Pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: {
            path: 'project',
            select: 'title budget status client',
            populate: {
                path: 'client',
                select: 'fullName email avatar'
            }
        }
    };

    // Execute query with pagination
    const proposals = await Proposal.find(query)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(options.sort)
        .populate(options.populate);

    // Get total count for pagination
    const totalProposals = await Proposal.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            proposals,
            pagination: {
                total: totalProposals,
                page: options.page,
                limit: options.limit,
                pages: Math.ceil(totalProposals / options.limit)
            }
        }, "User proposals retrieved successfully")
    );
});

// Update a proposal
const updateProposal = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { proposalId } = req.params;
    const updates = req.body;

    // Find the proposal first
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
        throw new ApiError(404, "Proposal not found");
    }

    // Check if user is the owner of the proposal
    if (proposal.freelancer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this proposal");
    }

    // Check proposal status - only allow updates to 'pending' proposals
    if (proposal.status !== 'pending') {
        throw new ApiError(400, "Cannot update proposal that is not in 'pending' status");
    }

    // Get the project to validate updates
    const project = await Project.findById(proposal.project);

    // Validate bid amount if included in updates
    if (updates.bidAmount) {
        if (updates.bidAmount < project.budget.minAmount || updates.bidAmount > project.budget.maxAmount) {
            throw new ApiError(400, `Bid amount must be between ${project.budget.minAmount} and ${project.budget.maxAmount}`);
        }
    }

    // Update the proposal
    const updatedProposal = await Proposal.findByIdAndUpdate(
        proposalId,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('freelancer', 'fullName email avatar');

    return res.status(200).json(
        new ApiResponse(200, updatedProposal, "Proposal updated successfully")
    );
});

// Delete/withdraw a proposal
const withdrawProposal = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { proposalId } = req.params;

    // Find the proposal first
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
        throw new ApiError(404, "Proposal not found");
    }

    // Check if user is the owner of the proposal
    if (proposal.freelancer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to withdraw this proposal");
    }

    // Check proposal status - only allow withdrawal of 'pending' proposals
    if (proposal.status !== 'pending') {
        throw new ApiError(400, "Cannot withdraw proposal that is not in 'pending' status");
    }

    // Update proposal status to 'withdrawn' instead of deleting
    const withdrawnProposal = await Proposal.findByIdAndUpdate(
        proposalId,
        {
            $set: {
                status: 'withdrawn',
                withdrawnAt: new Date()
            }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, withdrawnProposal, "Proposal withdrawn successfully")
    );
});

// Accept or reject a proposal (for project owners)
const handleProposalStatus = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { proposalId } = req.params;
    const { status } = req.body;

    if (!status || !['accepted', 'rejected', 'pending', 'withdrawn'].includes(status)) {
        throw new ApiError(400, "Valid status (accepted, rejected, pending, or withdrawn) must be provided");
    }

    // Find the proposal first
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
        throw new ApiError(404, "Proposal not found");
    }

    // Get the project to check ownership
    const project = await Project.findById(proposal.project);

    // Check if user is the owner of the project
    if (project.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to manage this proposal");
    }

    // Check if the proposal is pending
    if (proposal.status !== 'pending') {
        throw new ApiError(400, `Cannot ${status} a proposal that is not pending`);
    }

    // Create updates object with status and timestamp
    const updates = {
        status: status,
        [status === 'accepted' ? 'acceptedAt' : 'rejectedAt']: new Date()
    };

    // If accepting the proposal, update the project with the freelancer
    if (status === 'accepted') {
        // Check if another proposal is already accepted
        const acceptedProposal = await Proposal.findOne({
            project: proposal.project,
            status: 'accepted'
        });

        if (acceptedProposal) {
            throw new ApiError(400, "Another proposal has already been accepted for this project");
        }

        // Update project with freelancer ID
        const updatedProject = await Project.findByIdAndUpdate(
            proposal.project,
            {
                $set: {
                    freelancer: proposal.freelancer,
                    status: 'in-progress',
                }
            },
            { new: true }
        );

        // Create escrow
        // const totalAmount = project.budget.maxAmount;
        // const paymentType = project?.paymentType || 'traditional';
        // const currency = project.budget.currency || 'INR';

        // const escrow = await Escrow.create({
        //     project: proposal.project,
        //     client: req.user._id,
        //     freelancer: proposal.freelancer._id,
        //     totalAmount,
        //     currency,
        //     paymentType,
        //     status: 'pending',
        //     milestones: project.milestones || [{
        //         title: "Project Completion",
        //         description: "Full payment upon project completion",
        //         amount: totalAmount,
        //         dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        //         status: 'pending'
        //     }],
        //     expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months from now
        // });
        console.log('Saving escrow');
        let milestones = project.milestones || [
            {
                title: "Project Completion",
                description: "Full payment upon project completion",
                amount: project.budget.maxAmount,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                status: 'pending'
            }
        ];
        const escrow = await Escrow.createEscrow(project, req.user._id, proposal.freelancer, project.budget.maxAmount, 'INR', 'traditional', milestones);

        if (!escrow) {
            throw new ApiError(500, "Failed to create escrow for this project");
        }

        // Update project with escrow reference
        updatedProject.escrow = escrow._id;
        await updatedProject.save();

        // Reject all other pending proposals
        await Proposal.updateMany(
            {
                project: proposal.project,
                _id: { $ne: proposalId },
                status: 'pending'
            },
            {
                $set: {
                    status: 'rejected',
                    rejectedAt: new Date()
                }
            }
        );
    }

    // Update the proposal status
    const updatedProposal = await Proposal.findByIdAndUpdate(
        proposalId,
        { $set: updates },
        { new: true }
    ).populate('freelancer', 'fullName email avatar');

    return res.status(200).json(
        new ApiResponse(200, updatedProposal, `Proposal ${status} successfully`)
    );
});

export {
    submitProposal,
    getProjectProposals,
    getProposalById,
    getUserProposals,
    updateProposal,
    withdrawProposal,
    handleProposalStatus
};
