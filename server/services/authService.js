const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { respBinder } = require('../utils/utils'); // Adjust the path as necessary
const { generateAuthToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenHandler');

const prisma = new PrismaClient();

class Auth {
    static async signup({ whatsappNumber, email, password, fullName, cnic }) {
        try {
            // Validate input data
            if (!whatsappNumber || !email || !password || !fullName || !cnic) {
                // return { error: "All fields are required." };
                return respBinder(false, "All fields are required", null)
            }

            // Email validation
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                return respBinder(false, "Invalid email format", null)

            }

            // CNIC validation
            const cnicRegex = /^\d{5}-\d{7}-\d$/;
            if (!cnicRegex.test(cnic)) {
                return respBinder(false, "CNIC must be in the format 'XXXXX-XXXXXXX-X'.", null)
            }
            let isExist = await prisma.user.findUnique({
                where: {
                    whatsappNumber: whatsappNumber
                }
            })
            if (isExist) {
                return respBinder(false, "Whatsapp number already exist", null)

            }
            isExist = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            if (isExist) {
                return respBinder(false, "Email already exist", null)
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = await prisma.user.create({
                data: {
                    whatsappNumber,
                    email,
                    password: hashedPassword,
                    fullName,
                    cnic,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            return respBinder(true, "Signup successful!", newUser)
        } catch (error) {
            return respBinder(false, `Signup failed: ${error.message}`, null); s
        }
    }

    static async login(whatsappNumber, password) {
        try {
            // Validate input data
            if (!whatsappNumber || !password) {
                return respBinder(false, "All fields are required", null);
            }
            // Find user by whatsappNumber or email (adjust as necessary)
            const user = await prisma.user.findUnique({
                where: {
                    whatsappNumber: whatsappNumber,
                },
            });
            if (!user) {
                return respBinder(false, "Invalid credentials", null);
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return respBinder(false, "Invalid credentials", null);
            }
            if (user.status === 'INACTIVE') {
                return respBinder(false, "You are not active, please contact us", null)
            }
            const authToken = generateAuthToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            const data = {
                authToken: authToken,
                refreshToken: refreshToken,
                user: user
            }
            // Successful login 
            return respBinder(true, "Login successful!", data);
        } catch (error) {
            return respBinder(false, `Login failed: ${error.message}`, null);
        }
    }


    static async refreshAuthToken(refreshToken) {
        return new Promise((resolve, reject) => {
            if (!refreshToken) {
                return reject({ success: false, message: 'Refresh token not provided' });
            }

            verifyRefreshToken(refreshToken, (err, user) => {
                if (err) {
                    return reject({ success: false, message: 'Invalid or expired refresh token' });
                }

                // Generate a new auth token
                const newAuthToken = generateAuthToken(user.userId);

                // Return the new auth token
                return resolve({
                    success: true,
                    message: 'Auth token refreshed successfully',
                    data: newAuthToken
                });
            });
        });
    }
}

module.exports = Auth;
