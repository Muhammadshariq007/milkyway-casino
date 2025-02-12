const jwt = require('jsonwebtoken');

// JWT Secret keys for signing tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Auth token secret
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'; // Refresh token secret

// Function to generate auth token
const generateAuthToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Function to generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
const verifyAuthToken = (token, callback) => {
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return callback({ success: false, message: 'Invalid or expired token.' }, null);
        }
        return callback(null, user); // Pass the user info in callback
    });
};

const verifyRefreshToken = (refreshToken, callback) => {
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return callback({ success: false, message: 'Invalid or expired refresh token.' }, null);
        }
        // Return the user data (usually userId)
        return callback(null, user);
    });
};


// Export the functions
module.exports = {
    generateAuthToken,
    generateRefreshToken,
    verifyAuthToken,
    verifyRefreshToken
};
