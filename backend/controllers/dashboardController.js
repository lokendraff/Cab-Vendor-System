const Vendor = require('../models/Vendor');
const Cab = require('../models/Cab');
const Driver = require('../models/Driver');
const { getDescendantVendorIds } = require('../utils/hierarchy');

// @desc    Get centralized dashboard metrics for Super Vendor
// @route   GET /api/dashboard/super-vendor
// @access  Private (Only SuperVendor)
const getSuperVendorDashboard = async (req, res, next) => {
    try {
        const vendorId = req.vendor._id;

        // 1. Get the complete array of ALL sub-vendor IDs in this tree (Recursive Array)
        const allChildIds = await getDescendantVendorIds(vendorId);

        // Using Promise.all to execute multiple database queries concurrently for better performance
        const [
            subVendors,
            totalCabs,
            activeCabs,
            pendingDocuments
        ] = await Promise.all([
            // 2. Fetch all immediate sub-vendors 
            Vendor.find({ $or: [{ parentId: vendorId }, { parentVendor: vendorId }] }).select('-password').lean(),
            
            // 3. Count total fleet under this ENTIRE branch
            Cab.countDocuments({ vendorId: { $in: allChildIds } }),
            
            // 4. Count only active fleet deeply
            Cab.countDocuments({ vendorId: { $in: allChildIds }, isActive: true }),
            
            // 5. Count non-compliant drivers deeply
            Driver.find({
                vendorId: { $in: allChildIds },
                $or: [
                    { 'documents.drivingLicense.isVerified': false },
                    { 'documents.registrationCertificate.isVerified': false },
                    { 'documents.permitAndPollution.isVerified': false }
                ]
            }).lean()
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