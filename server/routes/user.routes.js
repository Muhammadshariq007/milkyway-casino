const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/auth.controller');
const userController = require('../controllers/user/user.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/login', authController.loginUser);
router.post('/signup', authController.signupUser);
router.get('/profile/:id', authenticateToken, userController.getProfile)
router.put('/change-password', authenticateToken, userController.changePassword)
router.get('/payment-info/:id', authenticateToken, userController.paymentInfo)
router.get('/get-all-users', authenticateToken, userController.getAllUsers)
router.put('/update-role/:id', authenticateToken, userController.updateRole)
router.put('/update-status/:id', authenticateToken, userController.updateStatus)
router.post('/add-payment', authenticateToken, userController.handleAddPayment);
router.get('/user-coins', authenticateToken, userController.getCoinsBalance)




module.exports = router;


