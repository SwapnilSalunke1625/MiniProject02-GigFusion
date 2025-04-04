import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function BiddingSection() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ location: '', deadline: '', priceRange: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('/api/v1/jobs');
                setJobs(response.data.jobs);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div>Loading jobs...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">Available Jobs for Bidding</h1>
                {/* Filters */}
                <div className="flex justify-center mt-4 space-x-4">
                    <select
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300"
                    >
                        <option value="">Location</option>
                        <option value="NY">New York</option>
                        <option value="SF">San Francisco</option>
                        {/* Add other locations */}
                    </select>
                    <select
                        value={filters.deadline}
                        onChange={(e) => setFilters({ ...filters, deadline: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300"
                    >
                        <option value="">Deadline</option>
                        <option value="soon">Soon</option>
                        <option value="flexible">Flexible</option>
                        {/* Add other options */}
                    </select>
                    <select
                        value={filters.priceRange}
                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-gray-300"
                    >
                        <option value="">Price Range</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            {/* Job Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-bold text-gray-700 mb-2">{job.title}</h2>
                        <p className="text-gray-500">{job.shortDescription}</p>

                        {/* Job Details */}
                        <div className="mt-4 text-sm text-gray-600">
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Deadline:</strong> {job.deadline}</p>
                            <p><strong>Price Range:</strong> {job.priceRange}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                        </div>

                        {/* User Details */}
                        <div className="mt-4 flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                {job.userInitials}
                            </div>
                            <div className="ml-3">
                                <p className="font-semibold text-gray-700">{job.userName}</p>
                                <p className="text-xs text-gray-500">Verified User</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                onClick={() => navigate(`/bid/${job.id}`)}
                                className="bg-stdBlue text-white px-4 py-2 rounded-lg"
                            >
                                Bid Now
                            </button>
                            <button
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="text-stdBlue underline"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => navigate(`/chat/${job.userId}`)}
                                className="bg-stdYellow text-white px-4 py-2 rounded-lg"
                            >
                                Chat
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}