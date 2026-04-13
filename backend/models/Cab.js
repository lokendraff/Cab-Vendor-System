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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cab', cabSchema);