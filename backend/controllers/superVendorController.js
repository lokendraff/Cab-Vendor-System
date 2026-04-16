const Vendor = require('../models/Vendor');
const Driver = require('../models/Driver');
const Document = require('../models/Document');
const { getDescendantVendorIds } = require('../utils/hierarchy');
const { createNotification } = require('../services/notification.service');

// @desc    Get descendants with zero uploaded documents
// @route   GET /api/super-vendor/descendants-missing-docs
// @access  Private (SuperVendor)
const getDescendantsMissingDocs = async (req, res, next) => {
    try {
        const rootVendorId = req.user.id;
        
        // 1. Identify all direct and indirect descendants
        const allDescendantIds = await getDescendantVendorIds(rootVendorId);
        
        // Filter out the SuperVendor themselves
        const childIds = allDescendantIds.filter(id => id.toString() !== rootVendorId.toString());

        if (childIds.length === 0) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const missingDocsVendors = [];

        // 2. Check each descendant for zero records in Document collection
        for (const vendorId of childIds) {
            const drivers = await Driver.find({ vendorId }).select('_id').lean();
            
            if (drivers.length === 0) {
                // Vendor has 0 drivers, so 0 documents uploaded
                missingDocsVendors.push(vendorId);
                continue;
            }

            const driverIds = drivers.map(d => d._id);
            const docCount = await Document.countDocuments({ driverId: { $in: driverIds } });

            if (docCount === 0) {
                // Vendor has drivers but NO documents uploaded
                missingDocsVendors.push(vendorId);
            }
        }

        // Return details of the identified vendors
        const vendors = await Vendor.find({ _id: { $in: missingDocsVendors } })
                                    .select('name email role isActive createdAt')
                                    .lean();

        res.status(200).json({ success: true, count: vendors.length, data: vendors });

    } catch (error) {
        console.error("🚨 Get Missing Docs Descendants Error:", error);
        res.status(500).json({ success: false, message: "Server Error fetching missing docs list" });
    }
};

// @desc    Proactively send document reminders to selected sub-vendors
// @route   POST /api/super-vendor/send-document-reminder
// @access  Private (SuperVendor)
const sendDocumentReminder = async (req, res, next) => {
    try {
        const { targetVendorIds } = req.body; 

        if (!targetVendorIds || !Array.isArray(targetVendorIds) || targetVendorIds.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide an array of target vendor IDs." });
        }

        // Auth requirement: User must be a SuperVendor (enforced by route middleware)
        // 2. In bulk, create entries in the Notification collection
        for (const targetId of targetVendorIds) {
            await createNotification(
                targetId,
                "Urgent: Mandatory Documents Missing",
                `SuperVendor ${req.user.name || 'System'} is requesting mandatory documents. Please upload DL/RC immediately.`,
                "DOCUMENT" // Using the DOCUMENT alert type defined in our frontend TYPE_META
            );
        }

        res.status(200).json({ 
            success: true, 
            message: `Reminders successfully sent to ${targetVendorIds.length} vendors.` 
        });

    } catch (error) {
        console.error("🚨 Send Document Reminder Error:", error);
        res.status(500).json({ success: false, message: "Server Error sending reminders" });
    }
};

module.exports = {
    getDescendantsMissingDocs,
    sendDocumentReminder
};
