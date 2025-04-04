import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import checkLogin from '../utils/checkLogin';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Feedback from '../components/Feedback';

export default function LandingPageUser() {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [searchCategories] = useState([
        'Plumber', 'Electrician', 'Carpenter', 'Painter',
        'House Cleaning', 'Gardener', 'AC Repair', 'Appliance Repair'
    ]);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const sendLocationToServer = async (location) => {
        try {
            // console.log(`Bearer: ${Cookies.get('accessToken')}`);
            const response = await axios.post("http://localhost:8000/api/v1/users/location", location, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get('accessToken')}`
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error sending location to the server:", error);
        }
    };

    useEffect(() => {

        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("Latitude:", latitude, "Longitude:", longitude);
                        sendLocationToServer({ lat: latitude, lng: longitude });
                    },
                    (err) => {
                        console.log(err.message || "Unable to retrieve location");
                    }
                );
            }
        };

        const checkIfSavedLocation = async () => {
            const check = await axios.get("http://localhost:8000/api/v1/users/location", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                }
            });
            if (check.data.data === false) {
                getUserLocation();
            }
        }
        checkIfSavedLocation();
        // getUserLocation();
    }, [navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            checkLogin(navigate);

            try {
                const token = Cookies.get('accessToken');
                const response = await axios.get('/api/v1/users/current-user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.status === 200) {
                    const user = response.data.data;
                    setUserName(user.fullName);
                    fetchServiceProviders(user.city);
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        const fetchServiceProviders = async (city) => {
            try {
                const response = await axios.get(`/api/v1/service-providers/get-by-city?city=${city}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.status === 200) {
                    setServiceProviders(response.data.data);
                } else {
                    throw new Error('Failed to fetch service providers');
                }
            } catch (error) {
                console.error('Error fetching service providers:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            // Filter categories for suggestions
            const filtered = searchCategories.filter(category =>
                category.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);

            // Filter service providers based on search
            const filteredProviders = serviceProviders.filter(provider =>
                provider.businessName?.toLowerCase().includes(query.toLowerCase()) ||
                provider.fullName?.toLowerCase().includes(query.toLowerCase()) ||
                provider.services?.some(service =>
                    service.toLowerCase().includes(query.toLowerCase())
                )
            );
            setFilteredProviders(filteredProviders);
        } else {
            setSearchResults([]);
            setFilteredProviders(serviceProviders);
        }
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await axios.get(`/api/v1/service-providers/search?query=${searchQuery}`);
            if (response.status === 200) {
                setFilteredProviders(response.data.data);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error performing search:', error);
            toast.error('Search failed. Please try again.');
            setFilteredProviders([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchItemClick = (category) => {
        setSearchQuery(category);
        setSearchResults([]);

        // Filter providers based on selected category
        const filtered = serviceProviders.filter(provider =>
            provider.services?.some(service =>
                service.toLowerCase().includes(category.toLowerCase())
            )
        );
        setFilteredProviders(filtered);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    if (loading) {
        return <div className="text-center text-lg">Loading...</div>;
    }

    const getInitials = (name) => {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.toUpperCase();
    };

    const getGradient = () => {
        const gradients = [
            'bg-gradient-to-r from-gray-700 to-gray-900',
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };


    const getGradient2 = () => {
        const gradients = [
            'bg-gradient-to-r from-gray-400 to-gray-500',
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-stdBg to-white'>
            <div className='py-8 px-4 sm:px-6 lg:px-8'>
                {/* Main Container */}
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                        <div className="bg-gradient-to-r from-stdBlue to-color1 p-6 text-white">
                            <h1 className='text-3xl sm:text-4xl font-bold'>
                                Welcome back, {userName}!
                            </h1>
                            <p className='mt-2 text-white/80'>
                                Find the perfect service provider for your needs
                            </p>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSearchSubmit} className='max-w-2xl mx-auto' ref={searchRef}>
                                <div className='relative'>
                                    <div className='flex items-center gap-2'>
                                        <div className='relative flex-1'>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchInputChange}
                                                placeholder="Search for services (e.g., Plumber, Electrician)"
                                                className='w-full h-12 pl-12 pr-10 rounded-xl border-2 border-gray-200 
                                                focus:border-stdBlue focus:ring-2 focus:ring-stdBlue/20 
                                                transition-all duration-300 outline-none text-gray-700'
                                            />
                                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={clearSearch}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                                                    hover:text-gray-600 transition-colors"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                        </div>
                                        {/* <button
                                            type="submit"
                                            disabled={!searchQuery.trim() || isSearching}
                                            className={`h-12 px-6 bg-stdBlue text-white rounded-xl font-semibold
                                            flex items-center gap-2 shadow-lg transition-all duration-300
                                            ${searchQuery.trim() && !isSearching
                                                    ? 'hover:bg-color1 hover:scale-105 hover:shadow-xl'
                                                    : 'opacity-50 cursor-not-allowed'}`}
                                        >
                                            {isSearching ? 'Searching...' : 'Search'}
                                            <FaSearch />
                                        </button> */}
                                    </div>

                                    {/* Search Suggestions Dropdown */}
                                    {searchResults.length > 0 && !isSearching && (
                                        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg 
                                        border border-gray-200 max-h-60 overflow-y-auto">
                                            <ul className="py-2">
                                                {searchResults.map((result, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => handleSearchItemClick(result)}
                                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer
                                                        flex items-center gap-3 text-gray-700 transition-colors"
                                                    >
                                                        <FaSearch className="text-gray-400" size={14} />
                                                        <span>{result}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </form>

                            {/* Search Results Display */}
                            {isSearching && (
                                <div className="mt-6 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stdBlue mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Searching...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        <button
                            onClick={() => navigate('/projects')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-stdBlue hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <span>Browse Projects</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </button>
                        
                        <button
                            onClick={() => navigate('/create-project')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-color1 hover:bg-orange-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <span>Post a Project</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Service Providers Section */}
                    <div>
                        <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3'>
                            <span>
                                {searchQuery
                                    ? `Search Results for "${searchQuery}"`
                                    : 'Service Providers Near You'}
                            </span>
                            <div className="h-1 flex-1 bg-gradient-to-r from-stdBlue to-transparent rounded-full"></div>
                        </h2>

                        {isSearching ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stdBlue"></div>
                            </div>
                        ) : (
                            <>
                                {(searchQuery ? filteredProviders : serviceProviders).length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            No Service Providers Found
                                        </h3>
                                        <p className="text-gray-600">
                                            {searchQuery
                                                ? `No results found for "${searchQuery}". Try a different search term.`
                                                : 'No service providers available in your area yet.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                        {(searchQuery ? filteredProviders : serviceProviders).map((provider, index) => (
                                            <div key={index}
                                                className='bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                                    transition-all duration-300 overflow-hidden'>
                                                {/* Cover Image */}
                                                {provider.coverImage ? (
                                                    <img
                                                        src={provider.coverImage}
                                                        alt={`${provider.fullName}'s cover`}
                                                        className='h-32 w-full object-cover'
                                                    />
                                                ) : (
                                                    <div className={`h-32 w-full ${getGradient2()}`}></div>
                                                )}

                                                {/* Profile Section */}
                                                <div className='px-6 pb-6'>
                                                    {/* Avatar */}
                                                    <div className='-mt-16 mb-4'>
                                                        {provider.avatar ? (
                                                            <img
                                                                src={provider.avatar}
                                                                alt={provider.fullName}
                                                                className='w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto object-cover'
                                                            />
                                                        ) : (
                                                            <div className={`w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto 
                                                    flex items-center justify-center text-2xl font-bold text-white ${getGradient()}`}>
                                                                {getInitials(provider.fullName || '')}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Provider Info */}
                                                    <div className='text-center'>
                                                        <h3 className='text-xl font-bold text-gray-800 mb-1'>{provider.fullName}</h3>
                                                        <p className='text-color1 font-medium mb-1'>{provider.businessName}</p>
                                                        <p className='text-sm text-gray-500 mb-4'>{provider.email}</p>

                                                        {/* Action Buttons */}
                                                        <div className='flex gap-3 justify-center'>
                                                            <Link to={`/${provider._id}/profile`}
                                                                className='flex-1 px-4 py-2 bg-stdBlue text-white rounded-lg 
                                                    hover:bg-black transition-colors duration-300 text-sm font-medium'>
                                                                View Profile
                                                            </Link>
                                                            <Link to={`/${provider._id}/message`}
                                                                className='flex-1 px-4 py-2 bg-color1 text-white rounded-lg 
                                                    hover:bg-black transition-colors duration-300 text-sm font-medium'>
                                                                Message
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Feedback />
        </div>
    );
}