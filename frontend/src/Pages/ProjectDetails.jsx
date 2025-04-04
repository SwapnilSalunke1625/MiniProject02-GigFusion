import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaClock, FaDollarSign, FaStar, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { projectService, proposalService } from '../services';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [hasProposal, setHasProposal] = useState(true);

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await projectService.getProjectById(projectId);

            if (response.statusCode === 200) {
                setProject(response.data);

                // Check if current user has already submitted a proposal
                if (user.userType === 'serviceProvider') {
                    const proposals = await proposalService.getUserProposals();
                    setHasProposal(proposals.data.proposals.some(p => p.project._id === projectId));
                }
            } else {
                throw new Error(response.message || 'Failed to load project details');
            }
        } catch (err) {
            toast.error('Failed to load project details');
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await projectService.changeProjectStatus(projectId, newStatus);
            toast.success(`Project status updated to ${newStatus}`);
            fetchProjectDetails();
        } catch (err) {
            toast.error('Failed to update project status');
        }
    };

    const handleSubmitProposal = () => {
        navigate(`/projects/${projectId}/submit-proposal`);
    };

    const handleViewProposals = () => {
        navigate(`/projects/${projectId}/proposals`);
    };

    const handleCreateEscrow = () => {
        navigate(`/projects/${projectId}/escrow`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <FaSpinner className="animate-spin text-4xl text-stdBlue" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md text-center">
                    {error || 'Project not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Project Header */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-stdBlue to-blue-500 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
                                <p className="text-white/80">
                                    Posted {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {project.client._id === user._id ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={project.status}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            className="px-3 py-1 rounded-lg bg-white text-gray-800 text-sm"
                                        >
                                            <option value="open">Open</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={handleViewProposals}
                                            className="px-4 py-1 bg-white text-stdBlue rounded-lg text-sm hover:bg-gray-100"
                                        >
                                            View Proposals
                                        </button>
                                    </div>
                                ) : user.userType === 'serviceProvider' && project.status === 'open' && (
                                    !hasProposal ? (
                                        <button
                                            onClick={handleSubmitProposal}
                                            className="px-4 py-1 bg-white text-stdBlue rounded-lg text-sm hover:bg-gray-100"
                                        >
                                            Submit Proposal
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="px-4 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm cursor-not-allowed"
                                        >
                                            Proposal Submitted
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-stdBlue rounded-lg">
                                    <FaDollarSign className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Budget</p>
                                    <p className="font-semibold">
                                        {project.budget.currency} {project.budget.minAmount} - {project.budget.maxAmount}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                    <FaClock className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="font-semibold">{project.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                                    <FaStar className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Experience Level</p>
                                    <p className="font-semibold">{project.experienceLevel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Project Description</h2>
                            <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Milestones */}
                        {project.milestones?.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-3">Project Milestones</h2>
                                <div className="space-y-4">
                                    {project.milestones.map((milestone, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium">{milestone.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {milestone.description}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-stdBlue">
                                                        {project.budget.currency} {milestone.amount}
                                                    </p>
                                                    {milestone.dueDate && (
                                                        <p className="text-sm text-gray-600">
                                                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Client Information */}
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-semibold mb-3">About the Client</h2>
                            <div className="flex items-center gap-4">
                                {project.client.avatar ? (
                                    <img
                                        src={project.client.avatar}
                                        alt={project.client.fullName}
                                        className="w-12 h-12 rounded-full"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <FaUser className="text-gray-400 text-xl" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium">{project.client.fullName}</h3>
                                    <p className="text-sm text-gray-600">Member since {new Date(project.client.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {project.status === 'in-progress' && project.freelancer && project.client._id === user._id && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleCreateEscrow}
                            className="px-6 py-3 bg-color1 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Set Up Payment Escrow
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
