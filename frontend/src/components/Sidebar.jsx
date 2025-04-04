import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import userConversation from '../Zustans/userConversation.js';
import { useSocketContext } from '../context/SocketContext.jsx';
import PropTypes from 'prop-types';

const Sidebar = ({ onSelectUser }) => {
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const { setSelectedConversation } = userConversation();
    const { onlineUser } = useSocketContext();

    const authUser = useRef(null);

    // Fetch the authenticated user
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get('/api/v1/users/current-user', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        Content: 'application/json',
                    }
                });
                authUser.current = res.data.data;
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        getUser();
    }, []);

    const nowOnline = chatUser.map(user => user._id);
    const isOnline = nowOnline.filter((user) => onlineUser.includes(user));

    // Fetch current chat users
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const chatters = await axios.get('/api/v1/users/currentChatters', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`,
                        Content: 'application/json',
                    }
                });
                const data = chatters.data;
                if (data.success) {
                    setChatUser(data.data || []);
                } else {
                    setChatUser([]);
                }
            } catch (error) {
                console.error('Error fetching chat users:', error);
            } finally {
                setLoading(false);
            }
        };
        chatUserHandler();
    }, []);

    // Debounce search input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchInput.trim()) {
                handleSearch();
            } else {
                setSearchUser([]);
                setIsSearching(false);
            }
        }, 300); // Delay of 300ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    // Handle search request
    const handleSearch = async () => {
        if (!searchInput.trim()) return;

        setLoading(true);
        setIsSearching(true);

        try {
            const response = await axios.get(`/api/v1/users/search?query=${searchInput.trim()}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    Content: 'application/json',
                }
            });

            const data = response.data;
            if (data.success) {
                setSearchUser(data.data || []);
            } else {
                setSearchUser([]);
                toast.error("No users found");
            }
        } catch (error) {
            console.error("Error searching users:", error);
            // toast.error("Error occurred while searching");
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSelectedUserId(user._id);
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearchUser([]);
        setIsSearching(false);
    };

    return (
        <div className="sidebar py-4 px-1 bg-white w-[20vw] min-w-[20vw] max-w-[20vw]">
            {/* Search Bar */}
            <div className="search-bar mb-4">
                <form className="relative">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search"
                        className="w-full p-2 pl-3 pr-10 border rounded-full focus:outline-none focus:ring-PrimaryColor1 focus:ring-opacity-50 focus:ring-1"
                    />
                    {searchInput ? (
                        <button
                            type="button"
                            className="btn btn-circle bg-red-600 hover:bg-gray-950 text-white p-2 rounded-full w-8 absolute right-1 top-1/2 transform -translate-y-1/2"
                            onClick={clearSearch}
                        >
                            <FaTimes />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-circle bg-PrimaryColor1 hover:bg-gray-950 text-white p-2 rounded-full w-8 absolute right-1 top-1/2 transform -translate-y-1/2"
                        >
                            <FaSearch />
                        </button>
                    )}
                </form>
            </div>

            {/* <div className="divider h-[1px] bg-black"></div> */}

            {/* Loading Indicator */}
            {loading && <p>Loading...</p>}

            {/* Display Users */}
            {!loading && (
                <div className="min-h-[70%] max-h-[70%] overflow-y-auto scrollbar">
                    {isSearching ? (
                        searchUser.length > 0 ? (
                            <div className='w-auto'>
                                {searchUser.map((user, index) => (
                                    <div key={user._id}>
                                        <div
                                            className={`flex gap-3 items-center rounded p-2 cursor-pointer ${selectedUserId === user._id ? 'bg-white' : ''}`}
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <div className={`avatar w-full p-2 flex gap-3 items-center ${isOnline[index] ? 'online' : ''}`}>
                                                {
                                                    user.avatar ? (
                                                        <>
                                                            <img src={user.avatar}
                                                                alt={user.fullName.split(' ').map((name) => name.charAt(0).toUpperCase()).join('')}
                                                                className='h-8 w-8 rounded-full' />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div
                                                                className='h-8 w-8 bg-black rounded-full text-sm text-white font-bold grid items-center justify-center'>
                                                                {user.fullName.split(' ').map((name) => name.charAt(0).toUpperCase()).join('')}
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-gray-950'>{user.fullName}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="divider bg-black h-[1px]"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No search results found</p>
                        )
                    ) : (
                        chatUser.length > 0 ? (
                            <div className='w-auto'>
                                {chatUser.map((user, index) => (
                                    console.log(`Online: ${isOnline[index]}`),
                                    <div key={user._id}>
                                        <div
                                            className={`flex gap-3 items-center rounded p-2 cursor-pointer ${selectedUserId === user._id ? 'bg-gray-200' : ''}`}
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <div className={`avatar w-full p-2 flex gap-3 items-center relative`}>
                                                <div className={`h-3 w-3 rounded-full bg-lime-400 ${isOnline[index] ? 'absolute top-0 left-0' : 'hidden'}`}></div>
                                                {
                                                    user.avatar ? (
                                                        <>
                                                            <img src={user.avatar}
                                                                alt={user.fullName.split(' ').map((name) => name.charAt(0).toUpperCase()).join('')}
                                                                className='h-8 w-8 rounded-full' />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div
                                                                className='h-8 w-8 bg-black rounded-full text-sm text-white font-bold grid items-center justify-center'>
                                                                {user.fullName.split(' ').map((name) => name.charAt(0).toUpperCase()).join('')}
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-gray-950'>{user.fullName}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="divider divide-solid h-[1px] px-3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No chat users available</p>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

Sidebar.propTypes = {
    onSelectUser: PropTypes.func.isRequired
};

export default Sidebar;
