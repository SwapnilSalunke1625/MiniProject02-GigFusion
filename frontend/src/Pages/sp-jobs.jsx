import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FaUserCircle, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import Invoice from '../components/Invoice';

export default function SPJobs() {
    const [error, setError] = useState('');
    const [jobPosts, setJobPosts] = useState([]);
    const [filter, setFilter] = useState('accepted'); // Default filter set to 'New'
    const navigate = useNavigate();
    const [acceptedJobs, setAcceptedJobs] = useState({});

    useEffect(() => {
        const fetchJobPosts = async () => {
            try {
                const response = await axios.get('/api/v1/users/get-job-posts-for-sp', {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setJobPosts(response.data.data);
            } catch (error) {
                console.error('Error fetching job posts:', error);
                setError('Failed to fetch job posts');
            }
        };

        fetchJobPosts();
    }, [navigate]);

    const filteredJobPosts = jobPosts.filter((job) => job.status === filter);
    const [isAccepted, setIsAccepted] = useState(false);

    const handleAccept = async (jobId) => {
        console.log('Accepting job:', jobId);
        try {
            const response = await axios.patch(`/api/v1/users/${jobId}/accept`);
            setAcceptedJobs((prev) => ({ ...prev, [jobId]: true }));
            console.log("Job Accepted: ", response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error accepting job:', error);
        }
    };

    const handleReject = async (jobId) => {
        console.log('Rejecting job:', jobId);
        try {
            const response = await axios.patch(`/api/v1/users/${jobId}/reject`);
            setIsAccepted(false);
            console.log("Job Rejected: ", response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error rejecting job:', error);
        }
    };

    const handleComplete = async (jobId) => {
        console.log('Completing job:', jobId);
        try {
            const response = await axios.patch(`/api/v1/users/${jobId}/SPConsent`);
            setAcceptedJobs((prev) => ({ ...prev, [jobId]: false }));
            console.log("Job Completed: ", response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error completing job:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <BackButton />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Error message */}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    {/* Filter buttons */}
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={() => setFilter('accepted')}
                            className={`mx-2 px-4 py-2 rounded-full ${filter === 'accepted' ? 'bg-orange-500 border-b-4 border-gray-800' : 'bg-gradient-to-r from-orange-400 to-orange-500'
                                } text-white shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out backdrop-blur-sm bg-opacity-70`}
                        >
                            Active Jobs
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`mx-2 px-4 py-2 rounded-full ${filter === 'pending' ? 'bg-yellow-500 border-b-4 border-gray-800' : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                } text-white shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out backdrop-blur-sm bg-opacity-70`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`mx-2 px-4 py-2 rounded-full ${filter === 'completed' ? 'bg-green-500 border-b-4 border-gray-800' : 'bg-gradient-to-r from-green-400 to-green-500'
                                } text-white shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out backdrop-blur-sm bg-opacity-70`}
                        >
                            Completed
                        </button>
                    </div>
            

                    <div className="mt-4 space-y-6">
                        {filteredJobPosts.length > 0 ? (
                            filteredJobPosts.map((job) => (
                                <div key={job._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    {/* Header with Job Type */}
                                    <div className="bg-gradient-to-r flex justify-between from-stdBlue to-color1 p-4 text-white">
  <div className="flex items-center gap-3">
    <FaUserCircle className="text-2xl" />
    <h3 className="text-xl font-semibold">
      {`${job.jobType.charAt(0).toUpperCase()}${job.jobType.slice(1)} Job`}
    </h3>
  </div>
  
  {/* Invoice Component Aligned to the Right */}
  <div className="ml-auto">
    <Invoice />
  </div>
</div>


                                    {/* Job Details */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <FaClock className="text-color1 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Requested on</p>
                                                        <p className="font-medium">
                                                            {new Date(job.time).toLocaleDateString('en-US', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                                                        {job.status}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm text-gray-500 mb-2">Additional Details</h4>
                                                <p className="text-gray-700">{job.additionalDetails}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6 flex justify-end">
                                            {job.status !== 'completed' && (
                                                <>
                                                    <button
                                                        className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full shadow-md transition-transform transform hover:scale-105 ${job.status === 'accepted' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-400 to-green-500 text-white'}`}
                                                        onClick={() => handleAccept(job._id)}
                                                    >
                                                        <FaCheck className="text-lg" />
                                                        Accept
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105 ml-4"
                                                        onClick={() => handleReject(job._id)}
                                                    >
                                                        <FaTimes className="text-lg" />
                                                        {job.status === 'accepted' ? 'Cancel' : 'Reject'}
                                                    </button>
                                                </>
                                            )}
                                            {job.status === 'accepted' && (
                                                <button
                                                    className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105 ml-4"
                                                    onClick={() => handleComplete(job._id)}
                                                >
                                                    <FaCheck className="text-lg" />
                                                    Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No job posts available for {filter} status.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
