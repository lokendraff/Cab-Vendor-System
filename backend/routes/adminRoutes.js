const express = require('express');
const router = express.Router();
const { toggleVendorStatus, getAuditLogs, getAllVendors } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // import authorize


// POST /api/admin/toggle-vendor
router.post('/toggle-vendor', protect, authorize('SuperVendor'), toggleVendorStatus);

// GET /api/admin/audit-logs
router.get('/audit-logs', protect, authorize('SuperVendor'), getAuditLogs);

// GET /api/admin/vendors
router.get('/vendors', protect, authorize('SuperVendor'), getAllVendors);

module.exports = router;