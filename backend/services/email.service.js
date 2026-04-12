const nodemailer = require('nodemailer');

// Transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPVerificationEmail = async (vendorEmail, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: vendorEmail,
            subject: "Verify Your FleetMaster Account - OTP",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>Welcome to FleetMaster SaaS! 🚕</h2>
                    <p>To complete your vendor registration, please use the OTP below:</p>
                    <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent successfully to:", vendorEmail);
        return true;
    } catch (error) {
        console.error("🚨 Error sending email:", error);
        return false;
    }
};

module.exports = { sendOTPVerificationEmail };