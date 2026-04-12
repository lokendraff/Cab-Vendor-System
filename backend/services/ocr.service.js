const Tesseract = require('tesseract.js');


const verifyDrivingLicense = async (imageUrl) => {
    try {
        console.log("🔍 Scanning Document using AI (Tesseract)... Please wait.");
        
        const result = await Tesseract.recognize(
            imageUrl,
            'eng',
        );
        
        const extractedText = result.data.text;
        
        const dlRegex = /[A-Z]{2}[0-9]{2}\s?[0-9]{11}/i; 
        const match = extractedText.match(dlRegex);
        
        if (match) {
            console.log("✅ DL Match Found:", match[0]);
            return {
                success: true,
                message: "Document Verified",
                dlNumber: match[0],
                isVerified: true
            };
        } else {
            console.log("❌ No valid DL format found in image.");
            return {
                success: true, 
                message: "Manual Verification Required",
                dlNumber: null,
                isVerified: false
            };
        }

    } catch (error) {
        console.error("🚨 OCR Engine Error:", error);
        return { 
            success: false, 
            message: "Document scan failed due to server error",
            isVerified: false 
        };
    }
};

module.exports = { verifyDrivingLicense };