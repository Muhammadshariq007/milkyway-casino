const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Load environment variables
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const FULLNAME = process.env.FULLNAME;
const CNIC = process.env.CNIC;
const ROLE = process.env.ROLE;

async function createAdmin() {
    try {
        // Check if a user with the same email or WhatsApp number already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: EMAIL },
                    { whatsappNumber: WHATSAPP_NUMBER }
                ]
            }
        });

        if (existingUser) {
            console.log("Admin user already exists.");
            return;
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        // Create the admin user in the database
        const adminUser = await prisma.user.create({
            data: {
                whatsappNumber: WHATSAPP_NUMBER,
                email: EMAIL,
                password: hashedPassword,
                fullName: FULLNAME,
                cnic: CNIC,
                role: ROLE,  // Assumes ROLE is "ADMIN"
            }
        });

        console.log("Admin user created successfully.");
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
}

// Export the function
module.exports = { createAdmin };
