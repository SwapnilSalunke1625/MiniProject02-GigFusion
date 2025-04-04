
import { JobPost } from '../models/jobPost.model.js';

// Cancel job function
export const cancelJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        // Find the job by ID and delete it
        const job = await JobPost.findByIdAndDelete(jobId);  // Updated to JobPost

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling job:', error);
        res.status(500).json({ message: 'Failed to cancel booking' });
    }
};
