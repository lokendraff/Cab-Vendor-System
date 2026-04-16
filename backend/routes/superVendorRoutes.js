const express = require('express');
const router = express.Router();
const { getDescendantsMissingDocs, sendDocumentReminder } = require('../controllers/superVendorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/descendants-missing-docs', protect, authorize('SuperVendor'), getDescendantsMissingDocs);
router.post('/send-document-reminder', protect, authorize('SuperVendor'), sendDocumentReminder);

module.exports = router;
