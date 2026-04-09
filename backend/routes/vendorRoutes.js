const express = require('express');
const router = express.Router();
const { registerVendor, loginVendor, delegateAccess } = require('../controllers/vendorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerVendor);
router.post('/login', loginVendor);

router.put('/delegate/:id', protect, authorize('SuperVendor'), delegateAccess);

module.exports = router;