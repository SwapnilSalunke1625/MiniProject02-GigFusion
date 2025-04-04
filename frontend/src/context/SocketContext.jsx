import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

const SocketContext = createContext();
let authUser;

const getUser = async () => {
    try {
        const response = await axios.get('/api/v1/users/current-user', {
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
                'Content-Type': 'application/json',
            }
        });
        authUser = response.data.data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);

    useEffect(() => {
        const initializeSocket = async () => {
            await getUser();
            if (authUser) {
                const newSocket = io("http://localhost:8000", {
                    query: {
                        userId: authUser?._id,
                    }
                });
                newSocket.on("getOnlineUsers", (users) => {
                    setOnlineUser(users);
                });
                setSocket(newSocket);
                return () => {
                    newSocket.disconnect();
                };
            }
        };
        initializeSocket();
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUser }}>
            {children}
        </SocketContext.Provider>
    );
};