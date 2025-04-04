import { Router } from "express";
import {
    submitProposal,
    getProjectProposals,
    getProposalById,
    getUserProposals,
    updateProposal,
    withdrawProposal,
    handleProposalStatus
} from "../controllers/proposal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All proposal routes require authentication
router.use(verifyJWT);

// Freelancer routes
router.post("/projects/:projectId/proposals", submitProposal); // Submit a proposal
router.get("/my-proposals", getUserProposals); // Get all proposals submitted by user
router.put("/proposals/:proposalId", updateProposal); // Update a proposal
router.patch("/proposals/:proposalId/withdraw", withdrawProposal); // Withdraw a proposal

// Client routes
router.get("/projects/:projectId/proposals", getProjectProposals); // Get all proposals for a project
router.patch("/proposals/:proposalId/status", handleProposalStatus); // Accept or reject a proposal

// Common routes
router.get("/proposals/:proposalId", getProposalById); // Get proposal by ID

export default router;
