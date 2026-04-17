const Driver = require('../models/Driver');

const addDriver = async (req, res) => {
    try {
        const { name, contactNumber, dlExpiry, rcExpiry, permitExpiry } = req.body;

        // Enforce delegation rights for sub-vendors
        if (req.vendor.role !== 'SuperVendor' && !req.vendor.delegatedRights?.canOnboardDriver) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to onboard drivers. Contact your Super Vendor.' 
            });
        }

        const driverExists = await Driver.findOne({ contactNumber });
        if (driverExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Driver with this contact number already exists' 
            });
        }

        if (!req.files || !req.files.drivingLicense || !req.files.registrationCertificate || !req.files.permitAndPollution) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please upload all required documents: DL, RC, and Permit' 
            });
        }

        const driver = new Driver({
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

        try {
            await driver.save();
        } catch (saveError) {
            if (saveError.message && saveError.message.includes('Plan Limit')) {
                return res.status(400).json({
                    success: false,
                    message: "Plan Limit Reached! Upgrade to Professional to add more drivers."
                });
            }
            throw saveError;
        }

        return res.status(201).json({
            success: true,
            message: 'Driver successfully onboarded and documents uploaded!',
            data: driver
        });
    } catch (error) {
        console.error("🚨 Add Driver Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "An unexpected server error occurred while onboarding the driver."
        });
    }
};

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