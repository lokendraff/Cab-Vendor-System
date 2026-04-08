const mongoose = require('mongoose');

// Document schema to track URLs and Expiry Dates (PDF ke point: "flags expired documents" [cite: 106])
const documentSchema = new mongoose.Schema({
    documentUrl: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    isVerified: { type: Boolean, default: false }
});

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Driver name is required']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        unique: true
    },
    // Relationship: Kis Vendor ke under ye driver hai
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    // Documents embedding
    documents: {
        drivingLicense: documentSchema,
        registrationCertificate: documentSchema, // RC
        permitAndPollution: documentSchema
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// OOPS Principle: Ek instance method jo check karega ki documents expire toh nahi ho gaye
driverSchema.methods.checkCompliance = function() {
    const today = new Date();
    const docs = this.documents;
    
    // Agar koi bhi document ki expiry date aaj se pehle ki hai, toh false return karo
    if (
        docs.drivingLicense.expiryDate < today ||
        docs.registrationCertificate.expiryDate < today ||
        docs.permitAndPollution.expiryDate < today
    ) {
        return false;
    }
    return true; 
};

module.exports = mongoose.model('Driver', driverSchema);