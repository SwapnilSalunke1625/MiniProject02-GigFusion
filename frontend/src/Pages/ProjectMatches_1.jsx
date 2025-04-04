import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobMatchingService } from '../services';
import { FaArrowLeft, FaSpinner, FaFileAlt, FaHeart, FaCheck, FaLink, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const ProjectMatches = ({ userOnly = false }) => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole] = useState(Cookies.get('userRole'));

    useEffect(() => {
        fetchMatches();
    }, [projectId, userOnly]);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            let response;

            if (projectId && !userOnly) {
                // Fetch matches for a specific project (client view)
                response = await jobMatchingService.getProjectMatches(projectId);
            } else {
                // Fetch matches for the logged-in user (freelancer view)
                response = await jobMatchingService.getFreelancerMatches();
            }

            if (response.statusCode === 200) {
                setMatches(response.data.matches);
            } else {
                throw new Error(response.message || 'Failed to load matches');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching matches');
            toast.error('Failed to load matches');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMatchStatus = async (matchId, action) => {
        try {
            const response = await jobMatchingService.updateMatchStatus(matchId, action);
            if (response.statusCode === 200) {
                toast.success(`Match ${action} status updated`);
                // Refresh matches after updating status
                fetchMatches();
            } else {
                throw new Error(response.message || `Failed to update match ${action} status`);
            }
        } catch (err) {
            toast.error(err.message || `Failed to update match ${action} status`);
        }
    };

    const handleViewMatch = async (matchId) => {
        try {
            setLoading(true);
            const response = await jobMatchingService.viewProjectMatch(matchId);
            if (response.statusCode === 200) {
                toast.success('Match viewed successfully');
                // Optionally, navigate to the project details page or freelancer profile
                // navigate(`/projects/${response.data.match.project._id}`);
                fetchMatches(); // Refresh matches to update the view status
            } else {
                throw new Error(response.message || 'Failed to view match');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to view match');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <FaSpinner className="animate-spin text-4xl text-stdBlue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {projectId && !userOnly ? 'Project Matches' : 'My Matches'}
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        {projectId && !userOnly
                            ? 'Review freelancers matched with this project.'
                            : 'View projects matched to your profile.'}
                    </p>
                </div>

                {/* Matches List */}
                {matches.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <FaFileAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
                        <p className="text-gray-600">
                            {projectId && !userOnly
                                ? 'No freelancers have been matched with this project yet.'
                                : 'No projects have been matched with your profile yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {matches.map((match) => (
                                <li key={match._id} className="px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {userRole === 'serviceProvider' && match.project ? (
                                                <Link to={`/projects/${match.project._id}`} className="font-semibold text-stdBlue hover:underline">
                                                    {match.project.title}
                                                </Link>
                                            ) : (
                                                <span className="font-semibold">{match.freelancer.fullName}</span>
                                            )}
                                            <p className="text-gray-600 text-sm">
                                                Match Score: {match.matchScore}%
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {userRole === 'user' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateMatchStatus(match._id, 'save')}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${match.isSaved ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                                    >
                                                        <FaHeart className="inline-block mr-1" />
                                                        {match.isSaved ? 'Unsave' : 'Save'}
                                                    </button>
                                                    <Link to={`/projects/${match.project._id}`} className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200">
                                                        <FaCheck className="inline-block mr-1" />
                                                        Apply
                                                    </Link>
                                                </div>
                                            )}
                                            {userRole === 'serviceProvider' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateMatchStatus(match._id, 'view')}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${match.isViewed ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                                    >
                                                        <FaEye className="inline-block mr-1" />
                                                        {match.isViewed ? 'Viewed' : 'View'}
                                                    </button>
                                                    <Link to={`/projects/${match.project._id}`} className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                        <FaLink className="inline-block mr-1" />
                                                        View Project
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectMatches;
