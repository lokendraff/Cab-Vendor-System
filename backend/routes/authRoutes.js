const express = require('express');
const router = express.Router();
const {
    registerVendor,
    verifyEmailOTP,
    loginVendor,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');

router.post('/register', registerVendor);
router.post('/verify-otp', verifyEmailOTP);
router.post('/login', loginVendor);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;