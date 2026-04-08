const Cab = require('../models/Cab');

// @desc    Onboard a new Cab
// @route   POST /api/cabs
// @access  Private (Only logged in and Authorized Vendors)
const addCab = async (req, res, next) => {
    try {
        const { registrationNumber, model, seatingCapacity, fuelType } = req.body;

        // Check if cab already exists
        const cabExists = await Cab.findOne({ registrationNumber });
        if (cabExists) {
            res.status(400);
            throw new Error('Cab with this registration number already exists');
        }

        // Create cab: 'req.vendor'
        const cab = await Cab.create({
            registrationNumber,
            model,
            seatingCapacity,
            fuelType,
            vendorId: req.vendor._id 
        });

        res.status(201).json({
            success: true,
            message: 'Cab successfully onboarded',
            data: cab
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all Cabs of a logged-in Vendor
// @route   GET /api/cabs
// @access  Private
const getMyCabs = async (req, res, next) => {
    try {
        // Sirf wahi cabs lao jinka vendorId is logged-in vendor se match karta ho
        const cabs = await Cab.find({ vendorId: req.vendor._id });
        
        res.status(200).json({
            success: true,
            count: cabs.length,
            data: cabs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { addCab, getMyCabs };