const express = require('express');
const router = express.Router();
const { getSuperVendorDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET /api/dashboard/super-vendor
// Apply protect (must be logged in) and authorize (strictly for SuperVendor role)
router.get(
    '/super-vendor', 
    protect, 
    authorize('SuperVendor'), 
    getSuperVendorDashboard
);

module.exports = router;