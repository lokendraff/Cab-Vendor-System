const express = require('express');
const router = express.Router();
const { uploadDriverDocument } = require('../controllers/document.controller');
const upload = require('../middlewares/uploadMiddleware'); 
const Document = require('../models/Document');


// POST /api/documents/upload
router.post('/upload', upload.single('file'), uploadDriverDocument);

module.exports = router;