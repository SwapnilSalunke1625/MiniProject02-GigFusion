import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaArrowLeft } from 'react-icons/fa';
import BackButton from '../components/BackButton';
export default function BookJob() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        id,
        jobType: "",
        additionalDetails: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const jobTypes = [
        { id: 'plumber', label: 'Plumber', icon: '🔧' },
        { id: 'electrician', label: 'Electrician', icon: '⚡' },
        { id: 'handyman', label: 'Handyman', icon: '🛠' },
        { id: 'mover', label: 'Mover', icon: '📦' },
        { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
        { id: 'painting', label: 'Painting', icon: '🎨' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const token = Cookies.get("accessToken");
            // console.log('Form Data:', formData);
            const response = await axios.post("/api/v1/users/job-post", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                toast.success("Job request submitted successfully");
                toast.info("Redirecting to My Bookings");
                setTimeout(() => {
                    navigate("/my-bookings");
                }, 2000);
            } else {
                setError("Failed to submit job request");
            }
        } catch (error) {
            console.error("Error submitting job request:", error);
            setError("Failed to submit job request");
        }
    };

    return (
        <>
        {/* <BackButton /> */}
        <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-stdBlue to-color1 p-6 relative">
                        <Link 
                            to={`/${id}/profile`}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white 
                            hover:text-gray-200 transition-colors duration-200 flex items-center gap-2"
                        >
                            <FaArrowLeft />
                            <span>Back</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-center text-white">
                            Book Service
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Job Type Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-4">
                                Select Service Type
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {jobTypes.map(({ id, label, icon }) => (
                                    <label
                                        key={id}
                                        className={`relative flex flex-col items-center p-4 rounded-xl cursor-pointer
                                        border-2 transition-all duration-200 group
                                        ${formData.jobType === id 
                                            ? 'border-color1 bg-color1/5' 
                                            : 'border-gray-200 hover:border-color1/50'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="jobType"
                                            value={id}
                                            onChange={handleInputChange}
                                            className="absolute opacity-0"
                                        />
                                        <span className="text-2xl mb-2">{icon}</span>
                                        <span className={`font-medium transition-colors duration-200
                                            ${formData.jobType === id ? 'text-color1' : 'text-gray-600'}`}>
                                            {label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Additional Details
                            </label>
                            <textarea
                                name="additionalDetails"
                                value={formData.additionalDetails}
                                onChange={handleInputChange}
                                placeholder="Describe your requirements..."
                                rows="4"
                                className="w-full p-4 border-2 border-gray-200 rounded-xl 
                                focus:border-color1 focus:ring-2 focus:ring-color1/20 
                                transition-all duration-200 outline-none resize-none"
                            ></textarea>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-color1 text-white rounded-xl font-semibold
                            shadow-lg hover:shadow-xl transition-all duration-300 
                            hover:bg-stdBlue transform hover:scale-[1.02]"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}