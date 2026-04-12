const Vendor = require('../models/Vendor');
const AuditLog = require('../models/AuditLog');
const { createNotification } = require('../services/notification.service');

const toggleVendorStatus = async (req, res) => {
    try {
        const { targetVendorId, status, reason } = req.body; // status: true (unblock) or false (block)

        // 1. Check if logged-in user is a SuperVendor
        if (req.user.role !== 'SuperVendor') {
            return res.status(403).json({ success: false, message: "Access Denied: Only Super Vendors can do this." });
        }

        // 2. find vendor by ID and update his status (isActive field)
        const vendor = await Vendor.findByIdAndUpdate(
            targetVendorId, 
            { isActive: status }, 
            { returnDocument: 'after' }
        );

        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        // 3.create an audit log for this action
        const action = status ? 'UNBLOCK_VENDOR' : 'BLOCK_VENDOR';
        const log = new AuditLog({
            actionType: action,
            performedBy: req.user.id,
            targetEntityId: targetVendorId,
            targetEntityType: 'Vendor',
            reason: reason || "Administrative Action"
        });
        await log.save();

        // 4. send notification to the affected vendor about the status change
        const alertMessage = status 
            ? "Your account has been UNBLOCKED by the Super Vendor." 
            : `Your account has been BLOCKED. Reason: ${reason}`;
        
        await createNotification(targetVendorId, "Account Status Updated", alertMessage, 'SYSTEM');

        res.status(200).json({ 
            success: true, 
            message: `Vendor successfully ${status ? 'Unblocked' : 'Blocked'}`,
            auditLogId: log._id
        });

    } catch (error) {
        console.error("🚨 Admin Action Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { toggleVendorStatus };