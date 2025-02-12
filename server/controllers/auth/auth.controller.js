const Auth = require("../../services/authService");
const { respBinder } = require("../../utils/utils");
exports.signupUser = async (req, res) => {
    try {
        const { whatsappNumber, email, password, fullName, cnic } = req.body;

        // Call the signup method from User class
        const result = await Auth.signup({
            whatsappNumber,
            email,
            password,
            fullName,
            cnic,
        });
        if (result.success) {
            return res.status(200).json(result);
        }
        else {
            return res.status(401).json(result);
        }
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.loginUser = async (req, res) => {
    const { whatsappNumber, password } = req.body;

    try {
        const result = await Auth.login(whatsappNumber, password);
        if (result.success) {
            // Set the authentication token in the response header
            res.cookie('refreshToken', result?.data?.refreshToken, {
                httpOnly: true, // Secure cookie
                secure: true, // Only send over HTTPS in production
                sameSite: 'Strict', // Prevent CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            });

            const data = {
                authToken: `Bearer ${result?.data?.authToken}`,
                user: result.data?.user
            }
            // Return a success response
            return res.status(200).json(respBinder(true, "Login successfully", data));
        }
        else {
            return res.status(401).json(respBinder(false, result.message, null));
        }

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    try {
        if (!refreshToken) {
            return res.status(401).json({ error: "Unauthorized: please login." });
        }

        const result = await Auth.refreshAuthToken(refreshToken)
        if (result.success) {
            return res.status(200).json(respBinder(true, "Token published", result.data));
        }
        else {
            return res.status(401).json(respBinder(false, result.message, null));
        }
    } catch (error) {
        console.error('Refresh Token:', error);
        return res.status(500).json({ message: `Internal server error` });
    }

}