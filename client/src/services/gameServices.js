import axiosInstance from './axiosInstance'; // Import the Axios instance

class GameService {
    async getSpinningResults(noOfRecords) {
        try {
            const response = await axiosInstance.get(`get-last-spins/${noOfRecords}`)
            return response;
        } catch (error) {
            this.handleError(error); // Handle errors here
            throw error; // Rethrow to handle in the component
        }
    }
    async placeBet(data) {
        try {
            const response = await axiosInstance.post(`place-bet/`, data)
            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
}
export default new GameService();
