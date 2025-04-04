// import React from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';
import UserSignUp from './Pages/UserSignUp';
import { SignLog } from "./Pages/SignLog";
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import Services from './Pages/Services';
import SearchService from './Pages/ServiceSearch.jsx';
import LandingPageUser from './Pages/LandingPageUser';
import UserProfile from './Pages/UserProfile';
import ChatPage from './Pages/ChatPage';
import MyBookings from './Pages/MyBookings';
import WorkerSignUp from './Pages/WorkerSignUp';
import ServiceProviderProfile from './Pages/serviceProviderProfile';
import LandingPageSP from './Pages/LandingPageSP';
import LandingPageAdmin from './Pages/LandingPageAdmin';
import EditServiceProfile from './Pages/EditProfile';
import BookJob from "./Pages/BookJob.jsx";
import SPJobs from './Pages/sp-jobs.jsx';
import UserDashboard from './Pages/UserDashboard';
import ProfileAdmin from './Pages/ProfileAdmin.jsx';
import BookingPage from './Pages/BookingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './Pages/AdminDashboard';
import Location from './Pages/GetLocation.jsx';
import Feedback from './components/Feedback.jsx';

import ProjectList from './Pages/ProjectList.jsx';
import ProjectDetails from './Pages/ProjectDetails.jsx';
import CreateProject from './Pages/CreateProject.jsx';
import MyProjects from './Pages/MyProjects.jsx';
import ProposalsList from './Pages/ProposalsList.jsx';
import CreateProposal from './Pages/CreateProposal.jsx';
import ProjectMatches from './Pages/ProjectMatches.jsx';
import EscrowDetails from './Pages/EscrowDetails.jsx';
import EscrowLandingPage from './Pages/EscrowLandingPage.jsx';
import Questions from './Pages/Questions.jsx';
import Validate from './Pages/validate.jsx';

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const noFooterRoutes = ["/login", "/signup", "/signup-w", "/signlog", "/chat"];
    const showFooter = !noFooterRoutes.includes(location.pathname);
    const userRole = Cookies.get('userRole');
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleAdminClick = () => {
        console.log('Admin button clicked');
        setShowAdminModal(true);
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            if (adminUsername === 'sagar' && adminPassword === 'atharva') {
                Cookies.set('userRole', 'admin', {
                    path: '/',
                    secure: true,
                    sameSite: 'strict'
                });

                setAdminUsername('');
                setAdminPassword('');
                setLoginError('');
                setShowAdminModal(false);

                navigate('/admin/dashboard', { replace: true });
                console.log('Admin login successful, redirecting to dashboard');
            } else {
                setLoginError('Invalid admin credentials');
            }
        } catch {
            setLoginError('Invalid admin credentials');
        }
    };

    return (
        <div>
            <Navbar />
            <Routes>
                {/* Before Login Links */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<UserSignUp />} />
                <Route path="/signlog" element={<SignLog />} />
                <Route path="/services" element={<Services />} />
                <Route path="/signup-w" element={<WorkerSignUp />} />

                {/* After Login Routes */}
                <Route path="/home" element={<LandingPageUser />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/:id/profile" element={<ServiceProviderProfile />} />
                <Route path="/dashboard" element={<LandingPageSP />} />
                <Route path="/dashboard-admin" element={<LandingPageAdmin />} />
                <Route path="/account/:id" element={<EditServiceProfile />} />
                <Route path="/book/:id" element={<BookJob />} />
                <Route path="/my-jobs" element={<SPJobs />} />
                <Route path="/SearchService" element={<SearchService />} />
                <Route path='/UserProfile' element={<UserProfile />} />
                <Route path='/ProfileAdmin' element={<ProfileAdmin />} />
                <Route path='/BookingPage' element={<BookingPage />} />
                <Route path='/Location' element={<Location />} />
                <Route path='/Feedback' element={<Feedback />} />
                <Route path='/questions' element={<Questions />} />
                <Route path='/validate' element={<Validate />} />

                {/* New Project & Freelance Routes */}
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/projects/:projectId/proposals" element={<ProposalsList />} />
                <Route path="/projects/:projectId/submit-proposal" element={<CreateProposal />} />
                <Route path="/projects/:projectId/matches" element={<ProjectMatches />} />
                <Route path="/projects/:projectId/escrow" element={<EscrowDetails />} />
                <Route path="/my-proposals" element={<ProposalsList userOnly={true} />} />
                <Route path="/my-matches" element={<ProjectMatches userOnly={true} />} />
                <Route path="/escrow" element={<EscrowLandingPage />} />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute roleRequired="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <div className="fixed bottom-6 right-6 z-50">
                <div className="group relative">
                    <button
                        onClick={handleAdminClick}
                        type="button"
                        className="flex items-center justify-center w-14 h-14 rounded-full 
                        bg-gradient-to-r from-[#FF3D00] to-[#FF5F33] 
                        hover:from-[#E63600] hover:to-[#FF4719]
                        shadow-lg hover:shadow-xl 
                        transform hover:scale-110 active:scale-95
                        transition-all duration-300 ease-in-out
                        cursor-pointer"
                        aria-label="Admin Panel"
                    >
                        <FaCog
                            className="w-6 h-6 text-white 
                            animate-[spin_10s_linear_infinite]
                            hover:animate-[spin_5s_linear_infinite]
                            pointer-events-none"
                        />
                    </button>

                    <div className="absolute bottom-full right-0 mb-2 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200
                        pointer-events-none"
                    >
                        <div className="bg-[#223265] text-white text-sm py-1 px-3 
                            rounded-md shadow-lg whitespace-nowrap"
                        >
                            {userRole === 'admin' ? 'Admin Panel' : 'Admin Login Required'}
                            <div className="absolute -bottom-1 right-5 w-2 h-2 
                                bg-[#223265] transform rotate-45"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Login Modal */}
            {showAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-8 w-[420px] shadow-2xl transform transition-all
                        animate-[fadeIn_0.3s_ease-out] relative"
                    >
                        {/* Close button - top right corner */}
                        <button
                            onClick={() => setShowAdminModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-[#FF3D00] 
                            transition-colors text-2xl w-8 h-8 flex items-center justify-center
                            rounded-full hover:bg-gray-100"
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#FF3D00] to-[#FF5F33] 
                                rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaCog className="w-8 h-8 text-white animate-[spin_10s_linear_infinite]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#223265] mb-2">Admin Access</h2>
                            <p className="text-sm text-gray-600">Enter your credentials to access admin panel</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAdminLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#223265] mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter admin username"
                                    value={adminUsername}
                                    onChange={(e) => setAdminUsername(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent
                                    transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#223265] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter admin password"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent
                                        transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 
                                        text-gray-400 hover:text-[#FF3D00] transition-colors
                                        w-8 h-8 flex items-center justify-center rounded-full
                                        hover:bg-gray-200"
                                    >
                                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {loginError && (
                                <div className="bg-red-50 text-red-500 text-sm py-2 px-3 rounded-lg
                                    border border-red-100 animate-[shake_0.5s_ease-in-out] flex items-center">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-[#FF3D00] to-[#FF5F33]
                                text-white rounded-lg hover:from-[#E63600] hover:to-[#FF4719]
                                transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                                shadow-md hover:shadow-lg font-semibold
                                flex items-center justify-center gap-2"
                            >
                                <FaCog className="w-5 h-5" />
                                Access Admin Panel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showFooter && <Footer />}

        </div>

    );
}

export default App;