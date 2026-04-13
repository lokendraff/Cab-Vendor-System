const { verifyDrivingLicense } = require('../services/ocr.service');
const Document = require('../models/Document'); 
const Driver = require('../models/Driver');


const getMyDocuments = async (req, res) => {
    try {
        const drivers = await Driver.find({ vendorId: req.user.id }).select('_id');
        const driverIds = drivers.map(d => d._id);

        const documents = await Document.find({ driverId: { $in: driverIds } })
            .populate('driverId', 'name contactNumber') 
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: documents.length, data: documents });
    } catch (error) {
        console.error("🚨 Fetch Documents Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const uploadDriverDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image file." });
        }

        const uploadedImageUrl = req.file.path; 
        const { driverId, documentType } = req.body; 

        let ocrResult = { isVerified: false, message: "Not processed" };
        
        if (documentType === 'DL') {
            console.log("⏳ Upload done! AI Engine starting... (First time takes 10-15 secs)");
            ocrResult = await verifyDrivingLicense(uploadedImageUrl);
        } else {
            ocrResult.message = "Manual Verification Required for this doc type";
        }

        const newDoc = new Document({
            driverId: driverId,
            documentType: documentType,
            documentUrl: uploadedImageUrl,
            isVerified: ocrResult.isVerified,
            remarks: ocrResult.message
        });

        await newDoc.save();

        res.status(200).json({
            success: true,
            message: "Document uploaded successfully",
            verificationResult: ocrResult,
            docId: newDoc._id
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { uploadDriverDocument, getMyDocuments };