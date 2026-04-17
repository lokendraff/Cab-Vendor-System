const Cab = require('../models/Cab');
const Driver = require('../models/Driver');
const { getDescendantVendorIds } = require('../utils/hierarchy');
const { createNotification } = require('../services/notification.service');

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

        // Enforce hierarchy boundary if not Admin
        if (req.user.role !== 'Admin') {
            const allChildIds = await getDescendantVendorIds(req.user.id);
            query.vendorId = { $in: allChildIds };
        }

        // --- FIX: Prepare update payload ---
        let updatePayload = { 
            approvalStatus: status, 
            approvalRemarks: remarks || null 
        };

        // If driver is approved, mark all documents as verified
        if (status === 'approved' && entityType === 'driver') {
            updatePayload['documents.drivingLicense.isVerified'] = true;
            updatePayload['documents.registrationCertificate.isVerified'] = true;
            updatePayload['documents.permitAndPollution.isVerified'] = true;
        }

        const document = await Model.findOneAndUpdate(
            query,
            { $set: updatePayload }, // $set is required for nested updates
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ success: false, message: `${entityType} not found, or it belongs to a vendor outside your hierarchy.` });
        }

        // --- Notification Logic ---
        // Notify the sub-vendor about status change
        const vendorIdToNotify = document.vendorId;
        const documentName = entityType === 'cab' 
            ? (document.registrationNumber || 'Cab') 
            : (document.name || 'Driver');

        const notifTitle = status === 'approved' 
            ? `Document Approved: ${documentName}` 
            : `Document Rejected: ${documentName}`;
            
        let notifMessage = `Your ${entityType} submission for ${documentName} has been ${status}.`;
        if (status === 'rejected' && remarks) {
            notifMessage += ` Reason: ${remarks}`;
        }

        await createNotification(
            vendorIdToNotify,
            notifTitle,
            notifMessage,
            status === 'approved' ? 'DOCUMENT' : 'ALERT'
        );

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