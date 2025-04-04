import { Router } from "express";
import {
    createEscrow,
    getEscrowByProject,
    getEscrowById,
    fundEscrow,
    releaseFunds,
    initiateDispute,
    resolveDispute,
    getUserEscrows
} from "../controllers/escrow.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All escrow routes require authentication
router.use(verifyJWT);

// Create a new escrow for a project
router.post("/projects/:projectId/escrow", createEscrow);

// Get escrow details by project ID
router.get("/projects/:projectId/escrow", getEscrowByProject);

// Get escrow details by ID
router.get("/escrows/:escrowId", getEscrowById);

// Get all escrows for the authenticated user
router.get("/escrows", getUserEscrows);

// Fund an escrow or milestone
router.post("/escrows/:escrowId/fund", fundEscrow);

// Release funds from an escrow milestone
router.post("/escrows/:escrowId/release", releaseFunds);

// Request refund or dispute an escrow
router.post("/escrows/:escrowId/dispute", initiateDispute);

// Resolve a dispute (admin only)
router.post("/escrows/:escrowId/resolve", resolveDispute);

export default router;
