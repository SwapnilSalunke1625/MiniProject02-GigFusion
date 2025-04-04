import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaTools, FaUserCircle, FaCalendarCheck, FaClock } from 'react-icons/fa';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Feedback from '../components/Feedback';
export default function LandingPageSP() {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeJobs, setActiveJobs] = useState([]);
    const [stats, setStats] = useState({
        totalJobs: 0,
        completedJobs: 0,
        pendingJobs: 0,
        acceptedJobs: 0,
        rating: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {

            const user = await axios.get('http://localhost:8000/api/v1/users/current-user', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                }
            })
            if (user.data.statusCode === 200) {
                setUserName(user.data.data.fullName);

                const stats = await axios.get('http://localhost:8000/api/v1/users/stats', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('accessToken')}`
                    }
                });
                // console.log('Stats:', stats.data.data);
                if (stats.data.statusCode === 200) {
                    setStats(stats.data.data);

                    const jobsResponse = await axios.get('http://localhost:8000/api/v1/users/active-jobs', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                        }
                    });
                    if (jobsResponse.data.statusCode === 200) {
                        setActiveJobs(jobsResponse.data.data);
                    }
                }
            }

        }

        fetchDetails()
            .then(() => setLoading(false));
    }, [navigate]);

    const sendLocationToServer = async (location) => {
        try {
            // console.log(`Bearer: ${Cookies.get('accessToken')}`);
            const response = await axios.post("http://localhost:8000/api/v1/users/location", location, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get('accessToken')}`
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error sending location to the server:", error);
        }
    };

    useEffect(() => {

        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("Latitude:", latitude, "Longitude:", longitude);
                        sendLocationToServer({ lat: latitude, lng: longitude });
                    },
                    (err) => {
                        console.log(err.message || "Unable to retrieve location");
                    }
                );
            }
        };

        const checkIfSavedLocation = async () => {
            const check = await axios.get("http://localhost:8000/api/v1/users/location", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                }
            });
            if (check.data.data === false) {
                getUserLocation();
            }
        }
        checkIfSavedLocation();
        // getUserLocation();
    }, [navigate]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen  py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
                        <div className="bg-gradient-to-r from-stdBlue to-color1 p-6 sm:p-8 md:p-10">
                            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-2">
                                Welcome back, {userName}!
                            </h1>
                            <p className="text-white/80 text-lg">
                                Manage your service requests and track your progress
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 md:p-8">
                            {[
                                { icon: <FaTools className="text-3xl text-color1" />, label: "Total Jobs", value: stats.totalJobs, color: "text-stdBlue" },
                                { icon: <FaClock className="text-3xl text-yellow-500" />, label: "Pending Jobs", value: stats.pendingJobs, color: "text-yellow-600" },
                                { icon: "✅", label: "Accepted", value: stats.acceptedJobs, color: "text-gray-600" },
                                { icon: <FaCalendarCheck className="text-3xl text-stdBlue" />, label: "Completed", value: stats.completedJobs, color: "text-stdBlue" }
                            ].map((stat, index) => (
                                <div key={index} 
                                    className="bg-gray-50 rounded-xl p-4 text-center transform transition-all hover:scale-105 hover:shadow-md">
                                    <div className="flex justify-center mb-2">
                                        {typeof stat.icon === 'string' ? 
                                            <div className="text-3xl">{stat.icon}</div> : 
                                            stat.icon
                                        }
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons for Service Providers */}
                    <div className="flex flex-wrap gap-4 justify-center mt-6">
                        <button
                            onClick={() => navigate('/projects')}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-stdBlue text-stdBlue hover:bg-stdBlue hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <span className="font-medium">Find Projects</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                        
                        <button
                            onClick={() => navigate('/my-proposals')}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-color1 text-color1 hover:bg-color1 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <span className="font-medium">My Proposals</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                        </button>
                        
                        <button
                            onClick={() => navigate('/my-matches')}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <span className="font-medium">Matched Projects</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Active Jobs Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Active Jobs</h2>
                        <div className="space-y-4">
                            {activeJobs.length > 0 ? (
                                activeJobs.map((job) => (
                                    <div key={job._id}
                                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md 
                                        transition-all duration-300 hover:border-stdBlue">
                                        <div className="flex items-start gap-4">
                                            <div className="hidden sm:block">
                                                <FaUserCircle className="text-4xl text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                                                </h3>
                                                <p className="text-gray-600 mt-1">{job.additionalDetails}</p>
                                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(job.time).toLocaleDateString()}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                        ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <FaTools className="mx-auto text-4xl text-gray-400 mb-3" />
                                    <p className="text-gray-500 text-lg">No active jobs at the moment</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Feedback />
        </div>
    );
}