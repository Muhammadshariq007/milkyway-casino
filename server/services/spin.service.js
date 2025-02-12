const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


class Spinner {
    constructor() {
        this.weightedOptions = [
            ...Array(14).fill('1'),
            ...Array(14).fill('2'),
            ...Array(2).fill('3'),

        ];
    }

    generateClientSeed() {
        return crypto.randomBytes(16).toString('hex');
    }

    sha256(message) {
        return crypto.createHash('sha256').update(message).digest('hex');
    }

    getRandomOption(serverSeed, clientSeed) {
        const combinedSeed = serverSeed + clientSeed;
        const hashedSeed = this.sha256(combinedSeed);
        const hashedServerSeed = this.sha256(serverSeed);
        const randomIndex = parseInt(hashedSeed.substring(0, 8), 16) % this.weightedOptions.length;
        const spinNumber = this.weightedOptions[randomIndex]
        return { combinedSeed, hashedSeed, spinNumber, hashedServerSeed };
    }

    calculateReward(coins, spinNumber) {
        let _coins = coins
        if (spinNumber === 3) {
            _coins = coins * 14
        }
        else {
            _coins = coins * 2
        }
        return _coins
    }
    async processSpin() {
        const clientSeed = this.generateClientSeed();
        const serverSeed = this.generateClientSeed();
        const { combinedSeed, hashedSeed, spinNumber, hashedServerSeed } = this.getRandomOption(serverSeed, clientSeed);

        // Start a transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Create a log entry
            const logs = await prisma.logs.create({
                data: {
                    timestamp: new Date(),
                    serverSeed,
                    clientSeed,
                    combinedSeed,
                    hashedSeed,
                    hashedServerSeed,
                    logsOf: 'SPIN',
                    results: spinNumber
                }
            });

            // Fetch user bets for the created log entry
            const updateBets = await prisma.userBet.findMany({
                where: {
                    betFor: logs.id,
                    lastLogId: logs.id - 1,
                    betOption: Number(spinNumber),
                }
            });
            // Filter and create payment entries for matching bets
            const paymentPromises = updateBets.map(async (element) => {
                // Create payment entry
                const payment = await prisma.payment.create({
                    data: {
                        userId: element.userId,
                        betOption: element.betOption,
                        betNumber: element.betFor,
                        coins: this.calculateReward(element.coins, spinNumber),
                        transactionStatus: true,
                        paymentType: 'COINS',
                        transactionType: 'USER',
                        desc: 'System Calculated Profit and Loss',
                    },
                });

                // Update the userBet's transaction status
                await prisma.userBet.update({
                    where: {
                        id: element.id, // Assuming you have an ID to uniquely identify the bet
                        betFor: logs.id,
                        lastLogId: logs.id - 1,
                        betOption: Number(spinNumber),
                    },
                    data: {
                        transactionStatus: true, // Update the transaction status to true
                    },
                });
                const toUpdate = await prisma.payment.findFirst({
                    where: {
                        userId: element.userId,
                        betOption: element.betOption,
                        betNumber: element.betFor,
                        transactionStatus: true,
                    },
                })
                await prisma.payment.update({
                    where: {
                        id: toUpdate.id
                    },
                    data: {
                        transactionStatus: true
                    }
                })

                return payment; // Return the created payment for further processing if needed
            });
            // Await all payment creations, if any
            const bulkResult = await Promise.all(paymentPromises);
            // Return the logs for further use if needed
            return {
                spinNumber,
                logs,
            };
        });

        return result;
    }


}

module.exports = Spinner;
