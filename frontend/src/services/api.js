import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base URL
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for adding auth token
API.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiration (401 errors)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = Cookies.get('refreshToken');
                if (refreshToken) {
                    const res = await axios.post(`${API.defaults.baseURL}/users/refresh-token`, {
                        refreshToken
                    });

                    if (res.data.statusCode === 200) {
                        Cookies.set('accessToken', res.data.data.accessToken);
                        API.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`;
                        return API(originalRequest);
                    }
                }
            } catch (refreshError) {
                // If refresh fails, redirect to login
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                Cookies.remove('userRole');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default API;
