const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function JWT banane ke liye
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new vendor (Super Vendor, Regional, etc.)
// @route   POST /api/vendors/register
const registerVendor = async (req, res, next) => {
    try {
        const { name, email, password, role, parentVendor } = req.body;

        // Check if vendor already exists
        const vendorExists = await Vendor.findOne({ email });
        if (vendorExists) {
            res.status(400);
            throw new Error('Vendor already exists');
        }

        // Hash password (Security step)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create vendor
        const vendor = await Vendor.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'CityVendor',
            parentVendor: parentVendor || null
        });

        if (vendor) {
            res.status(201).json({
                _id: vendor.id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                token: generateToken(vendor._id)
            });
        } else {
            res.status(400);
            throw new Error('Invalid vendor data');
        }
    } catch (error) {
        next(error); // Ye error errorHandler middleware me jayega
    }
};

// @desc    Authenticate a vendor (Login)
// @route   POST /api/vendors/login
const loginVendor = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const vendor = await Vendor.findOne({ email });

        if (vendor && (await bcrypt.compare(password, vendor.password))) {
            res.json({
                _id: vendor.id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                token: generateToken(vendor._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerVendor,
    loginVendor
};