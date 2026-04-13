const cron = require('node-cron');
const Document = require('../models/Document');
const { createNotification } = require('../services/notification.service');

const checkExpiredDocuments = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log("🤖 [CRON JOB] Checking for expired documents...");

        try {
            const currentDate = new Date();

            // find expired documents which are verified 
            const expiredDocs = await Document.find({
                expiryDate: { $lt: currentDate },
                isVerified: true 
            }).populate('driverId'); // driver details are also needed to send notification to the vendor

            if (expiredDocs.length === 0) {
                console.log("✅ [CRON JOB] No expired documents found.");
                return;
            }

            console.log(`🚨 [CRON JOB] Found ${expiredDocs.length} expired documents. Taking action...`);

            // take action for each expired document
            for (let doc of expiredDocs) {
                // 1. make document unverified and update remarks
                doc.isVerified = false;
                doc.remarks = "Document Expired. Please upload a new one.";
                await doc.save();

                // 2. send notification to the vendor about expired document
                // Safely resolve vendorId even if the driver document was partially deleted
                const vendorId = doc.driverId ? (doc.driverId.vendorId || doc.driverId._id) : null;

                if (vendorId) {
                    await createNotification(
                        vendorId,
                        "Document Expired Alert!",
                        `The ${doc.documentType} for your driver has expired. Cab has been marked inactive.`,
                        'ALERT'
                    );
                }
            }

            console.log("✅ [CRON JOB] All alerts sent and documents updated.");

        } catch (error) {
            console.error("❌ [CRON JOB Error]:", error);
        }
    });
};

module.exports = { checkExpiredDocuments };