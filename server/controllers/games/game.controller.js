const Games = require("../../services/game.service");
const { respBinder } = require("../../utils/utils");
const WebSocketServerSingleton = require('../../websocket/ws')
exports.getSpinningRecords = async (req, res) => {

    // If no user ID is found, return an unauthorized response
    const { noOfRecords } = req.params;

    try {
        // Fetch user profile using userId
        const result = await Games.getLastSpins(noOfRecords);

        // If the user profile is found, return success response
        if (result) {
            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error("Error getSpinningRecords:", error); // Log the error for debugging

        // Return an error response with the appropriate message
        return res.status(500).json(respBinder(false, `Error getSpinningRecords: ${error.message}`));
    }
};

exports.placeBet = async (req, res) => {
    const { betOption, coins, type } = req.body
    const userId = req.user?.userId;
    try {
        const result = await Games.placeBet(betOption, coins, userId, type);


        if (result) {

            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }

    } catch (error) {
        console.error("Error placeBet:", error); // Log the error for debugging
        // Return an error response with the appropriate message
        return res.status(500).json(respBinder(false, `Error placeBet: ${error.message}`));
    }
}