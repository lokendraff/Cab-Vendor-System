const express = require('express');
const router = express.Router();
const { toggleVendorStatus } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware'); 

// POST /api/admin/toggle-vendor
router.post('/toggle-vendor', protect, toggleVendorStatus);

module.exports = router;