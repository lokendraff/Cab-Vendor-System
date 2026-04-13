const Cab = require('../models/Cab');

// @desc    Onboard a new Cab
// @route   POST /api/cabs
// @access  Private (Only logged in and Authorized Vendors)
const addCab = async (req, res, next) => {
    try {
        const { registrationNumber, model, seatingCapacity, fuelType } = req.body;

        // Enforce delegation rights for sub-vendors
        if (req.vendor.role !== 'SuperVendor' && !req.vendor.delegatedRights?.canOnboardCab) {
            res.status(403);
            throw new Error('You do not have permission to onboard cabs. Contact your Super Vendor.');
        }

        // Check if cab already exists
        const cabExists = await Cab.findOne({ registrationNumber });
        if (cabExists) {
            res.status(400);
            throw new Error('Cab with this registration number already exists');
        }

        // Create cab linked to the authenticated vendor
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
        // Fetch only cabs owned by the logged-in vendor
        const cabs = await Cab.find({ vendorId: req.vendor._id }).populate('driverId', 'name contactNumber');
        
        res.status(200).json({
            success: true,
            count: cabs.length,
            data: cabs
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Assign a Driver to a Cab
// @route   PUT /api/cabs/:id/assign-driver
// @access  Private
const assignDriverToCab = async (req, res, next) => {
    try {
        const { driverId } = req.body;
        const cabId = req.params.id;

        if (!driverId) {
            res.status(400);
            throw new Error('Driver ID is required');
        }

        // Ensure the cab belongs to this vendor
        const cab = await Cab.findOne({ _id: cabId, vendorId: req.vendor._id });
        if (!cab) {
            res.status(404);
            throw new Error('Cab not found or does not belong to you');
        }

        // Verify driver exists and belongs to the same vendor
        const Driver = require('../models/Driver');
        const driver = await Driver.findOne({ _id: driverId, vendorId: req.vendor._id });
        if (!driver) {
            res.status(404);
            throw new Error('Driver not found or does not belong to you');
        }

        cab.driverId = driverId;
        await cab.save();

        res.status(200).json({
            success: true,
            message: 'Driver assigned to cab successfully',
            data: cab
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { addCab, getMyCabs, assignDriverToCab };