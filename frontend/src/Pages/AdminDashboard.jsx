import { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaChartBar, FaSearch, FaBars, FaTimes, FaPhone, FaBuilding, FaMapMarkerAlt, FaCalendar, FaSync, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { utils, writeFile } from 'xlsx';

// Move StatCard component definition outside AdminDashboard
const StatCard = ({ title, value, color }) => {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors[color]} rounded-lg flex items-center justify-center mb-2 sm:mb-3`}>
                <FaChartBar className="text-white text-sm sm:text-lg" />
            </div>
            <h3 className="text-gray-500 text-xs sm:text-sm">{title}</h3>
            <p className="text-lg sm:text-xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

// Add PropTypes validation
StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange']).isRequired
};

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        activeUsers: 0,
        activeProviders: 0
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const token = Cookies.get('accessToken');
            const response = await axios.get('http://localhost:8000/api/v1/users/get-all-users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const allData = response.data.data || [];

            // Filter users
            const allUsers = allData
                .filter(user => user.userType === 'user')
                .map(user => ({
                    _id: user._id,
                    name: user.fullName || 'N/A',
                    email: user.email || 'N/A',
                    contact: user.contact || 'N/A',
                    city: user.city || 'N/A',
                    state: user.state || 'N/A',
                    status: user.status || 'active',
                    createdAt: new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                }));

            // Filter service providers
            const allProviders = allData
                .filter(user => user.userType === 'serviceProvider')
                .map(provider => ({
                    _id: provider._id,
                    name: provider.fullName || 'N/A',
                    businessName: provider.businessName || 'N/A',
                    email: provider.email || 'N/A',
                    contact: provider.contact || 'N/A',
                    city: provider.city || 'N/A',
                    state: provider.state || 'N/A',
                    service: provider.service || 'Not specified',
                    status: provider.status || 'active',
                    createdAt: new Date(provider.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                }));

            setUsers(allUsers);
            setServiceProviders(allProviders);
            setStats({
                totalUsers: allUsers.length,
                totalProviders: allProviders.length,
                activeUsers: allUsers.filter(u => u.status === 'active').length,
                activeProviders: allProviders.filter(sp => sp.status === 'active').length
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchDataSafely = async () => {
            if (isMounted) {
                await fetchData();
            }
        };

        fetchDataSafely();

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter function for search
    const filterData = (data) => {
        return data.filter(item =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Update the table rendering function with better styled headers
    const renderTable = (data, type) => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#223265]">
                    <tr>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            <span className="flex items-center space-x-2">
                                <FaUsers className="hidden md:inline" />
                                <span>Name</span>
                            </span>
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            <span className="flex items-center space-x-2">
                                <FaSearch className="hidden md:inline" />
                                <span>Email</span>
                            </span>
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            <span className="flex items-center space-x-2">
                                <FaPhone className="hidden md:inline" />
                                <span>Contact</span>
                            </span>
                        </th>
                        {type === 'providers' && (
                            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                <span className="flex items-center space-x-2">
                                    <FaBuilding className="hidden md:inline" />
                                    <span>Business</span>
                                </span>
                            </th>
                        )}
                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            <span className="flex items-center space-x-2">
                                <FaMapMarkerAlt className="hidden md:inline" />
                                <span>Location</span>
                            </span>
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            <span className="flex items-center space-x-2">
                                <FaCalendar className="hidden md:inline" />
                                <span>Joined</span>
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filterData(data).map(item => (
                        <tr key={item._id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    <div className="md:hidden text-xs text-gray-500 mt-1">{item.email}</div>
                                    <div className="md:hidden text-xs text-gray-500">{item.contact}</div>
                                </div>
                            </td>
                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.contact}</td>
                            {type === 'providers' && (
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.businessName}</td>
                            )}
                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${item.city}, ${item.state}`}</td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{item.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Add refresh function
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    };

    // Add download function
    const handleDownload = (data, type) => {
        try {
            const worksheet = utils.json_to_sheet(data.map(item => ({
                Name: item.name,
                Email: item.email,
                Contact: item.contact,
                ...(type === 'providers' && { Business: item.businessName }),
                City: item.city,
                State: item.state,
                Status: item.status,
                'Joined Date': item.createdAt
            })));

            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, type === 'providers' ? 'Service Providers' : 'Users');
            
            // Generate filename with current date
            const date = new Date().toLocaleDateString().replace(/\//g, '-');
            const filename = `${type === 'providers' ? 'service-providers' : 'users'}-${date}.xlsx`;
            
            writeFile(workbook, filename);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
            // You might want to add a toast notification here
            alert('Failed to download Excel file. Please try again.');
        }
    };

    // Update the main content header to include action buttons
    const renderContentHeader = () => (
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF3D00]"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#223265] text-white rounded-lg hover:bg-[#2a3d7c] transition-colors disabled:opacity-50"
                >
                    <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>

                {activeTab !== 'dashboard' && (
                    <button
                        onClick={() => handleDownload(
                            activeTab === 'users' ? users : serviceProviders,
                            activeTab === 'users' ? 'users' : 'providers'
                        )}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FaFileExcel className="text-lg" />
                        <span className="hidden sm:inline">Export Excel</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF3D00]"></div>
            </div>
        );
    }

    if (!users && !serviceProviders) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error loading data. Please try again.
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-[#223265] text-white">
                <div className="p-4">
                    <div className="flex justify-between items-center md:block">
                        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-8">Admin Panel</h2>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white p-2"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                    
                    <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block space-y-2`}>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors
                                ${activeTab === 'dashboard' ? 'bg-[#FF3D00] text-white' : 'hover:bg-[#2a3d7c]'}`}
                        >
                            <FaChartBar />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors
                                ${activeTab === 'users' ? 'bg-[#FF3D00] text-white' : 'hover:bg-[#2a3d7c]'}`}
                        >
                            <FaUsers />
                            <span>Users</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('providers')}
                            className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors
                                ${activeTab === 'providers' ? 'bg-[#FF3D00] text-white' : 'hover:bg-[#2a3d7c]'}`}
                        >
                            <FaUserTie />
                            <span>Service Providers</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-3 md:p-8">
                {/* Replace the old search bar with the new content header */}
                {renderContentHeader()}

                {/* Stats Cards */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
                        <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
                        <StatCard title="Active Users" value={stats.activeUsers} color="green" />
                        <StatCard title="Total Providers" value={stats.totalProviders} color="purple" />
                        <StatCard title="Active Providers" value={stats.activeProviders} color="orange" />
                    </div>
                )}

                {/* Tables */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {activeTab === 'users' && renderTable(users, 'users')}
                    {activeTab === 'providers' && renderTable(serviceProviders, 'providers')}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;