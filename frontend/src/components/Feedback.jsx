import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('/api/v1/users/feedback');
            setFeedbacks(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch feedbacks');
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/users/feedback', {
                content: newFeedback,
                stars: rating
            });
            toast.success('Feedback submitted successfully');
            setNewFeedback('');
            setRating(0);
            fetchFeedbacks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-4xl font-bold mb-6 text-stdBlue text-center">Feedback</h2>
            
            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <label className="block mb-2 text-[#1E4D91]">Rating</label>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <FaStar
                                    key={index}
                                    className="cursor-pointer"
                                    color={ratingValue <= (hover || rating) ? "#FF731D" : "#e4e5e9"}
                                    size={24}
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="mb-4">
                    <textarea
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1E4D91]"
                        rows="4"
                        placeholder="Write your feedback here..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-[#1E4D91] text-white px-4 py-2 rounded hover:bg-[#FF731D] transition-colors duration-300"
                >
                    Submit Feedback
                </button>
            </form>

            {/* Feedback List */}
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div key={feedback._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={feedback.userId.avatar}
                                alt="User"
                                className="w-10 h-10 rounded-full border-2 border-[#1E4D91]"
                            />
                            <div>
                                <p className="font-semibold text-[#1E4D91]">{feedback.userId.username}</p>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            color={index < feedback.stars ? "#FF731D" : "#e4e5e9"}
                                            size={16}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">{feedback.content}</p>
                        <p className="text-sm text-[#1E4D91] mt-2">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feedback; 