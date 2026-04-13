const crypto = require('crypto');
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');

// 1. REGISTER VENDOR (With OTP)
const registerVendor = async (req, res) => {
    try {
        const { name, email, password, role, parentVendor } = req.body;

        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 6-digit OTP generation
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const newVendor = new Vendor({
            name,
            email,
            password: hashedPassword,
            role,
            parentVendor: parentVendor || null,
            otp: generatedOtp,
            otpExpires: otpExpiryTime,
            isEmailVerified: false
        });

        await newVendor.save();

        //mail from nodemailer service to send OTP to vendor's email 
        await sendOTPVerificationEmail(newVendor.email, generatedOtp);

        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email for the OTP."
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. VERIFY OTP
const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const vendor = await Vendor.findOne({ email });

        if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
        if (vendor.isEmailVerified) return res.status(400).json({ success: false, message: "Already verified" });
        if (vendor.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
        if (vendor.otpExpires < new Date()) return res.status(400).json({ success: false, message: "OTP expired" });

        vendor.isEmailVerified = true;
        vendor.otp = null;
        vendor.otpExpires = null;
        await vendor.save();

        res.status(200).json({ success: true, message: "Email verified! You can log in now." });
    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 3. LOGIN VENDOR
const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const vendor = await Vendor.findOne({ email });
        if (!vendor) return res.status(400).json({ success: false, message: "Invalid email or password" });

        // Email verification check!
        if (!vendor.isEmailVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email first!" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

        const token = jwt.sign(
            { id: vendor._id, role: vendor.role }, 
            process.env.JWT_SECRET || 'supersecretkey', 
            { expiresIn: '1d' }
        );

        res.status(200).json({ success: true, token, role: vendor.role, vendorId: vendor._id, message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const FORGOT_PASSWORD_RESPONSE = {
    success: true,
    message: 'If an account exists for that email, you will receive password reset instructions shortly.',
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const trimmed = email.trim();
        const vendor = await Vendor.findOne({ email: trimmed });
        if (!vendor) {
            return res.status(200).json(FORGOT_PASSWORD_RESPONSE);
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        vendor.passwordResetToken = hashedToken;
        vendor.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await vendor.save();

        const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        const sent = await sendPasswordResetEmail(vendor.email, resetUrl);
        if (!sent) {
            vendor.passwordResetToken = null;
            vendor.passwordResetExpires = null;
            await vendor.save();
            return res.status(500).json({ success: false, message: 'Could not send reset email. Try again later.' });
        }

        return res.status(200).json(FORGOT_PASSWORD_RESPONSE);
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || typeof token !== 'string' || !token.trim()) {
            return res.status(400).json({ success: false, message: 'Reset token is required' });
        }
        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
        }

        const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

        const vendor = await Vendor.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() },
        }).select('+passwordResetToken +passwordResetExpires');

        if (!vendor) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link. Please request a new one.' });
        }

        const salt = await bcrypt.genSalt(10);
        vendor.password = await bcrypt.hash(newPassword, salt);
        vendor.passwordResetToken = null;
        vendor.passwordResetExpires = null;
        await vendor.save();

        return res.status(200).json({ success: true, message: 'Password reset successful. You can log in with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { registerVendor, verifyEmailOTP, loginVendor, forgotPassword, resetPassword };