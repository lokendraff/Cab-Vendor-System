require('dotenv').config();
const mongoose = require('mongoose');
const Cab = require('../models/Cab');
const Driver = require('../models/Driver');
const Vendor = require('../models/Vendor');

const runMigration = async () => {
    try {
        console.log("🔄 Starting Data Migration to prevent legacy soft-locks...");
        
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fleetmaster');

        console.log("✅ Connected to Database.");

        // 1. Migrate Vendors -> Make existing SuperVendors strictly 'approved'
        const updatedVendors = await Vendor.updateMany(
            { approvalStatus: { $exists: false } },
            { $set: { approvalStatus: 'approved' } }
        );
        console.log(`✅ Vendors updated: ${updatedVendors.modifiedCount}`);

        // 2. Migrate Cabs
        const updatedCabs = await Cab.updateMany(
            { approvalStatus: { $exists: false } },
            { $set: { approvalStatus: 'approved' } } // Assume legacy active cabs are approved
        );
        console.log(`✅ Cabs updated: ${updatedCabs.modifiedCount}`);

        // 3. Migrate Drivers
        const updatedDrivers = await Driver.updateMany(
            { approvalStatus: { $exists: false } },
            { $set: { approvalStatus: 'approved' } }
        );
        console.log(`✅ Drivers updated: ${updatedDrivers.modifiedCount}`);

        console.log("🎉 Migration Complete! Safely exiting.");
        process.exit(0);
    } catch (error) {
        console.error("🚨 Migration failed: ", error);
        process.exit(1);
    }
};

runMigration();
