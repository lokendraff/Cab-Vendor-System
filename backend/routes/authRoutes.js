const express = require('express');
const router = express.Router();
const { registerVendor, verifyEmailOTP, loginVendor } = require('../controllers/authController');

router.post('/register', registerVendor);
router.post('/verify-otp', verifyEmailOTP);
router.post('/login', loginVendor);

module.exports = router;