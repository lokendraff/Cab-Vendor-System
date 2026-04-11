const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
        next(error);
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



// @desc    Delegate or revoke access rights to a sub-vendor
// @route   PUT /api/vendors/delegate/:id
// @access  Private (Only SuperVendor)
const delegateAccess = async (req, res, next) => {
    try {
        const subVendorId = req.params.id;
        const { canOnboardCab, canOnboardDriver, canProcessPayments } = req.body;

        // Ensure sub-vendor exists and belongs to this SuperVendor
        const subVendor = await Vendor.findOne({ _id: subVendorId, parentVendor: req.vendor._id });

        if (!subVendor) {
            res.status(404);
            throw new Error('Sub-vendor not found or does not belong to you');
        }

        // Update delegation rights based on request
        if (canOnboardCab !== undefined) subVendor.delegatedRights.canOnboardCab = canOnboardCab;
        if (canOnboardDriver !== undefined) subVendor.delegatedRights.canOnboardDriver = canOnboardDriver;
        if (canProcessPayments !== undefined) subVendor.delegatedRights.canProcessPayments = canProcessPayments;

        await subVendor.save();

        res.status(200).json({
            success: true,
            message: 'Delegation rights successfully updated',
            data: subVendor.delegatedRights
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all sub-vendors under the logged-in vendor
// @route   GET /api/vendors/sub-vendors
// @access  Private
const getSubVendors = async (req, res, next) => {
    try {
        const subVendors = await Vendor.find({ parentVendor: req.vendor._id })
            .select('-password')
            .lean();

        res.status(200).json({
            success: true,
            count: subVendors.length,
            data: subVendors
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged-in vendor profile
// @route   GET /api/vendors/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: req.vendor
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerVendor,
    loginVendor,
    delegateAccess,
    getSubVendors,
    getMe,
};