import mongoose from "mongoose";
import JobMatching from "../models/jobMatching.model.js";
import Project from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ServiceProvider } from "../models/serviceProvider.js";
import Proposal from "../models/proposal.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Calculate match between a project and a freelancer
const calculateMatch = asyncHandler(async (req, res) => {
    const { projectId, freelancerId } = req.params;

    // Fetch project and freelancer
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const freelancer = await User.findById(freelancerId);
    if (!freelancer || freelancer.userType !== "serviceProvider") {
        throw new ApiError(404, "Service provider not found");
    }

    // Get service provider profile
    const serviceProvider = await ServiceProvider.findOne({ userId: freelancerId });
    if (!serviceProvider) {
        throw new ApiError(404, "Service provider profile not found");
    }

    // Check for existing match
    const existingMatch = await JobMatching.findOne({
        project: projectId,
        freelancer: freelancerId
    });

    // Calculate match scores based on various factors
    const matchFactors = {
        // Skills match - compare project skills with freelancer professions
        skillsMatch: calculateSkillsMatch(project.skills, serviceProvider.professions),
        
        // Experience match - based on required experience level and freelancer experience
        experienceMatch: calculateExperienceMatch(project.experienceLevel, serviceProvider.experience),
        
        // Rate match - compare project budget with typical rates for the freelancer
        rateMatch: calculateRateMatch(project.budget, serviceProvider.totalEarnings),
        
        // Location match - if location matching matters for the project
        locationMatch: calculateLocationMatch(project, freelancer),
        
        // Availability match - based on freelancer availability
        availabilityMatch: serviceProvider.availability ? 100 : 0,
        
        // Past performance match - based on ratings
        pastPerformanceMatch: calculateRatingMatch(serviceProvider.rating)
    };

    // Create or update the match
    let jobMatch;
    if (existingMatch) {
        jobMatch = await JobMatching.findByIdAndUpdate(
            existingMatch._id,
            { 
                $set: { 
                    factors: matchFactors
                }
            },
            { new: true, runValidators: true }
        );
    } else {
        jobMatch = await JobMatching.create({
            project: projectId,
            freelancer: freelancerId,
            factors: matchFactors
        });
    }

    return res.status(200).json(
        new ApiResponse(200, jobMatch, "Match calculated successfully")
    );
});

// Get all job matches for a project
const getProjectMatches = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { minScore = 0, page = 1, limit = 10 } = req.query;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user is project owner
    if (project.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to view these matches");
    }

    // Build query
    const query = { 
        project: projectId,
        matchScore: { $gte: parseInt(minScore) }
    };

    // Pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { matchScore: -1 }, // Highest score first
        populate: { 
            path: 'freelancer', 
            select: 'fullName email avatar userType' 
        }
    };

    // Execute query with pagination
    const matches = await JobMatching.find(query)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(options.sort)
        .populate(options.populate);

    // Get total count for pagination
    const totalMatches = await JobMatching.countDocuments(query);

    // Add service provider information to each match
    const enrichedMatches = await Promise.all(matches.map(async (match) => {
        const serviceProvider = await ServiceProvider.findOne({ userId: match.freelancer._id });
        
        // Convert mongoose document to object
        const matchObj = match.toObject();
        matchObj.serviceProvider = serviceProvider;
        
        // Check if the freelancer has already submitted a proposal
        const proposal = await Proposal.findOne({
            project: projectId,
            freelancer: match.freelancer._id
        });
        
        if (proposal) {
            matchObj.proposal = {
                id: proposal._id,
                status: proposal.status,
                bidAmount: proposal.bidAmount
            };
        }
        
        return matchObj;
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            matches: enrichedMatches,
            pagination: {
                total: totalMatches,
                page: options.page,
                limit: options.limit,
                pages: Math.ceil(totalMatches / options.limit)
            }
        }, "Project matches retrieved successfully")
    );
});

