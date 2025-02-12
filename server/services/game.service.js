const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { respBinder } = require('../utils/utils');
const { generateFakeUsers } = require('../utils/fakeUsers');
const { fakeNames } = require('../utils/fakeNameList');

class Games {
    static async getLastSpins(noOfRecords) {
        try {
            const lastRecord = await prisma.logs.findMany({
                where: {
                    logsOf: 'SPIN'
                },
                select: {
                    results: true,
                },
                orderBy: {
                    timestamp: 'desc',  // Sort by the timestamp in descending order
                },
                take: noOfRecords  // Limit to the last 5 results
            });

            return respBinder(true, "5 last spin winnings", { lastRecord });
        } catch (error) {
            console.error("Error fetching getLastSpins:", error); // Correctly log the error
            return respBinder(false, "Server error", null);
        }
    }
    static async placeBet(betOption, coins, userId, type) {
        const balance = await prisma.payment.aggregate({
            where: {
                userId: userId
            },
            _sum: {
                coins
            }
        })
        if (balance._sum.coins < coins) {
            return respBinder(false, "Your amount is greater then your bet please buy coins")
        }
        const lastLog = await prisma.logs.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (lastLog) {

            await prisma.userBet.create({
                data: {
                    userId,
                    type,
                    betOption,
                    coins,
                    transactionStatus: false,
                    lastLogId: lastLog.id,
                    betFor: lastLog.id + 1
                }
            })
            await prisma.payment.create({
                data: {
                    userId,
                    betOption,
                    betNumber: lastLog.id + 1,
                    coins: -(coins),
                    transactionStatus: false,
                    paymentType: 'COINS',
                    transactionType: 'USER',
                    desc: "User placed bet"
                }
            })
            return respBinder(true, "Successfully bet placed", null);
        }
        else {
            respBinder(false, "Please wait to Bet", null)
        }
    }
    static async latestBets(type, remainingTime) {
        try {
            let option1 = []
            // let option2 = []
            // let option3 = []
            const fakeUserCount = 10;

            const fakeNamesPool = [...fakeNames];

            const lastLog = await prisma.logs.findFirst({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            const nextLogs = await prisma.userBet.findFirst({
                where: {
                    betFor: lastLog.id + 1
                }
            })
            if (nextLogs) {
                option1 = await prisma.userBet.findMany({
                    where: {
                        type: type,
                        transactionStatus: false,
                        betOption: 1,
                        betFor: lastLog.id + 1
                    },
                    select: {
                        user: {
                            select: {
                                fullName: true,  // Correct way to select nested fields from the user relation
                            }
                        },
                        coins: true,
                    }
                });

                // option2 = await prisma.userBet.findMany({
                //     where: {
                //         type: type,
                //         transactionStatus: false,
                //         betOption: 2,
                //         betFor: lastLog.id + 1
                //     },
                //     select: {
                //         user: {
                //             select: {
                //                 fullName: true,  // Correct way to select nested fields from the user relation
                //             }
                //         },
                //         coins: true,
                //     }
                // });
                // option3 = await prisma.userBet.findMany({
                //     where: {
                //         type: type,
                //         transactionStatus: false,
                //         betOption: 3,
                //         betFor: lastLog.id + 1
                //     },
                //     select: {
                //         user: {
                //             select: {
                //                 fullName: true,  // Correct way to select nested fields from the user relation
                //             }
                //         },
                //         coins: true,
                //     }
                // });
            }
            // Add fake users to each option using the shuffled name groups
            if (Number(remainingTime) > 3) {
                option1 = [...option1, ...generateFakeUsers(fakeUserCount, fakeNamesPool)];
                // option2 = [...option2, ...generateFakeUsers(fakeUserCount, fakeNamesPool)];
                // option3 = [...option3, ...generateFakeUsers(fakeUserCount, fakeNamesPool)];
            }

            if (Number(remainingTime) <= 3) {
                option1 = []
                // option2 = []
                // option3 = []
            }

            const result = {
                option1,
                // option2,
                // option3
            }

            return respBinder(true, "Bets fetched successfully", result);  // Return the fetched bets

        } catch (error) {
            console.error("Error fetching latestBets:", error);  // Log the error correctly
            return respBinder(false, "Server error", null);  // Return error response
        }
    }

}

module.exports = Games;
