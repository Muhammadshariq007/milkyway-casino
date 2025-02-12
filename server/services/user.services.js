const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { respBinder } = require('../utils/utils'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const { Decimal } = require('decimal.js');


class User {
    static async getUserProfile(id) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    whatsappNumber: true,
                    email: true,
                    fullName: true,
                    cnic: true,
                    role: true,
                    status: true,

                }
            });
            if (!user) {
                return respBinder(false, "User not found", null); // Adjusted structure
            }
            const balance = await prisma.payment.aggregate({
                where: {
                    userId: user.id,
                },
                _sum: {
                    coins: true,
                    debit: true,
                    credit: true,
                }
            });

            const paymentInfo = {
                coins: balance._sum.coins || 0,
                debit: balance._sum.debit || 0,
                credit: balance._sum.credit || 0
            }

            return respBinder(true, "User profile found", { user: user, payment: paymentInfo });
        } catch (error) {
            console.error("Error fetching user profile:", error); // Correctly log the error
            return respBinder(false, "Server error", null);
        }
    }

    static async changePassword(currentPassword, newPassword, id) {
        try {
            // Find the user
            const userProfileResult = await User.getUserProfile(id);

            if (!userProfileResult.success) {
                return userProfileResult // Return user not found response
            }

            const user = userProfileResult.data; // Extract user data

            // Check if current password is correct
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return respBinder(false, "Current password is incorrect", null); // Return incorrect password response
            }
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update user password in database
            await prisma.user.update({
                where: { id: id },
                data: { password: hashedPassword }
            });
            return respBinder(true, "Password changed successfully", user)
        } catch (error) {
            console.error("Error changing password:", error);
            return respBinder(false, `Server erroro in change password ${error}`, null)
        }
    }
    static async paymentInfo(id) {
        try {
            const userProfileResult = await User.getUserProfile(id);

            if (!userProfileResult.success) {
                return userProfileResult // Return user not found response
            }

            const user = userProfileResult.data.data;
            const paymentInfo = await prisma.payment.findMany({
                where: {
                    userId: id
                },
                select: {
                    id: true,
                    credit: true,
                    debit: true,
                    coins: true,
                    createdAt: true,
                    desc: true,
                }
            })
            const totals = await prisma.payment.aggregate({
                where: {
                    userId: id
                },
                _sum: {
                    debit: true,
                    credit: true,
                    coins: true
                }
            });
            const result = {
                paymentInfo: paymentInfo,
                totalDebit: totals._sum.debit,
                totalCredit: totals._sum.credit,
                totalCoins: totals._sum.coins
            }
            return respBinder(true, "Retrieve all payment info of user", result)
        } catch (error) {
            console.error("Error changing password:", error);
            return respBinder(false, `Server error in change password ${error}`, null)
        }
    }
    static async getAllUsers(search, role, status, page = 1, limit = 10) {
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        try {
            // Prisma query to get filtered and paginated users
            const where = {
                AND: [
                    search ? {
                        OR: [
                            { fullName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                            { whatsappNumber: { contains: search, mode: 'insensitive' } },
                        ]
                    } : {},
                    role ? { role: role } : {},
                    status ? { status: status } : {}
                ]
            };
            const users = await prisma.user.findMany({
                where,
                skip,
                take,
                select: {
                    id: true,
                    fullName: true,
                    whatsappNumber: true,
                    email: true,
                    cnic: true,
                    role: true,
                    status: true,
                },
            });

            // Fetch total count of users matching the filters (for pagination)
            const totalUsers = await prisma.user.count({ where });


            const payload = {
                users,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers
            }
            return respBinder(true, "Retrieve all payment info of user", payload)
        } catch (error) {
            console.error('Error fetching users:', error);
            return respBinder(false, `Server error in Failed to fetch users ${error}`, null)
        }

    }
    static async updateRole(id, role) {
        try {
            const isExist = await prisma.user.findUnique({
                where: {
                    id: id
                }
            })
            if (!isExist) {
                return respBinder(false, "User not found", null)
            }
            await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    role: role
                }
            })
            return respBinder(true, "User role has been updated")

        } catch (error) {
            console.error('Error updating Role:', error);
            return respBinder(false, `Server error in Failed to update user role ${error}`, null)
        }
    }
    static async updateStatus(id, status) {
        try {
            const isExist = await prisma.user.findUnique({
                where: {
                    id: id
                }
            })
            if (!isExist) {
                return respBinder(false, "User not found", null)
            }
            await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    status: status
                }
            })
            return respBinder(true, "User status has been updated")

        } catch (error) {
            console.error('Error updating Status:', error);
            return respBinder(false, `Server error in Failed to update user status ${error}`, null)
        }
    }
    static async addPayment(id, type, amount) {
        const payment = await prisma.payment.aggregate({
            where: {
                userId: id,
            },
            _sum: {
                coins: true,
                credit: true,
                debit: true,
            },
        });

        // Convert amount to Decimal
        const decimalAmount = new Decimal(amount);

        try {
            // Use a transaction for safety
            const transaction = await prisma.$transaction(async (prisma) => {
                switch (type) {
                    case "debit":
                        await prisma.payment.create({
                            data: {
                                userId: id,
                                debit: decimalAmount.toNumber(), // Store as a number
                                paymentType: 'DEBIT',
                                transactionType: 'ADMIN',
                                transactionStatus: true,
                                desc: "Adding Debit By Admin",
                            },
                        });
                        return { success: true, message: `Amount ${amount} has been deposited` };

                    case "coins":
                        if (payment._sum.debit < decimalAmount.toNumber()) {
                            throw new Error("Amount is greater than debit amount");
                        }
                        await prisma.payment.create({
                            data: {
                                userId: id,
                                debit: decimalAmount.negated().toNumber(), // Store as a negative number
                                paymentType: 'DEBIT',
                                transactionType: 'ADMIN',
                                transactionStatus: true,
                                desc: "Subtracting Debit to Add Coins By System",
                            },
                        });
                        await prisma.payment.create({
                            data: {
                                userId: id,
                                coins: decimalAmount.toNumber(), // Store as a number
                                paymentType: 'COINS',
                                transactionType: 'ADMIN',
                                transactionStatus: true,
                                desc: "Adding Coins By Admin",
                            },
                        });
                        return { success: true, message: `Purchased ${amount} coins` };

                    case 'credit':
                        if (payment._sum.coins < decimalAmount.toNumber()) {
                            throw new Error("Amount is greater than coins available");
                        }
                        await prisma.payment.create({
                            data: {
                                userId: id,
                                coins: decimalAmount.negated().toNumber(), // Store as a negative number
                                paymentType: 'COINS',
                                transactionType: 'ADMIN',
                                transactionStatus: true,
                                desc: "Subtracting Coins to Credit By System",
                            },
                        });
                        await prisma.payment.create({
                            data: {
                                userId: id,
                                credit: decimalAmount.toNumber(), // Store as a number
                                paymentType: 'CREDIT',
                                transactionType: 'ADMIN',
                                transactionStatus: true,
                                desc: "Adding Credit By Admin",
                            },
                        });
                        return { success: true, message: `Amount ${amount} has been credited` };

                    default:
                        throw new Error("No type matched");
                }
            });

            // Return transaction success response
            return transaction;

        } catch (error) {
            // Handle transaction errors (rollback is automatic)
            console.error("Transaction Error:", error.message);
            return { success: false, message: error.message };
        }
    }
    static async getCoins(id) {
        try {
            const result = await prisma.payment.aggregate({
                where: {
                    userId: id,
                },
                _sum: {
                    coins: true,
                },
            });

            // Check if any coins were found
            const totalCoins = result._sum.coins || 0; // Default to 0 if no coins were found

            return respBinder(true, "Coins in account", totalCoins);
        } catch (error) {
            console.error("Error fetching coins:", error); // Log the error for debugging
            return respBinder(false, "Server error while fetching coins", null); // Handle errors gracefully
        }
    }

}

module.exports = User;
