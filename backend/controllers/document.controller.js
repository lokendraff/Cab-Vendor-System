const { verifyDrivingLicense } = require('../services/ocr.service');
const Document = require('../models/Document'); 

const uploadDriverDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image file." });
        }

        const uploadedImageUrl = req.file.path; // Cloudinary URL
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

module.exports = { uploadDriverDocument };