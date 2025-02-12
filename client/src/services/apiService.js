// src/api/apiService.js

import axiosInstance from './axiosInstance'; // Import the Axios instance

class ApiService {
    async login(whatsappNumber, password) {
        try {
            const response = await axiosInstance.post('login', {
                whatsappNumber,
                password,
            });
            return response; // Return response data for further processing
        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async signUp(payload) {
        try {
            const response = await axiosInstance.post('signup', payload)
            return response;
        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async getUserProfile(userId) {
        try {
            const response = await axiosInstance.get(`profile/${userId}`)
            return response;
        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async changePassword(payload) {
        try {
            const response = await axiosInstance.put('change-password', payload)
            return response
        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async paymentInfo(userId) {
        try {
            const response = await axiosInstance.get(`payment-info/${userId}`)
            return response

        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async getAllUsers(filters) {
        try {
            const response = await axiosInstance.get('get-all-users', { params: filters })
            return response

        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async updateUserRole(id, role) {
        try {
            const response = await axiosInstance.put(`/update-role/${id}`, { role });
            return response;
        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async updateUserStatus(id, status) {
        try {
            const response = await axiosInstance.put(`/update-status/${id}`, { status })
            return response

        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async addPayment(payload) {
        try {
            const response = await axiosInstance.post(`/add-payment/`, payload)
            return response

        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async getUserCoins() {
        try {
            const response = await axiosInstance.get('/user-coins/')
            return response
        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }


    handleError(error) {
        // Centralized error handling can be added here
        console.error('API Error:', error);
    }

}

export default new ApiService();
