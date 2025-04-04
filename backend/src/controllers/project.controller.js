import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
let Project; // Declare Project outside the asyncHandler

// Create a new project
const createProject = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const {
        title,
        description,
        category,
        skills,
        budget,
        paymentType,
        duration,
        experienceLevel
    } = req.body;

    // Check for required fields
    if (!title || !description || !category || !skills || !budget || !paymentType || !duration || !experienceLevel) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Ensure skills is an array
    if (!Array.isArray(skills) || skills.length === 0) {
        throw new ApiError(400, "At least one skill must be provided");
    }

    // Validate budget
    if (!budget.minAmount || !budget.maxAmount || !budget.currency) {
        throw new ApiError(400, "Budget must include minAmount, maxAmount, and currency");
    }

    if (budget.minAmount > budget.maxAmount) {
        throw new ApiError(400, "Minimum budget cannot be greater than maximum budget");
    }

    // Create the project
    const project = await Project.create({
        title,
        description,
        client: req.user._id, // Client ID from authenticated user
        category,
        skills,
        budget,
        paymentType,
        duration,
        experienceLevel,
        attachments: req.body.attachments || [],
        visibility: req.body.visibility || "public",
        milestones: req.body.milestones || []
    });

    return res.status(201).json(
        new ApiResponse(201, project, "Project created successfully")
    );
});

// Get all projects with filters
const getAllProjects = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const {
        category,
        skills,
        minBudget,
        maxBudget,
        status,
        experienceLevel,
        page = 1,
        limit = 10
    } = req.query;

    // Build query
    const query = {};

    // Apply filters if provided
    if (category) query.category = category;
    if (status) query.status = status;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    // Filter by skills (if any match)
    if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
        query.skills = { $in: skillsArray };
    }

    // Filter by budget range
    if (minBudget || maxBudget) {
        query.budget = {};
        if (minBudget) query.budget.$gte = Number(minBudget);
        if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: [
            { path: 'client', select: 'fullName email avatar' },
            { path: 'proposals', select: 'bidAmount status' }
        ]
    };

    // Execute query with pagination
    const projects = await Project.find(query)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(options.sort)
        .populate(options.populate[0])
        .populate(options.populate[1]);

    // Get total count for pagination
    const totalProjects = await Project.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            projects,
            pagination: {
                total: totalProjects,
                page: options.page,
                limit: options.limit,
                pages: Math.ceil(totalProjects / options.limit)
            }
        }, "Projects retrieved successfully")
    );
});

// Get a project by ID
const getProjectById = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
        .populate('client', 'fullName email avatar')
        .populate('proposals')
        .populate('freelancer', 'fullName email avatar');

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(200, project, "Project retrieved successfully")
    );
});

// Get projects created by authenticated user (client)
const getUserProjects = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { client: userId };
    if (status) query.status = status;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 },
        populate: [
            { path: 'proposals', select: 'bidAmount status freelancer' },
            { path: 'freelancer', select: 'fullName email avatar' }
        ]
    };

    // Execute query with pagination
    const projects = await Project.find(query)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(options.sort)
        .populate(options.populate[0])
        .populate(options.populate[1]);

    // Get total count for pagination
    const totalProjects = await Project.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            projects,
            pagination: {
                total: totalProjects,
                page: options.page,
                limit: options.limit,
                pages: Math.ceil(totalProjects / options.limit)
            }
        }, "User projects retrieved successfully")
    );
});

// Update a project
const updateProject = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { projectId } = req.params;
    const updates = req.body;

    // Find the project first
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user is the owner of the project
    if (project.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this project");
    }

    // Check project status - only allow updates to 'open' projects
    if (project.status !== 'open') {
        throw new ApiError(400, "Cannot update project that is not in 'open' status");
    }

    // Budget validation if provided
    if (updates.budget) {
        if (updates.budget.minAmount > updates.budget.maxAmount) {
            throw new ApiError(400, "Minimum budget cannot be greater than maximum budget");
        }
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('client', 'fullName email avatar');

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    );
});

// Delete a project
const deleteProject = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { projectId } = req.params;

    // Find the project first
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user is the owner of the project
    if (project.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this project");
    }

    // Check project status - only allow deletion of 'open' projects without accepted proposals
    if (project.status !== 'open') {
        throw new ApiError(400, "Cannot delete project that is not in 'open' status");
    }

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

// Change project status
const changeProjectStatus = asyncHandler(async (req, res) => {
    if (!Project) {
        Project = (await import('../models/project.model.js')).default;
    }
    const { projectId } = req.params;
    const { status } = req.body;

    if (!status || !['open', 'in-progress', 'completed', 'cancelled'].includes(status)) {
        throw new ApiError(400, "Valid status must be provided");
    }

    // Find the project first
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user is the owner of the project
    if (project.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to change this project's status");
    }

    // Validate status transitions
    if (project.status === 'completed' && status !== 'completed') {
        throw new ApiError(400, "Cannot change status of a completed project");
    }

    if (project.status === 'cancelled' && status !== 'cancelled') {
        throw new ApiError(400, "Cannot change status of a cancelled project");
    }

    // Additional validation: if setting to 'in-progress', ensure a freelancer is assigned
    if (status === 'in-progress' && !project.freelancer) {
        throw new ApiError(400, "Cannot set project to 'in-progress' without assigning a freelancer");
    }

    // Update status and relevant dates
    const updates = { status };

    if (status === 'in-progress' && !project.startDate) {
        updates.startDate = new Date();
    } else if (status === 'completed') {
        updates.completionDate = new Date();
        updates.endDate = new Date();
    } else if (status === 'cancelled') {
        updates.endDate = new Date();
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('client', 'fullName email avatar')
        .populate('freelancer', 'fullName email avatar');

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project status updated successfully")
    );
});

export {
    createProject,
    getAllProjects,
    getProjectById,
    getUserProjects,
    updateProject,
    deleteProject,
    changeProjectStatus
};
