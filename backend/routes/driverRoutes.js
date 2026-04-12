const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

const { addDriver, getMyDrivers } = require('../controllers/driverController'); 
const upload = require('../middlewares/uploadMiddleware');

// GET Route: Fetch logged-in vendor's drivers
router.get('/', protect, getMyDrivers);

// Middleware for File Uploads
const documentUploads = upload.fields([
    { name: 'drivingLicense', maxCount: 1 },
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'permitAndPollution', maxCount: 1 }
]);

// POST Route: Auth -> Upload Files -> Controller Logic
router.post('/', protect, authorize('SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'), documentUploads, addDriver);

module.exports = router;