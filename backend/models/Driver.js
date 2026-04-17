const mongoose = require('mongoose');

// Embedded document schema to track document URLs and expiry dates for compliance checks
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
    // Vendor this driver belongs to
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
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvalRemarks: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// OOP: Instance method to check if any driver documents have expired
driverSchema.methods.checkCompliance = function() {
    const today = new Date();
    const docs = this.documents;
    
    // If any document's expiry date is before today, the driver is non-compliant
    if (
        docs.drivingLicense.expiryDate < today ||
        docs.registrationCertificate.expiryDate < today ||
        docs.permitAndPollution.expiryDate < today
    ) {
        return false;
    }
    return true; 
};

// Pre-save hook: Enforce Driver limits based on SuperVendor's Fleet Plan
driverSchema.pre('save', async function() {
    if (this.isNew && this.vendorId) {
        const { getRootVendorId, getDescendantVendorIds } = require('../utils/hierarchy');
        
        const rootId = await getRootVendorId(this.vendorId);
        const rootVendor = await mongoose.model('Vendor').findById(rootId).select('currentPlan').lean();
        
        if (rootVendor) {
            const plan = rootVendor.currentPlan || 'Starter';
            let limit = null;
            
            if (plan === 'Starter') limit = 10;
            else if (plan === 'Professional') limit = 50;

            if (limit !== null) {
                const descendantIds = await getDescendantVendorIds(rootId);
                const currentCount = await mongoose.model('Driver').countDocuments({ vendorId: { $in: descendantIds } });
                
                if (currentCount >= limit) {
                    throw new Error('Plan Limit Reached! Upgrade to Professional to add more drivers.');
                }
            }
        }
    }
});

module.exports = mongoose.model('Driver', driverSchema);