const express = require('express');
const router = express.Router();
const { addCab, getMyCabs } = require('../controllers/cabController');

// import middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route par middleware lagana: 
// 1. protect -> Check if token is valid or not (Logged in or not)
// 2. authorize -> check if the logged-in vendor has the right role to access this route or not
router.post('/', protect, authorize('SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'), addCab);
router.get('/', protect, getMyCabs);

module.exports = router;