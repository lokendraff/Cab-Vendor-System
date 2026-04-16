const Vendor = require('../models/Vendor');
const Cab = require('../models/Cab');
const Driver = require('../models/Driver');
const AuditLog = require('../models/AuditLog');
const { createNotification } = require('../services/notification.service');

// @desc    Get global system metrics
// @route   GET /api/admin/metrics
// @access  Private (Admin only)
const getSystemMetrics = async (req, res, next) => {
    try {
        const [
            rolesBreakdown,
            totalGlobalCabs,
            totalGlobalDrivers
        ] = await Promise.all([
            // Use MongoDB Aggregation to group by role and count
            Vendor.aggregate([
                { $group: { _id: "$role", count: { $sum: 1 } } }
            ]),
            Cab.countDocuments(),
            Driver.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: {
                rolesBreakdown,
                totalGlobalCabs,
                totalGlobalDrivers
            }
        });
    } catch (error) {
        console.error("🚨 Get System Metrics Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching global metrics" });
    }
};

// @desc    Get all top-level SuperVendors
// @route   GET /api/admin/super-vendors
// @access  Private (Admin only)
const getAllSuperVendors = async (req, res, next) => {
    try {
        const superVendors = await Vendor.find({ role: 'SuperVendor' })
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: superVendors.length,
            data: superVendors
        });
    } catch (error) {
        console.error("🚨 Fetch SuperVendors Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching Super Vendors" });
    }
};

// @desc    Block or Unblock ANY vendor account in the system
// @route   PUT /api/admin/toggle-vendor/:id
// @access  Private (Admin only)
const toggleVendorStatus = async (req, res, next) => {
    try {
        const targetVendorId = req.params.id;
        const { status, reason } = req.body; // status: true/false (active/inactive)

        const vendor = await Vendor.findByIdAndUpdate(
            targetVendorId,
            { isActive: status },
            { new: true, returnDocument: 'after' }
        );

        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found in system" });
        }

        // Create an audit log for this global admin action
        const action = status ? 'UNBLOCK_VENDOR' : 'BLOCK_VENDOR';
        const log = new AuditLog({
            actionType: action,
            performedBy: req.user.id,
            targetEntityId: targetVendorId,
            targetEntityType: 'Vendor',
            reason: reason || "Super Admin Global Action"
        });
        await log.save();

        const alertMessage = status 
            ? "Your account has been UNBLOCKED by a System Administrator." 
            : `Your account has been BLOCKED globally. Reason: ${reason}`;
        
        await createNotification(targetVendorId, "Global Status Updated", alertMessage, 'SYSTEM');

        res.status(200).json({
            success: true,
            message: `Vendor globally ${status ? 'Unblocked' : 'Blocked'}`,
            data: vendor,
            auditLogId: log._id
        });
    } catch (error) {
        console.error("🚨 Toggle Vendor Error:", error);
        res.status(500).json({ success: false, message: "Server Error toggling vendor status" });
    }
};

// @desc    Get all audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find()
            .sort({ createdAt: -1 })
            .populate('performedBy', 'name email role')
            .lean();
            
        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        console.error("🚨 Fetch Audit Logs Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching audit logs" });
    }
};

// @desc    Get all global vendors in the entire system
// @route   GET /api/admin/vendors
// @access  Private (Admin only)
const getAllGlobalVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
            
        res.status(200).json({ success: true, count: vendors.length, data: vendors });
    } catch (error) {
        console.error("🚨 Fetch All Vendors Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching all vendors" });
    }
};

// @desc    Approve vendor documents
// @route   PUT /api/admin/approve-vendor/:id
// @access  Private (Admin only)
const approveVendorDocument = async (req, res, next) => {
    try {
        const vendorId = req.params.id;
        
        const vendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { approvalStatus: 'approved' },
            { new: true, returnDocument: 'after' }
        );

        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found in system" });
        }

        // Create an audit log for this global admin action
        const log = new AuditLog({
            actionType: 'APPROVE_VENDOR',
            performedBy: req.user.id,
            targetEntityId: vendorId,
            targetEntityType: 'Vendor',
            reason: `Admin approved documents for Vendor ${vendor.name}`
        });
        await log.save();

        await createNotification(vendorId, "Documents Approved", "Your documents have been approved by the Admin.", 'DOCUMENT');

        res.status(200).json({
            success: true,
            message: "Vendor documents approved successfully",
            data: vendor,
            auditLogId: log._id
        });
    } catch (error) {
        console.error("🚨 Approve Vendor Error:", error);
        res.status(500).json({ success: false, message: "Server Error approving vendor" });
    }
};

module.exports = { getSystemMetrics, getAllSuperVendors, toggleVendorStatus, getAuditLogs, getAllGlobalVendors, approveVendorDocument };