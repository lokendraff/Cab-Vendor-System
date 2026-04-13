const express = require('express');
const router = express.Router();
const { uploadDriverDocument, getMyDocuments } = require('../controllers/document.controller');
const upload = require('../middlewares/uploadMiddleware'); 
const { protect } = require('../middlewares/authMiddleware');

// GET /api/documents - Fetch vendor's driver documents
router.get('/', protect, getMyDocuments);

// POST /api/documents/upload
router.post('/upload', protect, upload.single('file'), uploadDriverDocument);

module.exports = router;