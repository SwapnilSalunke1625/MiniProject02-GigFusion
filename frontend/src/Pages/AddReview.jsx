import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaStar } from 'react-icons/fa';

export default function AddReview() {
    const { id } = useParams(); // service provider id
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        rating: 0,
        reviewDescription: '',
        jobType: '',
        serviceDate: ''
    });
    const [hoveredRating, setHoveredRating] = useState(0);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('accessToken');
            const response = await axios.post(`/api/v1/service-providers/add-review/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                navigate(`/${id}/profile`);
            }
        } catch (error) {
            setError('Failed to submit review. Please try again.');
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-stdBlue to-color1 p-6">
                        <h1 className="text-3xl font-bold text-white text-center">
                            Write a Review
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Rating Stars */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="text-2xl focus:outline-none transition-colors"
                                    >
                                        <FaStar 
                                            className={`${
                                                (hoveredRating || formData.rating) >= star 
                                                    ? 'text-yellow-400' 
                                                    : 'text-gray-300'
                                            } transform hover:scale-110 transition-transform`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Job Type */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Service Type
                            </label>
                            <select
                                value={formData.jobType}
                                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                focus:ring-color1/20 focus:border-color1 outline-none"
                                required
                            >
                                <option value="">Select service type</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="electrical">Electrical</option>
                                <option value="carpentry">Carpentry</option>
                                <option value="painting">Painting</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="assembly">Furniture Assembly</option>
                            </select>
                        </div>

                        {/* Service Date */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Service Date
                            </label>
                            <input
                                type="date"
                                value={formData.serviceDate}
                                onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                focus:ring-color1/20 focus:border-color1 outline-none"
                                required
                            />
                        </div>

                        {/* Review Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Your Review
                            </label>
                            <textarea
                                value={formData.reviewDescription}
                                onChange={(e) => setFormData({ ...formData, reviewDescription: e.target.value })}
                                placeholder="Share details of your experience..."
                                rows="4"
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 
                                focus:ring-color1/20 focus:border-color1 outline-none resize-none"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl 
                                font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-color1 text-white rounded-xl font-semibold
                                shadow-lg hover:shadow-xl transition-all duration-300 
                                hover:bg-stdBlue transform hover:scale-[1.02]"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 