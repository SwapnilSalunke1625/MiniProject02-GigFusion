import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import bgImage from '../components/Assets/backgroundImage.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LoginPhoto from "../components/Assets/LoginPage01Photo.jpg"


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        await axios.post('http://localhost:8000/api/v1/users/login',
            { email, password, },
            { headers: { 'Content-Type': 'application/json', } })
            .then((response) => {
                const JsonData = response.data;

                if (response.status === 200) {
                    toast.success('Login successful');
                    toast.info('Redirecting to dashboard');
                    document.cookie = `accessToken=${JsonData.data.accessToken}; path=/;`;
                    localStorage.setItem('user', JSON.stringify(JsonData.data.user));
                    setTimeout(() => {
                        if (JsonData.data.userType === 'user') {
                            navigate('/projects');
                        } else if (JsonData.data.userType === 'serviceProvider') {
                            navigate('/projects');
                        } else if (JsonData.data.userType === 'admin') {
                            navigate('/dashboard-admin');
                        } else {
                            setError('Login failed');
                        }
                    }, 1000);
                } else {
                    toast.error(toast.error(JsonData.message) || 'Login failed');
                    setError(JsonData.message || 'Login failed');
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    toast.error('Username or Email is required');
                    setError('Username or Email is required');
                } else if (error.response.status === 401) {
                    toast.error('Password is required');
                    setError('Password is required');
                } else if (error.response.status === 402) {
                    toast.error('Invalid Password');
                    setError('Invalid Password');
                } else if (error.response.status === 404) {
                    toast.error('User does not exist');
                    setError('User does not exist');
                } else {
                    toast.error('Login Failed. Please try again!!');
                    setError('Login Failed. Please try again.');
                }
            });
    };

    return (
        <>
            <div className='flex items-center justify-center font-stdFont relative'>
                <div className=' absolute inset-0 bg-cover bg-center filter blur-[2px]' style={{ backgroundImage: `url(${LoginPhoto})` }} />
                <div className='relative z-10'>
                    <div className=' flex items-center justify-center h-[90vh] font-stdFont  px-5'>
                        <div className="rounded-3xl w-full max-w-[450px] md:h-[450px] h-auto text-center bg-white p-5 ">
                            <h1 className='text-3xl md:text-4xl font-bold text-color1'>Welcome</h1>
                            <p className='text-xs md:text-sm mt-1 text-stdBlue font-semibold'>
                                Welcome to our community of skilled professionals!
                            </p>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-4 justify-center items-center mt-8">
                                    <input
                                        type="email"
                                        placeholder='Email'
                                        className='h-[45px] w-full max-w-[300px] md:max-w-[320px] border rounded-xl pl-3 outline-none text-sm md:text-base'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="relative w-full max-w-[300px] md:max-w-[320px]">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder='Password'
                                            className='h-[45px] w-full border rounded-xl pl-3 pr-10 outline-none text-sm md:text-base'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-color1 transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <p className='text-right mt-2 md:text-sm text-stdBlue'>
                                    <Link to="/Forgot">Forgot Password?</Link>
                                </p>
                                {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
                                <div className="mt-2">
                                    <button type='submit' className='h-[45px] w-[120px] bg-color1 rounded-full text-[18px] font-bold text-white hover:bg-stdBlue shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105'>
                                        Login
                                    </button>
                                </div>

                                <p className='text-sm mt-2'>
                                    Don&apos;t have an account? <Link to="/signup" className='text-[14px] font-semibold text-stdBlue'>Sign Up</Link>
                                </p>
                                <fieldset className=''>
                                    <legend>OR</legend>
                                </fieldset>
                                <div className="flex flex-col gap-2 justify-center items-center mt-1">
                                    <button className='w-full max-w-[250px] md:max-w-[280px] h-[45px] border border-stdBlue rounded-xl font-semibold flex items-center justify-center gap-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out '>
                                        <i className="fa-brands fa-google text-xl text-GoogleIcon"></i>
                                        <span className="text-gray-700">Login with Google</span>
                                    </button>

                                    {/* <button className='w-full max-w-[250px] md:max-w-[280px] h-[45px] border border-stdBlue rounded-xl font-semibold flex items-center justify-center gap-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out'>
                                        <i className="fa-brands fa-apple text-2xl text-black"></i>
                                        <span className="text-gray-700">Login with Apple</span>
                                    </button> */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}