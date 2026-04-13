const express = require('express');
const router = express.Router();
const { addCab, getMyCabs, assignDriverToCab } = require('../controllers/cabController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// POST /api/cabs — Onboard a new cab (all vendor roles, delegation enforced in controller)
router.post('/', protect, authorize('SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'), addCab);

// GET /api/cabs — Get logged-in vendor's cabs
router.get('/', protect, getMyCabs);

// PUT /api/cabs/:id/assign-driver — Assign a driver to a cab
router.put('/:id/assign-driver', protect, assignDriverToCab);

module.exports = router;