// Get all project matches for a freelancer
const getFreelancerMatches = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { minScore = 0, page = 1, limit = 10 } = req.query;

    // Check if user is a service provider
    if (req.user.userType !== "serviceProvider") {
        throw new ApiError(403, "Only service providers can access their matches");
    }

    // Build query
    const query = { 
        freelancer: userId,
        matchScore: { $gte: parseInt(minScore) }
    };

    // Pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { matchScore: -1 }, // Highest score first
        populate: { 
            path: 'project',
            select: 'title description budget status client',
            populate: {
                path: 'client',
                select: 'fullName avatar'
            }
        }
    };

    // Execute query with pagination
    const matches = await JobMatching.find(query)
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort(options.sort)
        .populate(options.populate);

    // Get total count for pagination
    const totalMatches = await JobMatching.countDocuments(query);

    // Add proposal information to each match
    const enrichedMatches = await Promise.all(matches.map(async (match) => {
        // Convert mongoose document to object
        const matchObj = match.toObject();
        
        // Check if the freelancer has already submitted a proposal
        const proposal = await Proposal.findOne({
            project: match.project._id,
            freelancer: userId
        });
        
        if (proposal) {
            matchObj.proposal = {
                id: proposal._id,
                status: proposal.status,
                bidAmount: proposal.bidAmount
            };
        }
        
        return matchObj;
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            matches: enrichedMatches,
            pagination: {
                total: totalMatches,
                page: options.page,
                limit: options.limit,
                pages: Math.ceil(totalMatches / options.limit)
            }
        }, "Freelancer matches retrieved successfully")
    );
});

// Mark a match as viewed, saved, or applied
const updateMatchStatus = asyncHandler(async (req, res) => {
    const { matchId } = req.params;
    const { action } = req.body;

    if (!action || !['view', 'save', 'apply'].includes(action)) {
        throw new ApiError(400, "Valid action (view, save, or apply) must be provided");
    }

    // Find the match
    const match = await JobMatching.findById(matchId);
    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    // Check permission - only the freelancer or project owner can update status
    const project = await Project.findById(match.project);
    
    if (
        match.freelancer.toString() !== req.user._id.toString() &&
        project.client.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "You don't have permission to update this match");
    }

    // Update status based on action
    const updates = {};
    
    if (action === 'view' && !match.isViewed) {
        updates.isViewed = true;
        updates.viewedAt = new Date();
    } else if (action === 'save') {
        updates.isSaved = !match.isSaved; // Toggle saved status
        if (!match.isSaved) {
            updates.savedAt = new Date();
        }
    } else if (action === 'apply') {
        updates.isApplied = true;
        updates.appliedAt = new Date();
        
        // Check if there's already a proposal
        const existingProposal = await Proposal.findOne({
            project: match.project,
            freelancer: match.freelancer
        });
        
        if (existingProposal) {
            updates.applicationId = existingProposal._id;
        }
    }

    // Update the match with new status
    const updatedMatch = await JobMatching.findByIdAndUpdate(
        matchId,
        { $set: updates },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedMatch, `Match ${action} status updated successfully`)
    );
});

const viewProjectMatch = asyncHandler(async (req, res) => {
    const { matchId } = req.params;

    const match = await JobMatching.findById(matchId)
        .populate({
            path: 'project',
            select: 'title description' // Populate project details
        })
        .populate({
            path: 'freelancer',
            select: 'fullName email' // Populate freelancer details
        });

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    // Optionally, update the isViewed status when viewing the match
    match.isViewed = true;
    match.viewedAt = new Date();
    await match.save();

    return res.status(200).json(new ApiResponse(200, { match }, "Match viewed successfully"));
});

