const { Resend } = require('resend');

// Initialize Resend with API key (uses HTTPS port 443 — works on Render Free Tier)
const resend = new Resend(process.env.RESEND_API_KEY);

// The "from" address MUST use a verified domain on Resend.
// For testing, Resend provides: onboarding@resend.dev
// For production, verify your domain and use e.g. noreply@yourdomain.com
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || 'FleetMaster <onboarding@resend.dev>';

const sendOTPVerificationEmail = async (vendorEmail, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to: [vendorEmail],
            subject: 'Verify Your FleetMaster Account - OTP',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2>Welcome to FleetMaster SaaS! 🚕</h2>
                    <p>To complete your vendor registration, please use the OTP below:</p>
                    <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                </div>
            `,
        });

        if (error) {
            console.error('🚨 Resend API error:', error);
            return false;
        }

        console.log('📧 Email sent successfully to:', vendorEmail, '| ID:', data.id);
        return true;
    } catch (error) {
        console.error('🚨 Error sending email:', error);
        return false;
    }
};

const sendPasswordResetEmail = async (vendorEmail, resetUrl) => {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to: [vendorEmail],
            subject: 'FleetMaster — Reset your password',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0a0a0f; color: #e2e8f0; border-radius: 12px; border: 1px solid rgba(212, 168, 83, 0.2);">
                    <h1 style="margin: 0 0 8px; font-size: 22px; letter-spacing: 0.12em; color: #f5c842;">FLEETMASTER</h1>
                    <p style="margin: 0 0 20px; font-size: 13px; color: #94a3b8;">Password reset request</p>
                    <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">We received a request to reset the password for your vendor account. Click the button below to choose a new password. This link expires in <strong>15 minutes</strong>.</p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #d4a853, #b8860b); color: #0a0a0f; font-weight: 700; text-decoration: none; border-radius: 10px; font-size: 14px;">Reset password</a>
                    </div>
                    <p style="font-size: 12px; color: #64748b; word-break: break-all;">If the button does not work, paste this URL into your browser:<br/><span style="color: #d4a853;">${resetUrl}</span></p>
                    <p style="font-size: 12px; color: #64748b; margin-top: 24px;">If you did not request this, you can ignore this email.</p>
                </div>
            `,
        });

        if (error) {
            console.error('🚨 Resend API error (password reset):', error);
            return false;
        }

        console.log('📧 Password reset email sent to:', vendorEmail, '| ID:', data.id);
        return true;
    } catch (error) {
        console.error('🚨 Error sending password reset email:', error);
        return false;
    }
};

module.exports = { sendOTPVerificationEmail, sendPasswordResetEmail };