const express = require('express');
const router = express.Router();
const { registerVendor, loginVendor, delegateAccess, getSubVendors, getMe } = require('../controllers/vendorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerVendor);
router.post('/login', loginVendor);

router.get('/me', protect, getMe);
router.get('/sub-vendors', protect, getSubVendors);
router.put('/delegate/:id', protect, authorize('SuperVendor'), delegateAccess);

module.exports = router;