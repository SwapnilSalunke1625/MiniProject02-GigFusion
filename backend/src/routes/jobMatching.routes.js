import { Router } from "express";
import {
    calculateMatch,
    getProjectMatches,
    getFreelancerMatches,
    updateMatchStatus,
    generateRecommendations,
    viewProjectMatch
} from "../controllers/jobMatching.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Calculate match between a project and freelancer
router.post("/projects/:projectId/freelancers/:freelancerId/match", calculateMatch);

// Get matches for a project (client only)
router.get("/projects/:projectId/matches", getProjectMatches);

// Get matches for a freelancer (current authenticated user)
router.get("/my-matches", getFreelancerMatches);

// Update match status (view, save, apply)
router.patch("/matches/:matchId/status", updateMatchStatus);

// Admin route to generate recommendations
router.post("/generate-recommendations", generateRecommendations);

// View a project match
router.get("/matches/:matchId", viewProjectMatch);

export default router;
