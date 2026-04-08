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
    // Relationship: Kis Vendor ne is cab ko onboard kiya hai
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    // Relationship: Kaunsa driver is cab ko chala raha hai (shuru me null ho sakta hai)
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