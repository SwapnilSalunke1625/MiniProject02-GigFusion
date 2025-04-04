import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { proposalService } from '../services';
import { FaArrowLeft, FaSpinner, FaFileAlt, FaDollarSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const ProposalsList = ({ userOnly = false }) => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [proposals, setProposals] = useState([]);
    const [activeProposals, setActiveProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [proposalStatusFilter, setProposalStatusFilter] = useState('active'); // 'active' or 'all'

    useEffect(() => {
        fetchProposals();
    }, [projectId, userOnly, proposalStatusFilter]);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            let response;

            if (projectId && !userOnly) {
                // Fetch proposals for a specific project (client view)
                response = await proposalService.getProjectProposals(projectId);
            } else {
                // Fetch proposals for the logged-in user (freelancer view)
                response = await proposalService.getUserProposals();
            }

            if (response.statusCode === 200) {
                setProposals(response.data.proposals);
                // Filter active proposals (excluding 'withdrawn' proposals)
                setActiveProposals(response.data.proposals.filter(proposal => proposal.status !== 'withdrawn'));
            } else {
                throw new Error(response.message || 'Failed to load proposals');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching proposals');
            toast.error('Failed to load proposals');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptProposal = async (proposalId) => {
        try {
            const response = await proposalService.handleProposalStatus(proposalId, 'accepted');
            if (response.statusCode === 200) {
                toast.success('Proposal accepted successfully!');
                fetchProposals(); // Refresh the proposal list
            } else {
                throw new Error(response.message || 'Failed to accept proposal');
            }
        } catch (err) {
            toast.error('Failed to accept proposal');
        }
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
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

    const proposalsToDisplay = proposalStatusFilter === 'active' ? activeProposals : proposals;

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
                            {projectId && !userOnly ? 'Project Proposals' : 'My Proposals'}
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        {projectId && !userOnly
                            ? 'Review proposals submitted for this project.'
                            : 'View all proposals you have submitted.'}
                    </p>
                </div>

                {/* Filter Tabs (Service Provider Only) */}
                {!projectId && user.userType === 'serviceProvider' && (
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            onClick={() => setProposalStatusFilter('active')}
                            className={`py-2 px-4 border-b-2 text-sm font-medium ${proposalStatusFilter === 'active'
                                ? 'border-stdBlue text-stdBlue'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Active Proposals
                        </button>
                        <button
                            onClick={() => setProposalStatusFilter('all')}
                            className={`py-2 px-4 border-b-2 text-sm font-medium ${proposalStatusFilter === 'all'
                                ? 'border-stdBlue text-stdBlue'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            All Proposals
                        </button>
                    </div>
                )}

                {/* Proposals List */}
                {proposalsToDisplay.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <FaFileAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Proposals Found</h3>
                        <p className="text-gray-600">
                            {projectId && !userOnly
                                ? 'No proposals have been submitted for this project yet.'
                                : 'You have not submitted any proposals yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {proposalsToDisplay.map((proposal) => (
                                <li key={proposal._id} className="px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {user.userType === 'serviceProvider' && proposal.project ? (
                                                <Link to={`/projects/${proposal.project._id}`} className="font-semibold text-stdBlue hover:underline">
                                                    {proposal.project.title}
                                                </Link>
                                            ) : (
                                                <span className="font-semibold">{proposal.coverLetter.substring(0, 50)}...</span>
                                            )}
                                            <p className="text-gray-600 text-sm">
                                                Submitted on {new Date(proposal.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-stdBlue font-medium">
                                                <FaDollarSign className="inline-block mr-1" />
                                                {formatCurrency(proposal.bidAmount, proposal.currency)}
                                            </p>
                                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : proposal.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {proposal.status}
                                            </span>
                                            {user.userType === 'user' && proposal.status === 'pending' && (
                                                <button
                                                    onClick={() => handleAcceptProposal(proposal._id)}
                                                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Accept
                                                </button>
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

export default ProposalsList;
