import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgImage from '../components/Assets/backgroundImage.png';


export default function WorkerSignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        businessName: '',
        password: '',
        confirmPassword: '',
        userType: 'serviceProvider',
        contact: '',
        zipcode: '',
        state: '',
        city: '',
        serviceCategory: 'Home Repairs'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleServiceSelect = (category) => {
        setFormData({ ...formData, serviceCategory: category });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                toast.success('Registration successful. Please login to continue');
                navigate('/login');
            } else {
                toast.error('Registration failed');
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('Registration failed');
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    // Service categories matching your landing page
    const serviceCategories = [
        { id: "web_dev", name: "Web Development", icon: "🌐" },
        { id: "mobile_dev", name: "Mobile Development", icon: "📱" },
        { id: "data_science", name: "Data Science", icon: "📊" },
        { id: "cloud_computing", name: "Cloud Computing", icon: "☁️" },
        { id: "cyber_security", name: "Cyber Security", icon: "🛡️" },
        { id: "devops", name: "DevOps", icon: "⚙️" },
    ];

    return (
        <div className="min-h-screen font-stdFont bg-gray-50">
           
            
            <div className="flex items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8 relative">
                {/* Background with overlay instead of blur */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                
                {/* Main container - wider for desktop */}
                <div className="relative z-10 w-full max-w-4xl">
                    <div className="bg-white shadow-xl rounded-2xl px-6 py-6">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-stdBlue">
                                Join <span className="text-color1">Gig Fusion</span>
                            </h1>
                            <p className="text-stdBlue mt-1">Register as a Gig Expert</p>
                        </div>
                        
                        {/* Registration Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Desktop two-column layout */}
                            <div className="flex flex-col md:flex-row md:space-x-8">
                                {/* Left column */}
                                <div className="md:w-1/2 space-y-4">
                                    {/* Personal Information */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Personal Information</h2>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    id="fullName"
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Your full name"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your@email.com"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        id="contact"
                                                        type="tel"
                                                        name="contact"
                                                        value={formData.contact}
                                                        onChange={handleInputChange}
                                                        placeholder="Your phone"
                                                        className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
                                                    <input
                                                        id="zipcode"
                                                        type="text"
                                                        name="zipcode"
                                                        value={formData.zipcode}
                                                        onChange={handleInputChange}
                                                        placeholder="Zipcode"
                                                        className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Business Information */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Business Information</h2>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                                <input
                                                    id="businessName"
                                                    type="text"
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    placeholder="Your business name"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                    <select
                                                        id="state"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className="h-10 w-full rounded-lg px-3 text-sm border-2 border-gray-200 outline-none focus:border-stdBlue"
                                                        required
                                                    >
                                                        <option value="" disabled>Select State</option>
                                                        <option value="Maharashtra">Maharashtra</option>
                                                        <option value="Karnataka">Karnataka</option>
                                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                        <option value="West Bengal">West Bengal</option>
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                    <select
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="h-10 w-full rounded-lg px-3 text-sm border-2 border-gray-200 outline-none focus:border-stdBlue"
                                                        required
                                                    >
                                                        <option value="" disabled>Select City</option>
                                                        <option value="Sambhajinagar">Sambhajinagar</option>
                                                        <option value="Solapur">Solapur</option>
                                                        <option value="Beed">Beed</option>
                                                        <option value="Jalna">Jalna</option>
                                                        <option value="Dharashiv">Dharashiv</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Account Security */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Create Password</h2>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Create a secure password"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                                <input
                                                    id="confirmPassword"
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm your password"
                                                    className="h-10 w-full rounded-lg px-3 outline-none border-2 border-gray-200 focus:border-stdBlue text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right column */}
                                <div className="md:w-1/2 mt-4 md:mt-0">
                                    {/* Service Categories Section */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-stdBlue border-b border-gray-200 pb-1 mb-3">Service Category</h2>
                                        
                                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-gray-700 mb-3">Select the primary service you offer:</p>
                                            
                                            
                                            <div className="grid grid-cols-3 gap-3">
                                                {serviceCategories.map(category => (
                                                    <div 
                                                        key={category.id}
                                                        onClick={() => handleServiceSelect(category.name)}
                                                        className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${
                                                            formData.serviceCategory === category.name 
                                                            ? 'bg-white border-2 border-stdBlue shadow-md' 
                                                            : 'bg-white/70 border-2 border-gray-200 hover:bg-white'
                                                        }`}
                                                    >
                                                        <span className="text-2xl mb-1">{category.icon}</span>
                                                        <span className="text-xs text-center font-medium">{category.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Company Benefits */}
                                        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 mb-4">
                                            <h3 className="font-medium text-stdBlue mb-2">Why Join Gig Fusion?</h3>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span>Connect with customers with  all over world</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span>Manage your schedule and control your availability</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span>Build your business reputation with customer reviews</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-color1 mr-2">✓</span>
                                                    <span>No subscription fees - pay only for leads you accept</span>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                        {/* Error message */}
                                        {error && (
                                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                                {error}
                                            </div>
                                        )}
                                        
                                        {/* Terms and Register Button */}
                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-600">
                                                    By signing up you agree to our <span className="font-bold text-stdBlue cursor-pointer">Terms of Use</span> and <span className="font-bold text-stdBlue cursor-pointer">Privacy Policy.</span>
                                                </p>
                                            </div>
                                            
                                            <button
                                                type="submit"
                                                className="w-full h-11 rounded-full font-bold text-white bg-gradient-to-r from-color1 to-stdBlue shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                Register as Professional
                                            </button>
                                            
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">
                                                    Already have an account? <span onClick={() => navigate('/login')} className="font-semibold text-stdBlue cursor-pointer">Login</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}