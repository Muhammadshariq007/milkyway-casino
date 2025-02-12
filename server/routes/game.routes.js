const express = require('express');
const router = express.Router();
const gameController = require('../controllers/games/game.controller');

const authenticateToken = require('../middleware/authMiddleware');
router.get('/get-last-spins/:noOfRecords', gameController.getSpinningRecords);
router.post('/place-bet', authenticateToken, gameController.placeBet)
module.exports = router;
