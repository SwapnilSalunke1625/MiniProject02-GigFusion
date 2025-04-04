import express from 'express';
import { cancelJob } from '../controllers/jobController.js'; // Import the controller function

const router = express.Router();

// Define the route for canceling a job booking
router.delete('/cancel-job/:jobId', cancelJob);

export default router; // Export the router as the default export