// Generate recommended matches for all open projects
const generateRecommendations = asyncHandler(async (req, res) => {
    // Only allow admin access
    if (req.user.userType !== "admin") {
        throw new ApiError(403, "Only admins can trigger this operation");
    }

    // Find all open projects
    const openProjects = await Project.find({ status: 'open' });
    
    // Find all service providers
    const serviceProviders = await User.find({ userType: 'serviceProvider' });
    
    let matchesCreated = 0;
    let matchesUpdated = 0;

    // For each project, calculate matches with each service provider
    for (const project of openProjects) {
        for (const provider of serviceProviders) {
            try {
                // Check for existing match
                const existingMatch = await JobMatching.findOne({
                    project: project._id,
                    freelancer: provider._id
                });

                // Get service provider profile
                const serviceProvider = await ServiceProvider.findOne({ userId: provider._id });
                if (!serviceProvider) continue;

                // Calculate match scores
                const matchFactors = {
                    skillsMatch: calculateSkillsMatch(project.skills, serviceProvider.professions),
                    experienceMatch: calculateExperienceMatch(project.experienceLevel, serviceProvider.experience),
                    rateMatch: calculateRateMatch(project.budget, serviceProvider.totalEarnings),
                    locationMatch: calculateLocationMatch(project, provider),
                    availabilityMatch: serviceProvider.availability ? 100 : 0,
                    pastPerformanceMatch: calculateRatingMatch(serviceProvider.rating)
                };

                // Only recommend if match score is above threshold (e.g. 50)
                let isRecommended = false;
                const factorValues = Object.values(matchFactors).filter(v => v > 0);
                const avgScore = factorValues.length > 0 
                    ? Math.round(factorValues.reduce((a, b) => a + b, 0) / factorValues.length) 
                    : 0;
                
                if (avgScore >= 50) {
                    isRecommended = true;
                }

                // Create or update the match
                if (existingMatch) {
                    await JobMatching.findByIdAndUpdate(
                        existingMatch._id,
                        { 
                            $set: { 
                                factors: matchFactors,
                                isRecommended
                            }
                        }
                    );
                    matchesUpdated++;
                } else {
                    await JobMatching.create({
                        project: project._id,
                        freelancer: provider._id,
                        factors: matchFactors,
                        isRecommended
                    });
                    matchesCreated++;
                }
            } catch (error) {
                console.error(`Error calculating match for project ${project._id} and provider ${provider._id}:`, error);
            }
        }
    }

    return res.status(200).json(
        new ApiResponse(200, {
            matchesCreated,
            matchesUpdated,
            total: matchesCreated + matchesUpdated
        }, "Recommendations generated successfully")
    );
});

// Helper functions for match calculation
function calculateSkillsMatch(projectSkills, freelancerProfessions) {
    if (!projectSkills.length || !freelancerProfessions.length) return 0;
    
    // Convert to lowercase for case-insensitive comparison
    const normalizedProjectSkills = projectSkills.map(skill => skill.toLowerCase());
    const normalizedFreelancerSkills = freelancerProfessions.map(skill => skill.toLowerCase());
    
    // Count matching skills
    let matchCount = 0;
    for (const skill of normalizedProjectSkills) {
        if (normalizedFreelancerSkills.some(freelancerSkill => 
            freelancerSkill.includes(skill) || skill.includes(freelancerSkill)
        )) {
            matchCount++;
        }
    }
    
    // Calculate percentage match
    return Math.round((matchCount / normalizedProjectSkills.length) * 100);
}

function calculateExperienceMatch(requiredExperience, freelancerExperience) {
    // Map experience levels to years
    const experienceLevels = {
        'beginner': { min: 0, max: 2 },
        'intermediate': { min: 2, max: 5 },
        'expert': { min: 5, max: 100 }
    };
    
    const required = experienceLevels[requiredExperience];
    
    // If freelancer experience is within or above required range
    if (freelancerExperience >= required.min) {
        if (freelancerExperience <= required.max) {
            return 100; // Perfect match
        } else {
            return 80; // Over-qualified
        }
    } else {
        // Below required, calculate percentage of minimum
        return Math.min(100, Math.round((freelancerExperience / required.min) * 100));
    }
}

function calculateRateMatch(projectBudget, freelancerEarnings) {
    // Simple placeholder logic - more sophisticated pricing logic would be needed
    // This assumes higher earnings correlate with higher rates
    if (!freelancerEarnings) return 50; // Neutral for new freelancers
    
    const avgBudget = (projectBudget.minAmount + projectBudget.maxAmount) / 2;
    
    // Higher earning freelancers might be less matched with low budget projects
    if (freelancerEarnings > 10000 && avgBudget < 500) {
        return 40;
    }
    
    // Lower earning freelancers might be well matched with lower budget projects
    if (freelancerEarnings < 5000 && avgBudget < 1000) {
        return 90;
    }
    
    return 70; // Default reasonable match
}

function calculateLocationMatch(project, freelancer) {
    // Check if states match (preferred for some projects)
    if (freelancer.state === project.client.state) {
        return 100;
    }
    
    return 70; // Default for different location (remote work is common)
}

function calculateRatingMatch(rating) {
    if (!rating || rating === 0) return 50; // Neutral for unrated freelancers
    
    // Scale 0-5 rating to a percentage
    return Math.round((rating / 5) * 100);
}

export {
    calculateMatch,
    getProjectMatches,
    getFreelancerMatches,
    updateMatchStatus,
    generateRecommendations,
    viewProjectMatch
};
