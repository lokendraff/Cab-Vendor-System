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
        enum: ['SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'],
        default: 'CityVendor'
    },

    delegatedRights: {
        canOnboardCab: { type: Boolean, default: true },
        canOnboardDriver: { type: Boolean, default: true },
        canProcessPayments: { type: Boolean, default: false }
    },
    
    // N-Level Hierarchy ka Asli Logic: Self-Referencing 
    parentVendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        default: null // Agar null hai, matlab ye SuperVendor hai
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Ye createdAt aur updatedAt khud manage karega
});

// OOPS Principle: Encapsulation & Instance Method [cite: 13]
// Ek method jo is vendor ke saare sub-vendors ko dhoondh ke layega
vendorSchema.methods.getSubVendors = async function() {
    return await mongoose.model('Vendor').find({ parentVendor: this._id });
};

module.exports = mongoose.model('Vendor', vendorSchema);