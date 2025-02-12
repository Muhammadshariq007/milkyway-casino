const User = require("../../services/user.services");
const { respBinder } = require("../../utils/utils");

exports.getProfile = async (req, res) => {

    // If no user ID is found, return an unauthorized response
    const { id } = req.params;

    if (!id || id === undefined) {
        return res.status(401).json(respBinder(false, "Unauthorized", null)); // Fix the response status and message
    }

    try {
        // Fetch user profile using userId
        const result = await User.getUserProfile(id);

        // If the user profile is found, return success response
        if (result) {
            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error("Error fetching user profile:", error); // Log the error for debugging

        // Return an error response with the appropriate message
        return res.status(500).json(respBinder(false, `Error fetching user profile: ${error.message}`));
    }
};


exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const id = req.user?.userId; // Ensure req.user is correctly populated from the token

    try {
        const result = await User.changePassword(currentPassword, newPassword, id);
        if (result) {
            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }

    } catch (error) {
        console.error("Unexpected error in changePassword controller:", error);
        res.status(500).json(respBinder(false, `Error changing user password: ${error.message}`));
    }
};

exports.paymentInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.paymentInfo(id)
        if (result) {
            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }

    } catch (error) {
        console.error("Unexpected error in paymentInfo controller:", error);
        res.status(500).json(respBinder(false, `Error paymentInfo: ${error.message}`));
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const { search, role, status, page = 1, limit = 10 } = req.query;
        const result = await User.getAllUsers(search, role, status, page, limit)
        if (result) {
            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }

    } catch (error) {
        console.error("Unexpected error in get All Users controller:", error);
        res.status(500).json(respBinder(false, `Error Fetching All Users: ${error.message}`));
    }
}
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const result = await User.updateRole(id, role)
        if (result) {
            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error("Unexpected error in Updating Users controller:", error);
        res.status(500).json(respBinder(false, `Error Updating Users Role: ${error.message}`));
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await User.updateStatus(id, status)
        if (result) {
            return res.status(200).json(result);
        } else {
            // If no profile is found, return an appropriate response
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error("Unexpected error in Updating Users controller:", error);
        res.status(500).json(respBinder(false, `Error Updating Users Status: ${error.message}`));
    }
}
exports.handleAddPayment = async (req, res) => {
    const { userId, type, amount } = req.body;

    // Validate input
    if (!userId || !type || !amount) {
        return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    try {
        const result = await User.addPayment(userId, type, amount);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error("Controller Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.getCoinsBalance = async (req, res) => {
    try {
        const { userId } = req.user;
        const response = await User.getCoins(userId);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Controller Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }

}