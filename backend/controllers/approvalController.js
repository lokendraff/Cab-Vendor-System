const Cab = require('../models/Cab');
const Driver = require('../models/Driver');
const { getDescendantVendorIds } = require('../utils/hierarchy');

// @desc    Get all pending Cab and Driver documents from sub-hierarchy
// @route   GET /api/approvals/pending
// @access  Private (Admin, SuperVendor)
const getPendingApprovals = async (req, res, next) => {
    try {
        let vendorFilter = {};

        // Admins see all pending approvals. SuperVendors see only their downward tree.
        if (req.user.role !== 'Admin') {
            const allChildIds = await getDescendantVendorIds(req.user.id);
            vendorFilter = { vendorId: { $in: allChildIds } };
        }

        const [pendingCabs, pendingDrivers] = await Promise.all([
            Cab.find({ ...vendorFilter, approvalStatus: 'pending' })
                .populate('vendorId', 'name role email')
                .lean(),
            Driver.find({ ...vendorFilter, approvalStatus: 'pending' })
                .populate('vendorId', 'name role email')
                .lean()
        ]);

        res.status(200).json({
            success: true,
            data: {
                cabs: pendingCabs,
                drivers: pendingDrivers,
                totalPending: pendingCabs.length + pendingDrivers.length
            }
        });
    } catch (error) {
        console.error("🚨 Get Pending Approvals Error:", error);
        res.status(500).json({ success: false, message: "Server Error processing pending approvals" });
    }
};

// @desc    Approve or reject a specific Cab or Driver
// @route   PUT /api/approvals/:entityType/:id
// @access  Private (Admin, SuperVendor)
const processApproval = async (req, res, next) => {
    try {
        const { entityType, id } = req.params; // 'cab' or 'driver'
        const { status, remarks } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Must be 'approved' or 'rejected'." });
        }

        let Model;
        if (entityType === 'cab') Model = Cab;
        else if (entityType === 'driver') Model = Driver;
        else return res.status(400).json({ success: false, message: "Invalid entity type in URL. Use 'cab' or 'driver'." });

        // Build base query to find the specific entity
        const query = { _id: id };

        // Enforce hierarchy cross-tenant boundary if not Admin
        if (req.user.role !== 'Admin') {
            const allChildIds = await getDescendantVendorIds(req.user.id);
            query.vendorId = { $in: allChildIds };
        }

        const document = await Model.findOneAndUpdate(
            query,
            { approvalStatus: status, approvalRemarks: remarks || null },
            { new: true } // Return the freshly updated document
        );

        if (!document) {
            return res.status(404).json({ success: false, message: `${entityType} not found, or it belongs to a vendor outside your hierarchy.` });
        }

        res.status(200).json({
            success: true,
            message: `${entityType} successfully marked as ${status}`,
            data: document
        });

    } catch (error) {
        console.error("🚨 Process Approval Error:", error);
        res.status(500).json({ success: false, message: "Server Error processing approval action" });
    }
};

module.exports = { getPendingApprovals, processApproval };
