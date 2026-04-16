const express = require('express');
const router = express.Router();
const { getSystemMetrics, getAllSuperVendors, toggleVendorStatus, getAuditLogs, getAllGlobalVendors, approveVendorDocument } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Define routes protected strictly by Admin role
router.get('/metrics', protect, authorize('Admin'), getSystemMetrics);
router.get('/super-vendors', protect, authorize('Admin'), getAllSuperVendors);
router.put('/toggle-vendor/:id', protect, authorize('Admin'), toggleVendorStatus);
router.get('/audit-logs', protect, authorize('Admin'), getAuditLogs);
router.get('/vendors', protect, authorize('Admin'), getAllGlobalVendors);
router.put('/approve-vendor/:id', protect, authorize('Admin'), approveVendorDocument);

module.exports = router;