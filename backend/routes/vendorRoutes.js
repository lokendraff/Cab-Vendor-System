const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    delegateAccess,
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// GET /api/vendors/me
router.get('/me', protect, getMyProfile);
// PATCH /api/vendors/me
router.patch('/me', protect, updateMyProfile);
// PUT /api/vendors/me/password
router.put('/me/password', protect, changeMyPassword);

// PUT /api/vendors/delegate/:id
router.put('/delegate/:id', protect, authorize('SuperVendor', 'Admin'), delegateAccess);

module.exports = router;