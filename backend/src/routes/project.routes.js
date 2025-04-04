import { Router } from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    getUserProjects,
    updateProject,
    deleteProject,
    changeProjectStatus
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes (accessible without authentication)
router.get("/", getAllProjects); // Get all projects with filters (public viewable)
router.get("/:projectId", getProjectById); // Get a specific project by ID

// Protected routes (require authentication)
router.use(verifyJWT); // Apply authentication middleware to routes below

// Client project management
router.post("/", createProject); // Create a new project
router.get("/user/projects", getUserProjects); // Get authenticated user's projects
router.put("/:projectId", updateProject); // Update a project
router.delete("/:projectId", deleteProject); // Delete a project
router.patch("/:projectId/status", changeProjectStatus); // Change project status

export default router;
