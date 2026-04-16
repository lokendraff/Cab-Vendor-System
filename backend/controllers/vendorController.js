const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');
const { sendOTPVerificationEmail } = require('../services/email.service');

// @desc    Get current vendor profile
// @route   GET /api/vendors/me
// @access  Private
const getMyProfile = async (req, res, next) => {
    try {
        const vendor = await Vendor.findById(req.user._id).select('-password');
        if (!vendor) {
            res.status(404);
            throw new Error('Vendor not found');
        }
        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        next(error);
    }
};

// @desc    Update current vendor name and email
// @route   PATCH /api/vendors/me
// @access  Private
const updateMyProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            res.status(400);
            throw new Error('Name is required');
        }
        if (!email || typeof email !== 'string' || !email.trim()) {
            res.status(400);
            throw new Error('Email is required');
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        const vendor = await Vendor.findById(req.user._id);
        if (!vendor) {
            res.status(404);
            throw new Error('Vendor not found');
        }

        const emailChanged = trimmedEmail !== vendor.email;

        if (emailChanged) {
            const taken = await Vendor.findOne({
                email: trimmedEmail,
                _id: { $ne: vendor._id },
            });
            if (taken) {
                res.status(400);
                throw new Error('Email is already in use');
            }

            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000);

            // C-01 Fix: Hash OTP before storing (consistent with registration flow)
            const otpSalt = await bcrypt.genSalt(10);
            const hashedOtp = await bcrypt.hash(generatedOtp, otpSalt);

            vendor.name = trimmedName;
            vendor.email = trimmedEmail;
            vendor.isEmailVerified = false;
            vendor.otp = hashedOtp; // C-01: Store hashed OTP, not plaintext
            vendor.otpExpires = otpExpiryTime;
            await vendor.save();

            // Send the raw OTP via email (user needs the plaintext to verify)
            await sendOTPVerificationEmail(vendor.email, generatedOtp);

            const safe = await Vendor.findById(vendor._id).select('-password');
            return res.status(200).json({
                success: true,
                message:
                    'Profile updated. Verify your new email with the OTP we sent before your next login.',
                data: safe,
                emailVerificationRequired: true,
            });
        }

        vendor.name = trimmedName;
        await vendor.save();

        const safe = await Vendor.findById(vendor._id).select('-password');
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: safe,
            emailVerificationRequired: false,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change current vendor password
// @route   PUT /api/vendors/me/password
// @access  Private
const changeMyPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400);
            throw new Error('Current password and new password are required');
        }
        if (typeof newPassword !== 'string' || newPassword.length < 8) {
            res.status(400);
            throw new Error('New password must be at least 8 characters');
        }

        const vendor = await Vendor.findById(req.user._id);
        if (!vendor) {
            res.status(404);
            throw new Error('Vendor not found');
        }

        const match = await bcrypt.compare(currentPassword, vendor.password);
        if (!match) {
            res.status(400);
            throw new Error('Current password is incorrect');
        }

        const salt = await bcrypt.genSalt(10);
        vendor.password = await bcrypt.hash(newPassword, salt);
        await vendor.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
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
        const subVendor = await Vendor.findOne({ _id: subVendorId, parentId: req.user.id });

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

module.exports = {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    delegateAccess,
};