import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService, projectService } from '../services';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const CreateProposal = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [proposalData, setProposalData] = useState({
        coverLetter: '',
        bidAmount: '',
        bidType: 'fixed',
        currency: 'INR',
        estimatedDuration: 'less-than-1-week',
        milestones: []
    });
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const durations = [
        { id: 'less-than-1-week', name: 'Less than 1 week' },
        { id: '1-2-weeks', name: '1-2 weeks' },
        { id: '2-4-weeks', name: '2-4 weeks' },
        { id: '1-3-months', name: '1-3 months' },
        { id: '3-6-months', name: '3-6 months' },
        { id: 'more-than-6-months', name: 'More than 6 months' }
    ];

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await projectService.getProjectById(projectId);

            if (response.statusCode === 200) {
                setProject(response.data);
                setProposalData(prev => ({
                    ...prev,
                    bidType: response.data.paymentType.toLowerCase()
                }));
            } else {
                throw new Error(response.message || 'Failed to load project details');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
            toast.error('Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProposalData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await proposalService.submitProposal(projectId, proposalData);

            if (response.statusCode === 201) {
                toast.success('Proposal submitted successfully!');
                navigate(`/projects/${projectId}`);
            } else {
                toast.error(response.message || 'Failed to submit proposal');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit proposal');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error || 'Project not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-stdBlue to-blue-500 p-6 text-white">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4">
                        <FaArrowLeft />
                        <span>Back to Project</span>
                    </button>
                    <h1 className="text-3xl font-bold">Submit a Proposal</h1>
                    <p className="mt-2 text-gray-50">
                        Submit your proposal for the project: {project.title}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Cover Letter */}
                    <div>
                        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                            Cover Letter
                        </label>
                        <textarea
                            id="coverLetter"
                            name="coverLetter"
                            rows="4"
                            value={proposalData.coverLetter}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
                            required
                        />
                    </div>

                    {/* Bid Amount */}
                    <div>
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
                            Bid Amount ({project.budget.currency})
                        </label>
                        <input
                            type="number"
                            id="bidAmount"
                            name="bidAmount"
                            value={proposalData.bidAmount}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
                            required
                            min={project.budget.minAmount}
                            max={project.budget.maxAmount}
                        />
                        <p className="text-gray-500 text-sm mt-1">
                            Enter an amount between {project.budget.minAmount} and {project.budget.maxAmount} {project.budget.currency}
                        </p>
                    </div>

                    {/* Bid Type */}
                    <div>
                        <label htmlFor="bidType" className="block text-sm font-medium text-gray-700">
                            Bid Type
                        </label>
                        <input
                            type="text"
                            id="bidType"
                            name="bidType"
                            value={project.paymentType}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
                            readOnly
                        />
                    </div>

                    {/* Estimated Duration */}
                    <div>
                        <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                            Estimated Duration
                        </label>
                        <select
                            id="estimatedDuration"
                            name="estimatedDuration"
                            value={proposalData.estimatedDuration}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-stdBlue focus:ring-stdBlue sm:text-sm"
                            required
                        >
                            {durations.map(duration => (
                                <option key={duration.id} value={duration.id}>
                                    {duration.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-stdBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stdBlue"
                        >
                            Submit Proposal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProposal;
