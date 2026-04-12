const Driver = require('../models/Driver');

// @desc    Onboard a new Driver with Documents
// @route   POST /api/drivers
// @access  Private (Logged in Vendors)
const addDriver = async (req, res, next) => {
    try {
        const { name, contactNumber, dlExpiry, rcExpiry, permitExpiry } = req.body;

        
        const driverExists = await Driver.findOne({ contactNumber });
        if (driverExists) {
            res.status(400);
            throw new Error('Driver with this contact number already exists');
        }

        
        if (!req.files || !req.files.drivingLicense || !req.files.registrationCertificate || !req.files.permitAndPollution) {
            res.status(400);
            throw new Error('Please upload all required documents: DL, RC, and Permit');
        }

        const driver = await Driver.create({
            name,
            contactNumber,
            vendorId: req.vendor._id, 
            documents: {
                drivingLicense: {
                    documentUrl: req.files.drivingLicense[0].path, 
                    expiryDate: dlExpiry
                },
                registrationCertificate: {
                    documentUrl: req.files.registrationCertificate[0].path,
                    expiryDate: rcExpiry
                },
                permitAndPollution: {
                    documentUrl: req.files.permitAndPollution[0].path, 
                    expiryDate: permitExpiry
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Driver successfully onboarded and documents uploaded!',
            data: driver
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged-in vendor's drivers
// @route   GET /api/drivers
// @access  Private
const getMyDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: drivers.length, data: drivers });
    } catch (error) {
        console.error("🚨 Fetch Drivers Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


module.exports = { addDriver, getMyDrivers };