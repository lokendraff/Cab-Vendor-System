const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    role: {
        type: String,
        enum: ['Admin', 'SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'],
        default: 'CityVendor'
    },
    currentPlan: {
        type: String,
        enum: ['Starter', 'Professional', 'Enterprise'],
        default: 'Starter'
    },

    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvalRemarks: {
        type: String,
        default: null
    },

    delegatedRights: {
        canOnboardCab: { type: Boolean, default: true },
        canOnboardDriver: { type: Boolean, default: true },
        canProcessPayments: { type: Boolean, default: false }
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        default: null 
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },

    passwordResetToken: {
        type: String,
        default: null,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        default: null,
        select: false,
    },

}, {
    timestamps: true
});


// Instance Method
vendorSchema.methods.getSubVendors = async function() {
    return await mongoose.model('Vendor').find({ parentId: this._id });
};

// Pre-save hook: Enforce Sub-Vendor limits based on SuperVendor's Fleet Plan
vendorSchema.pre('save', async function(next) {
    // Only check limits when a new Sub-Vendor is being created
    if (this.isNew && this.role !== 'SuperVendor' && this.role !== 'Admin') {
        const parentId = this.parentVendor || this.parentId;
        if (parentId) {
            const { getRootVendorId, getDescendantVendorIds } = require('../utils/hierarchy');
            try {
                const rootId = await getRootVendorId(parentId);
                const rootVendor = await mongoose.model('Vendor').findById(rootId).select('currentPlan').lean();
                
                if (rootVendor) {
                    const plan = rootVendor.currentPlan || 'Starter';
                    
                    if (plan === 'Starter') {
                        // Starter plan allows 0 Sub-Vendors
                        const descendants = await getDescendantVendorIds(rootId);
                        const subVendorCount = descendants.length - 1; // subtract root
                        if (subVendorCount >= 0) {
                            return next(new Error("Plan Limit Receeded: Upgrad to Professional plan to manage more Sub-Vendors."));
                        }
                    }
                    // Professional and Enterprise have Unlimited Sub-Vendors, so pass
                }
            } catch (err) {
                return next(err);
            }
        }
    }
    next();
});

module.exports = mongoose.model('Vendor', vendorSchema);