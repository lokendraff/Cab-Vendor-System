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

module.exports = mongoose.model('Vendor', vendorSchema);