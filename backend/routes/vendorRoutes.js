const express = require('express');
const router = express.Router();
const { delegateAccess } = require('../controllers/vendorController');
const { protect } = require('../middlewares/authMiddleware'); 


// PUT /api/vendors/delegate/:id
router.put('/delegate/:id', protect, delegateAccess);

module.exports = router;