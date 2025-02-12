import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API_URL}/api`, // Use import.meta.env for Vite
    // timeout: 10000, // Optional: Set a timeout
    withCredentials: true
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Here you can modify the request config, e.g., add an auth token
        const token = localStorage.getItem('token'); // Adjust as necessary
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Response Error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No Response:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
