const express = require('express');
const router = express.Router();
const { addDriver } = require('../controllers/driverController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const upload = require('../middlewares/uploadMiddleware');

const documentUploads = upload.fields([
    { name: 'drivingLicense', maxCount: 1 },
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'permitAndPollution', maxCount: 1 }
]);

// Route: Auth -> Upload Files -> Controller Logic
router.post('/', protect, authorize('SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'), documentUploads, addDriver);

module.exports = router;