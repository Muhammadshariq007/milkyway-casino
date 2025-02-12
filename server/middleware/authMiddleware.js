const { verifyAuthToken, verifyRefreshToken, generateAuthToken } = require("../utils/tokenHandler");

const authenticateToken = async (req, res, next) => {
    try {
        // Extract the auth token from the Authorization header
        const authHeader = req.headers.authorization;
        const authToken = authHeader && authHeader.split(' ')[2];
        if (!authToken) {
            return res.status(401).json({ error: "Unauthorized: No access token provided." });
        }
        // Verify the access token
        verifyAuthToken(authToken, (err, user) => {
            if (err && !err.success && err.message === 'Invalid or expired token.') {
                const refreshToken = req.cookies.refreshToken; // Assuming refresh token is stored in httpOnly cookies
                if (!refreshToken) {
                    return res.status(401).json({ error: "Unauthorized: Please login again." });
                }

                verifyRefreshToken(refreshToken, (err, user) => {
                    if (err) {
                        return res.status(403).json({ error: "Forbidden: Invalid refresh token." });
                    }

                    // Generate a new access token and continue
                    const newAuthToken = generateAuthToken(user);
                    res.setHeader('Authorization', `Bearer ${newAuthToken}`);
                    req.user = user;
                    next();
                });
            }
            else if (err) {
                console.log("Access Token Error:", err);
                return res.status(401).json({ error: "Unauthorized: Please login again." });
            } else {
                // If the access token is valid, attach the user to the request object
                req.user = user;
                next();
            }
        });
    } catch (error) {
        console.log("Authentication Middleware Error:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

module.exports = authenticateToken;
