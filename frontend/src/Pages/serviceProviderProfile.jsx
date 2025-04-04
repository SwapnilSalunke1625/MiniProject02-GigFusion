import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function ServiceProviderProfile() {
    const { id } = useParams();
    const [serviceProvider, setServiceProvider] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [providerResponse, reviewsResponse, skillsResponse] = await Promise.all([
                    axios.get(`/api/v1/service-providers/${id}`),
                    axios.get(`/api/v1/service-providers/get-reviews/${id}`),
                    axios.get(`/api/v1/service-providers/skills/${id}`)
                ]);

                if (providerResponse.status === 200) {
                    setServiceProvider(providerResponse.data.data);
                } else {

                    throw new Error('Failed to fetch service provider details');
                }

                if (reviewsResponse.status === 200) {
                    setReviews(reviewsResponse.data.data);
                } else {
                    throw new Error('Failed to fetch reviews');
                }
                
                if (skillsResponse.status === 200) {
                    setSkills(skillsResponse.data.data.skills || []);
                }

                const distanceFromUser = async () => {
                    try {
                        const locationResponse = await axios.get(`http://localhost:8000/api/v1/users/location/${id}`, {
                            headers: {
                                Authorization: `Bearer ${Cookies.get('accessToken')}`,
                            },
                        });
                        if (locationResponse.status === 200) {
                            let distanceInMeters = locationResponse.data.data;
                            let distanceInKm = (distanceInMeters / 1000) + 1;
                            setDistance(distanceInKm.toFixed(2));
                        } else {
                            throw new Error('Failed to fetch user location');
                        }
                    } catch (error) {
                        console.error('Error fetching user location:', error);
                    }
                };
                distanceFromUser();

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loader border-t-4 border-b-4 border-gray-900 rounded-full w-12 h-12"></div>
            </div>
        );
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : '';
    };

    const getRandomGradient = () => {
        const gradients = [
            'bg-gradient-to-r from-gray-700 to-gray-900',
            'bg-gradient-to-r from-gray-800 to-gray-600',
            'bg-gradient-to-r from-gray-900 to-gray-700',
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    const addReview = async (e) => {
        e.preventDefault();
        const rating = e.target.rating.value;
        const reviewDescription = e.target.reviewDescription.value;
        try {
            const response = await axios.post(`/api/v1/service-providers/set-sp-review`, {
                serviceProviderId: id,
                rating,
                reviewDescription,
            });
            if (response.status === 201) {
                alert('Review added successfully');
                window.location.reload();
            } else {
                throw new Error('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-stdBg to-white">
            {/* Cover Image Section */}
            <div className="relative h-[272px] w-full">
                {serviceProvider?.coverImage ? (
                    <img
                        src={serviceProvider.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-stdBlue to-color1"></div>
                )}

                {/* Profile Avatar */}
                <div className="absolute -bottom-20 left-12">
                    <div className="relative">
                        {serviceProvider?.avatar ? (
                            <img
                                src={serviceProvider.avatar}
                                alt={serviceProvider.fullName}
                                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        ) : (
                            <div className={`w-40 h-40 rounded-full border-4 border-white shadow-lg
                            flex items-center justify-center text-4xl font-bold text-white
                            ${getRandomGradient()}`}>
                                {getInitials(serviceProvider?.fullName || '')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {serviceProvider?.fullName}
                        </h1>
                        <p className="text-xl text-color1 font-medium mt-1">
                            {serviceProvider?.businessName}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center gap-3 text-gray-600">
                            <FaEnvelope className="text-color1 text-xl" />
                            <span>{serviceProvider?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <FaPhone className="text-color1 text-xl" />
                            <span>{serviceProvider?.contact}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <FaMapMarkerAlt className="text-color1 text-xl" />
                            <span>{serviceProvider?.city}, {serviceProvider?.state}</span>
                        </div>
                    </div>

                    {/* Distance with respect to Logged In User's Location */}
                    <div className="mb-4">
                        <p className="text-gray-600">
                            <span className="text-color1 font-semibold">Distance:</span> Approx {distance}km
                        </p>
                    </div>

                    {/* Skills Section */}
                    {skills.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Skills & Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="bg-stdBg text-stdBlue px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/book/' + serviceProvider?.userId)}
                            className="flex-1 max-w-xs px-6 py-3 bg-color1 text-white rounded-xl
                        font-semibold transition-all duration-300 hover:bg-stdBlue
                        shadow-md hover:shadow-lg"
                        >
                            Book Now
                        </button>
                        <button
                            onClick={() => navigate('/message')}
                            className="flex-1 max-w-xs px-6 py-3 bg-stdBlue text-white rounded-xl
                        font-semibold transition-all duration-300 hover:bg-color1
                        shadow-md hover:shadow-lg"
                        >
                            Message
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

                    {/* Add Review Form */}
                    <form onSubmit={addReview} className="mb-8 border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                        <textarea
                            name="reviewDescription"
                            rows="4"
                            placeholder="Share your experience..."
                            className="w-full p-4 border border-gray-200 rounded-xl mb-4 
                        focus:ring-2 focus:ring-color1/20 focus:border-color1 outline-none"
                        ></textarea>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                name="rating"
                                min="1"
                                max="5"
                                placeholder="Rating"
                                className="w-24 p-3 border border-gray-200 rounded-xl text-center
                            focus:ring-2 focus:ring-color1/20 focus:border-color1 outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-color1 text-white rounded-xl font-semibold
                            transition-all duration-300 hover:bg-stdBlue shadow-md hover:shadow-lg"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? reviews.map((review) => (
                            <div key={review._id}
                                className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    {review.userId?.avatar ? (
                                        <img
                                            src={review.userId.avatar}
                                            alt={review.userId.fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-stdBlue 
                                        flex items-center justify-center text-white font-bold">
                                            {getInitials(review.userId?.fullName || 'A')}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {review.userId?.fullName}
                                            </h4>
                                            <div className="flex items-center text-yellow-400">
                                                {"★".repeat(review.rating)}
                                                {"☆".repeat(5 - review.rating)}
                                                <span className="ml-2 text-sm text-gray-600">
                                                    ({review.rating}/5)
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{review.reviewDescription}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-8">No reviews yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}
