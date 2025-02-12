const FlipCoin = require('../services/flip.service');
const Games = require('../services/game.service');
const Spinner = require('../services/spin.service');
const WebSocketServerSingleton = require('../websocket/ws');
var cron = require('node-cron');

class SpinnerJob {
    constructor() {
        this.spinner = new Spinner();
        this.flipCoin = new FlipCoin()

        this.cronJob = null; // To hold the cron job reference
        this.cronJob1 = null;

        this.remainingTime = 15; // Countdown timer (in seconds)
        this.remainingTime1 = 15;

        this.startCronJob();
        this.startAnotherCronJob();
    }

    startCronJob() {
        this.cronJob = cron.schedule("*/15 * * * * *", () => {
            this.runSpin();
        });

        // Start sending countdown updates
        this.startCountdown();
    }
    startAnotherCronJob() {
        this.cronJob1 = cron.schedule("*/15 * * * * *", () => {
            this.runFlip();
        });

        // Start sending countdown updates
        this.startCountdownFlip();
    }
    async runFlip() {
        const spinResult = await this.flipCoin.processFlip();
        const payload = {
            type: "flip",
            data: spinResult
        };

        // Send the spin result to clients
        WebSocketServerSingleton.sendMessage(payload);

        // Reset remaining time after the spin
        this.remainingTime1 = 15; // Reset to 120 seconds
    }

    async runSpin() {
        const spinResult = await this.spinner.processSpin();
        const payload = {
            type: "spin",
            data: spinResult
        };

        // Send the spin result to clients
        WebSocketServerSingleton.sendMessage(payload);

        // Reset remaining time after the spin
        this.remainingTime = 15; // Reset to 120 seconds
    }

    startCountdown() {
        setInterval(async () => {
            if (this.remainingTime >= 0) {
                const currentBets = await Games.latestBets("SPIN", this.remainingTime);
                if (currentBets.success) {
                    const payload = {
                        type: "spinBets",
                        data: currentBets?.data
                    }
                    WebSocketServerSingleton.sendMessage(payload)
                }
                const countdownPayload = {
                    type: "countdown",
                    timeLeft: this.remainingTime
                };


                // Send the countdown to connected clients
                WebSocketServerSingleton.sendMessage(countdownPayload);
                this.remainingTime--; // Decrease the remaining time
            }
        }, 1000); // Update every second
    }
    startCountdownFlip() {
        setInterval(async () => {
            if (this.remainingTime1 >= 0) {
                const currentBets = await Games.latestBets("FLIP", this.remainingTime);
                if (currentBets.success) {
                    const payload = {
                        type: "flipBets",
                        data: currentBets?.data
                    }
                    WebSocketServerSingleton.sendMessage(payload)
                }
                const countdownPayload = {
                    type: "flipCountdown",
                    timeLeft: this.remainingTime1
                };


                // Send the countdown to connected clients
                WebSocketServerSingleton.sendMessage(countdownPayload);
                this.remainingTime1--; // Decrease the remaining time
            }
        }, 1000); // Update every second
    }
}

module.exports = SpinnerJob;
