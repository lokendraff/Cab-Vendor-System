const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    documentType: {
        type: String,
        required: true,
        enum: ['DL', 'RC', 'Permit', 'Pollution', 'Insurance'] // Valid docs
    },
    documentUrl: {
        type: String,
        required: true 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    expiryDate: {
        type: Date,
        required: true,
        default: () => new Date(+new Date() + 365*24*60*60*1000) // Default expiry: 1 year from creation
    },
    remarks: {
        type: String,
        default: "Pending Verification"
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);