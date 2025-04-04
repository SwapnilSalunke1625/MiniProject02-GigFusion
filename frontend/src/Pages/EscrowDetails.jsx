import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { escrowService } from '../services';
import { FaArrowLeft, FaSpinner, FaFileAlt, FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const EscrowDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [escrow, setEscrow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const userRole = user.userType;

    useEffect(() => {
        fetchEscrowDetails();
    }, [projectId]);

    const fetchEscrowDetails = async () => {
        try {
            setLoading(true);
            const response = await escrowService.getEscrowByProject(projectId);
            console.log('Escrow details:', response);

            if (response.statusCode === 200) {
                setEscrow(response.data);
            } else {
                throw new Error(response.message || 'Failed to load escrow details');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching escrow details');
            toast.error('Failed to load escrow details');
        } finally {
            setLoading(false);
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

    if (error || !escrow) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error || 'Escrow not found'}
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
                            Escrow Details
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        View details of the escrow for this project.
                    </p>
                </div>

                {/* Escrow Details */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Project: {escrow.project.title}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-gray-600">Client:</p>
                                <p className="font-medium">{escrow.client.fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Freelancer:</p>
                                <p className="font-medium">{escrow.freelancer.fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Total Amount:</p>
                                <p className="font-medium">
                                    {formatCurrency(escrow.totalAmount, escrow.currency)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Payment Type:</p>
                                <p className="font-medium">{escrow.paymentType}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Status:</p>
                                <p className="font-medium">{escrow.status}</p>
                            </div>
                        </div>

                        {/* Milestones */}
                        {escrow.milestones.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Milestones</h3>
                                <ul className="space-y-2">
                                    {escrow.milestones.map((milestone) => (
                                        <li key={milestone._id} className="border border-gray-200 rounded-md p-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{milestone.title}</p>
                                                    <p className="text-gray-600 text-sm">{milestone.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-stdBlue font-medium">
                                                        {formatCurrency(milestone.amount, escrow.currency)}
                                                    </p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${milestone.status === 'funded' ? 'bg-green-100 text-green-800' : milestone.status === 'released' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {milestone.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Transactions */}
                        {escrow.transactions.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Transactions</h3>
                                <ul className="space-y-2">
                                    {escrow.transactions.map((transaction) => (
                                        <li key={transaction._id} className="border border-gray-200 rounded-md p-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{transaction.type}</p>
                                                    <p className="text-gray-600 text-sm">
                                                        {new Date(transaction.date).toLocaleDateString()}
                                                    </p>
                                                    {transaction.reference && (
                                                        <p className="text-gray-600 text-sm">
                                                            Reference: {transaction.reference}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-stdBlue font-medium">
                                                        {formatCurrency(transaction.amount, escrow.currency)}
                                                    </p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : transaction.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {transaction.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EscrowDetails;