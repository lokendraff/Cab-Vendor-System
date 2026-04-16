const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
        uppercase: true
    },
    model: {
        type: String,
        required: [true, 'Vehicle model is required']
    },
    seatingCapacity: {
        type: Number,
        required: [true, 'Seating capacity is required']
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'CNG', 'Electric'],
        required: [true, 'Fuel type is required']
    },
    // Vendor who onboarded this cab
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    // Driver currently assigned to this cab (null if unassigned)
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
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

// Pre-save hook: Enforce Cab limits based on SuperVendor's Fleet Plan
cabSchema.pre('save', async function(next) {
    if (this.isNew && this.vendorId) {
        const { getRootVendorId, getDescendantVendorIds } = require('../utils/hierarchy');
        try {
            const rootId = await getRootVendorId(this.vendorId);
            const rootVendor = await mongoose.model('Vendor').findById(rootId).select('currentPlan').lean();
            
            if (rootVendor) {
                const plan = rootVendor.currentPlan || 'Starter';
                let limit = null;
                
                if (plan === 'Starter') limit = 10;
                else if (plan === 'Professional') limit = 50;

                if (limit !== null) {
                    const descendantIds = await getDescendantVendorIds(rootId);
                    const currentCount = await mongoose.model('Cab').countDocuments({ vendorId: { $in: descendantIds } });
                    
                    if (currentCount >= limit) {
                        return next(new Error(`Plan Limit Receeded: Upgrad to ${plan === 'Starter' ? 'Professional' : 'Enterprise'} plan to manage more Cabs.`));
                    }
                }
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('Cab', cabSchema);