import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from "../components/Assets/backgroundImage.png"
import { toast } from 'react-toastify';
import SignUpPagePhoto from "../components/Assets/SignUpPagePhoto.jpg"

export default function UserSignUp() {
    // All ok
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        userType: 'user',
        contact: '',
        zipcode: '',
        state: '',
        city: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log('Form Data', formData);
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

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center  justify-center py-8 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat" 
     style={{ backgroundImage: `url(${SignUpPagePhoto})` }}>
                
                <div className="max-w-md w-full space-y-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="">
                    <div className="text-center">
    <div className="flex justify-center mb-4">
        <h1 className="text-4xl font-bold text-color1">Gig Fusion</h1>
    </div>
   
    <p className="mt-1 text-sm font-semibold text-stdBlue">
        Join our community of skilled Gig Experts!
    </p>
</div>
                    </div>

                    {/* Form Section */}
                    <div className="px-10  pb-10 ">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Personal Info */}
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className="w-full h-[45px] pl-4 rounded-lg border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                    className="w-full h-[45px] pl-4 rounded-lg border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="flex">                                        
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            placeholder="Phone Number"
                                            className="flex-1 h-[45px] px-2 rounded-l-lg border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    name="zipcode"
                                    value={formData.zipcode}
                                    onChange={handleInputChange}
                                    placeholder="Zipcode"
                                    className="w-32 h-[45px] px-4 rounded-r-lg border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex gap-4">
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="flex-1 h-[45px] px-3 rounded-lg border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                >
                                    <option value="">Select State</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="West Bengal">West Bengal</option>
                                </select>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="flex-1 h-[45px] px-3 rounded-lg border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                >
                                    <option disabled value="">Select City</option>
                                    <option value="Sambhajinagar">Sambhajinagar</option>
                                    <option value="Solapur">Solapur</option>
                                    <option value="Beed">Beed</option>
                                    <option value="Jalna">Jalna</option>
                                    <option value="Dharashiv">Dharashiv</option>
                                </select>
                            </div>

                            {/* Password Fields */}
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    className="w-full h-[45px] px-4 rounded-lg  border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="w-full h-[45px] px-4 rounded-lg  border border-gray-300 bg-white 
                                    focus:outline-none focus:ring-1 focus:ring-stdBlue focus:ring-opacity-50
                                    placeholder-gray-400 transition-all duration-200 ease-in-out"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm py-2 px-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Terms and Submit */}
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 text-center">
                                    By signing up you agree to our{' '}
                                    <a href="#" className="text-[#223265] font-semibold hover:underline">
                                        Terms of Use
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-[#223265] font-semibold hover:underline">
                                        Privacy Policy
                                    </a>
                                </p>
                                <div className='flex justify-center mt-2'>
                                <button
                                    type="submit"
                                    className="w-[150px] h-[45px]  bg-[#FF3D00] text-white rounded-lg
                                    hover:bg-[#E63600] transform transition-all duration-200 
                                    hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg
                                    font-semibold text-base"
                                >
                                    Create Account
                                </button>

                                </div>

                                
                            </div>
                        </form>

                        {/* Social Login */}
                        <div className="mt-2 space-y-4">
                            <button
                                className="w-full h-[40px]  bg-white border-2 border-gray-200 rounded-lg
                                flex items-center justify-center gap-2 hover:bg-gray-50
                                transition-all duration-200 font-medium text-gray-700"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a5.94 5.94 0 110-11.881c1.594 0 2.694.677 3.493 1.296l2.494-2.458a9.493 9.493 0 10-5.987 16.553c5.523 0 9.311-4.352 9.311-9.314 0-.199-.01-.396-.027-.589H12.545z" fill="#4285F4"/>
                                </svg>
                                Continue with Google
                            </button>
                           
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 text-sm mt-4">
                            Already have an account?{' '}
                            <a href="/login" className="text-[#223265] font-semibold hover:underline">
                                Log In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}