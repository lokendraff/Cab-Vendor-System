const Vendor = require('../models/Vendor');
const Cab = require('../models/Cab');
const Driver = require('../models/Driver');

// @desc    Get centralized dashboard metrics for Super Vendor
// @route   GET /api/dashboard/super-vendor
// @access  Private (Only SuperVendor)
const getSuperVendorDashboard = async (req, res, next) => {
    try {
        const vendorId = req.vendor._id;

        // Using Promise.all to execute multiple database queries concurrently for better performance
        const [
            subVendors,
            totalCabs,
            activeCabs,
            pendingDocuments
        ] = await Promise.all([
            // 1. Fetch all immediate sub-vendors
            Vendor.find({ parentVendor: vendorId }).select('-password'),
            
            // 2. Count total fleet under this vendor
            Cab.countDocuments({ vendorId: vendorId }),
            
            // 3. Count only active fleet
            Cab.countDocuments({ vendorId: vendorId, isActive: true }),
            
            // 4. Find drivers with any unverified documents
            Driver.find({
                vendorId: vendorId,
                $or: [
                    { 'documents.drivingLicense.isVerified': false },
                    { 'documents.registrationCertificate.isVerified': false },
                    { 'documents.permitAndPollution.isVerified': false }
                ]
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                vendorHierarchy: {
                    totalSubVendors: subVendors.length,
                    subVendorsList: subVendors
                },
                fleetStatus: {
                    totalVehicles: totalCabs,
                    activeVehicles: activeCabs,
                    inactiveVehicles: totalCabs - activeCabs
                },
                compliance: {
                    pendingVerificationCount: pendingDocuments.length,
                    driversPendingVerification: pendingDocuments
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getSuperVendorDashboard };