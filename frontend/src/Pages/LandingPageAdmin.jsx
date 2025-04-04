import { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaChartBar, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

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

    // Add table rendering to use filterData function
    const renderTable = (data, type) => (
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    {type === 'providers' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {filterData(data).map(item => (
                    <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.contact}</td>
                        {type === 'providers' && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.businessName}</td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${item.city}, ${item.state}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdAt}</td>
                    </tr>
                ))}
            </tbody>
        </table>
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
            {/* Sidebar - Collapsible on mobile */}
            <div className="w-full md:w-64 bg-[#223265] text-white md:min-h-screen">
                <div className="p-4">
                    <div className="flex justify-between items-center md:block">
                        <h2 className="text-2xl font-bold mb-2 md:mb-8">Admin Panel</h2>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white"
                        >
                            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                    <nav className={`space-y-2 ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
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
            <div className="flex-1 p-4 md:p-8">
                {/* Search Bar */}
                <div className="mb-4 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                </div>

                {/* Stats Cards */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
                        <StatCard title="Active Users" value={stats.activeUsers} color="green" />
                        <StatCard title="Total Providers" value={stats.totalProviders} color="purple" />
                        <StatCard title="Active Providers" value={stats.activeProviders} color="orange" />
                    </div>
                )}

                {/* Tables with filtered data */}
                <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white">
                    {activeTab === 'users' && renderTable(users, 'users')}
                    {activeTab === 'providers' && renderTable(serviceProviders, 'providers')}
                </div>
            </div>
        </div>
    );
}

// Stat Card Component with PropTypes
function StatCard({ title, value, color }) {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${colors[color]} rounded-lg flex items-center justify-center mb-3 md:mb-4`}>
                <FaChartBar className="text-white text-lg md:text-xl" />
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm">{title}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
}

// Add PropTypes validation
StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange']).isRequired
};

export default AdminDashboard;