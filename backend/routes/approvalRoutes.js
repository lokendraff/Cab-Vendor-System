const express = require('express');
const router = express.Router();
const { getPendingApprovals, processApproval } = require('../controllers/approvalController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Define routes protected by strict Admin and SuperVendor RBAC roles
router.get('/pending', protect, authorize('Admin', 'SuperVendor'), getPendingApprovals);

// entityType acts as a dynamic path parameter supporting either 'cab' or 'driver'
router.put('/:entityType/:id', protect, authorize('Admin', 'SuperVendor'), processApproval);

module.exports = router;
