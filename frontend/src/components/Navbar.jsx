import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import gigFusionlogo from "../components/Assets/gigFusionlogo.png";
import {
  FiMenu, FiX, FiHome, FiBookmark, FiMessageSquare, FiGrid, FiBriefcase,
  FiUsers, FiSettings, FiUser, FiLogOut, FiTool, FiUserPlus
} from 'react-icons/fi';
import LoadingBar from 'react-top-loading-bar';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const loadingBarRef = useRef(null);

  useEffect(() => {
    loadingBarRef.current?.continuousStart();
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/v1/users/current-user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('accessToken')}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserType(response.data.data.userType);
          setUserId(response.data.data._id);
        }
      } catch (err) {
        console.error('Authentication failed:', err);
        setIsAuthenticated(false);
        setUserType('unauthorized');
      } finally {
        loadingBarRef.current?.complete();
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    loadingBarRef.current?.continuousStart();
    try {
      const token = Cookies.get('accessToken');
      await axios.post('/api/v1/users/logout', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      Cookies.set('accessToken', '', { expires: 0 });
      setIsAuthenticated(false);
      setIsMobileMenuOpen(false);
      localStorage.setItem('user', null);
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      loadingBarRef.current?.complete();
    }
  };

  const getHomeLink = () => {
    switch (userType) {
      case 'user': return '/home';
      case 'serviceProvider': return '/dashboard';
      case 'admin': return '/dashboard-admin';
      default: return '/';
    }
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-base md:text-lg font-semibold transition-colors duration-200 p-2 md:p-0
        ${isActive ? 'text-color1 underline' : 'text-stdBlue hover:text-color1'}`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </NavLink>
  );

  NavItem.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  return (
    <nav className='relative font-stdFont'>
      <div className='flex justify-between items-center h-[70px] border-b-2 px-4 md:px-8 bg-white shadow-md'>
        <Link to={getHomeLink()}>
          <img src={gigFusionlogo} alt="Logo" className='h-[65px] outline-none border-none' />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {userType === 'user' && (
                <>
                  <NavItem to="/home">Home</NavItem>
                  <NavItem to="/my-bookings">My Bookings</NavItem>
                  <NavItem to="/chat">Chat</NavItem>
                  <NavItem to="/projects">Projects</NavItem>
                  <NavItem to="/my-projects">My Projects</NavItem>
                  {/* <NavItem to="/escrow">Escrow</NavItem> */}
                </>
              )}
              {userType === 'serviceProvider' && (
                <>
                  <NavItem to="/dashboard">Dashboard</NavItem>
                  <NavItem to="/my-jobs">My Jobs</NavItem>
                  <NavItem to="/chat">Chat</NavItem>
                  <NavItem to="/validate">Validate</NavItem>
                  <NavItem to="/projects">Find Work</NavItem>
                  <NavItem to="/my-proposals">My Proposals</NavItem>
                  <NavItem to="/my-matches">Matches</NavItem>
                </>
              )}
              {userType === 'admin' && (
                <>
                  <NavItem to="/dashboard-admin">Admin Dashboard</NavItem>
                  <NavItem to="/manage-users">Manage Users</NavItem>
                  <NavItem to="/manage-services">Manage Services</NavItem>
                </>
              )}
              <Link to={`/account/${userId}`} className="flex items-center">
                <FiUser 
                  className="text-stdBlue hover:text-color1 transition-colors duration-200" 
                  size={24} 
                  title="Account"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-stdBlue hover:text-color1 transition-colors duration-200"
              >
                <FiLogOut size={24} title="Logout" />
              </button>
            </>
          ) : (
            <>
              <NavItem to="/services">Services</NavItem>
              <NavItem to="/signup-w">Become a Pro</NavItem>
              <Link to="/signlog">
                <button className='px-6 py-2 bg-stdBlue text-white rounded-full hover:bg-color1 shadow-md transition-all duration-300 transform hover:scale-105'>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-stdBlue hover:text-color1 transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed inset-y-0 right-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <Link
              to={getHomeLink()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block"
            >
              <img src={gigFusionlogo} alt="Logo" className='h-[50px]' />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-stdBlue hover:text-color1 transition-colors"
              aria-label="Close menu"
            >
              <FiX size={26} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="overflow-y-auto h-[calc(100%-70px)] py-4">
            <div className="flex flex-col space-y-2 px-4">
              {isAuthenticated ? (
                <>
                  {userType === 'user' && (
                    <div className="space-y-2">
                      <NavItem to="/home">
                        <div className="flex items-center gap-3">
                          <FiHome size={22} />
                          <span>Home</span>
                        </div>
                      </NavItem>
                      <NavItem to="/my-bookings">
                        <div className="flex items-center gap-3">
                          <FiBookmark size={22} />
                          <span>My Bookings</span>
                        </div>
                      </NavItem>
                      <NavItem to="/chat">
                        <div className="flex items-center gap-3">
                          <FiMessageSquare size={22} />
                          <span>Chat</span>
                        </div>
                      </NavItem>
                      <NavItem to="/projects">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={22} />
                          <span>Projects</span>
                        </div>
                      </NavItem>
                      <NavItem to="/my-projects">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={22} />
                          <span>My Projects</span>
                        </div>
                      </NavItem>
                      <NavItem to="/escrow">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={22} />
                          <span>Escrow</span>
                        </div>
                      </NavItem>
                    </div>
                  )}
                  {userType === 'serviceProvider' && (
                    <div className="space-y-2">
                      <NavItem to="/dashboard">
                        <div className="flex items-center gap-3">
                          <FiGrid size={22} />
                          <span>Dashboard</span>
                        </div>
                      </NavItem>
                      <NavItem to="/my-jobs">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={22} />
                          <span>My Jobs</span>
                        </div>
                      </NavItem>
                      <NavItem to="/chat">
                        <div className="flex items-center gap-3">
                          <FiMessageSquare size={22} />
                          <span>Chat</span>
                        </div>
                      </NavItem>
                      <NavItem to="/projects">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={22} />
                          <span>Find Work</span>
                        </div>
                      </NavItem>
                      <NavItem to="/my-proposals">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={22} />
                          <span>My Proposals</span>
                        </div>
                      </NavItem>
                      <NavItem to="/my-matches">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={22} />
                          <span>Matches</span>
                        </div>
                      </NavItem>
                    </div>
                  )}
                  {userType === 'admin' && (
                    <div className="space-y-2">
                      <NavItem to="/dashboard-admin">
                        <div className="flex items-center gap-3">
                          <FiGrid size={22} />
                          <span>Admin Dashboard</span>
                        </div>
                      </NavItem>
                      <NavItem to="/manage-users">
                        <div className="flex items-center gap-3">
                          <FiUsers size={22} />
                          <span>Manage Users</span>
                        </div>
                      </NavItem>
                      <NavItem to="/manage-services">
                        <div className="flex items-center gap-3">
                          <FiSettings size={22} />
                          <span>Manage Services</span>
                        </div>
                      </NavItem>
                    </div>
                  )}

                  {/* Account and Logout Section */}
                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                    <NavItem to={`/account/${userId}`}>
                      <div className="flex items-center gap-3">
                        <FiUser size={24} className="text-stdBlue hover:text-color1 transition-colors duration-200" />
                        <span>My Account</span>
                      </div>
                    </NavItem>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 text-stdBlue hover:text-color1 transition-colors duration-200"
                    >
                      <FiLogOut size={24} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <NavItem to="/services">
                      <div className="flex items-center gap-3">
                        <FiTool size={22} />
                        <span>Services</span>
                      </div>
                    </NavItem>
                    <NavItem to="/signup-w">
                      <div className="flex items-center gap-3">
                        <FiBriefcase size={22} />
                        <span>Become a Pro</span>
                      </div>
                    </NavItem>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to="/signlog"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <button className='w-full px-4 py-2.5 bg-stdBlue text-white rounded-full hover:bg-color1 shadow-md transition-all duration-300 flex items-center justify-center gap-3'>
                        <FiUserPlus size={22} />
                        <span>Sign Up</span>
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoadingBar
        ref={loadingBarRef}
        height={2}
        color='#FF3D00'
        className="absolute top-0 left-0 right-0"
      />
    </nav>
  );
}