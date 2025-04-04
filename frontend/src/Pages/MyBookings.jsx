import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaTools, FaClock, FaCheckCircle, FaTimesCircle, FaCheck, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import LoadingBar from '../components/LoadingBar';
export default function MyBookings() {
    const [error, setError] = useState('');
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobPosts = async () => {
            try {
                const response = await axios.get('/api/v1/users/get-job-posts', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setJobPosts(response.data.data);
            } catch (error) {
                console.error('Error fetching job posts:', error);
                setError('Failed to fetch job posts');
            } finally {
                setLoading(false);
            }
        };

        fetchJobPosts();
    }, [navigate]);

    const handleCancelBooking = async (jobId) => {
        try {
            await axios.delete(`/api/v1/users/cancel-job/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                }
            });
            setJobPosts(prevJobs => prevJobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error canceling booking:', error);
            setError('Failed to cancel booking');
        }
    };

    const handleComplete = async (jobId) => {
        console.log('Completing job:', jobId);
        try {
            const response = await axios.patch(`/api/v1/users/${jobId}/userConsent`);
            console.log("Job Completed: ", response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error completing job:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'text-yellow-700 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200';
            case 'completed':
                return 'text-green-700 bg-gradient-to-r from-green-50 to-green-100 border border-green-200';
            case 'cancelled':
                return 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border border-red-200';
            case 'accepted':
                return 'text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200';
            default:
                return 'text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200';
        }
    };

    const getStatusBackground = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500';
            case 'completed':
                return 'bg-gradient-to-r from-green-500 to-emerald-500';
            case 'cancelled':
                return 'bg-gradient-to-r from-red-500 to-rose-500';
            case 'accepted':
                return 'bg-gradient-to-r from-blue-500 to-indigo-500';
            default:
                return 'bg-gradient-to-r from-gray-500 to-slate-500';
        }
    };

    if (loading) {
        return (
            <>
                <LoadingBar />
                <div className="min-h-screen bg-gradient-to-b from-stdBg to-white flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <FaSpinner className="text-4xl text-orange-500 animate-spin" />
                        <p className="text-lg font-medium text-gray-600">Loading your bookings...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
        <BackButton />
        <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 sm:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 
                        bg-gradient-to-r from-stdBlue to-color1 bg-clip-text text-transparent">
                        My Bookings
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Track and manage all your service requests in one place
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl 
                        shadow-sm animate-fadeIn">
                        <p className="text-red-600 text-center font-medium flex items-center justify-center gap-2">
                            <FaTimesCircle />
                            {error}
                        </p>
                    </div>
                )}

                {/* Bookings Grid/List */}
                <div className="grid gap-8">
                    {jobPosts.length > 0 ? (
                        jobPosts.map((job) => (
                            <div key={job._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl 
                                transition-all duration-300 overflow-hidden transform hover:scale-[1.02]">
                                {/* Service Type Header */}
                                <div className={`${getStatusBackground(job.status)} p-6`}>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                                <FaTools className="text-2xl text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">
                                                    {`${job.jobType.charAt(0).toUpperCase()}${job.jobType.slice(1)} Service`}
                                                </h3>
                                                <p className="text-white/90 text-sm">
                                                    Booking ID: {job._id.slice(-8)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl text-sm font-medium 
                                            ${getStatusColor(job.status)} shadow-sm backdrop-blur-sm`}>
                                            {job.status === 'completed' ? (
                                                <div className="flex items-center gap-2">
                                                    <FaCheckCircle className="text-green-600" />
                                                    <span>Completed</span>
                                                </div>
                                            ) : job.status === 'cancelled' ? (
                                                <div className="flex items-center gap-2">
                                                    <FaTimesCircle className="text-red-600" />
                                                    <span>Cancelled</span>
                                                </div>
                                            ) : job.status === 'pending' ? (
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-yellow-600 animate-pulse" />
                                                    <span>Pending</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <FaCheck className="text-blue-600" />
                                                    <span>Accepted</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <FaClock className="text-color1" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Scheduled for</p>
                                                    <p className="text-gray-900">
                                                        {new Date(job.time).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <FaMapMarkerAlt className="text-color1" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Service Location</p>
                                                    <p className="text-gray-900">{job.location || 'Location not specified'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-500">Service Details</h4>
                                            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">
                                                {job.additionalDetails || 'No additional details provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
                                        {job.status !== 'rejected' && job.status !== 'completed' && (
                                            <button
                                                onClick={() => handleCancelBooking(job._id)}
                                                className="px-6 py-3 bg-white text-red-500 border-2 border-red-500 
                                                    rounded-xl font-medium hover:bg-red-50 transition-all duration-300 
                                                    transform hover:scale-105 focus:outline-none focus:ring-2 
                                                    focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
                                            >
                                                <FaTimesCircle />
                                                Cancel Booking
                                            </button>
                                        )}
                                        {job.status === 'accepted' && (
                                            <button
                                                onClick={() => handleComplete(job._id)}
                                                className="px-6 py-3 bg-gradient-to-r from-stdBlue to-color1 
                                                    text-white font-medium rounded-xl shadow-lg hover:shadow-xl 
                                                    transition-all duration-300 transform hover:scale-105 
                                                    focus:outline-none focus:ring-2 focus:ring-color1 
                                                    focus:ring-offset-2 flex items-center gap-2"
                                            >
                                                <FaCheck />
                                                Complete Service
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                            <div className="mb-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaTools className="text-4xl text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    You haven&apos;t made any service bookings yet. Start by booking a service from our providers.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/services')}
                                className="px-6 py-3 bg-gradient-to-r from-stdBlue to-color1 text-white 
                                    font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                    transform hover:scale-105"
                            >
                                Browse Services
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
