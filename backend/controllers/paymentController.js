const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API 1: Generate Bill/Order
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; 

        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        // save in database with status 'Pending' (optional, but good for tracking)
        const newTransaction = new Transaction({
            vendorId: req.user.id, 
            amount: amount,
            razorpayOrderId: order.id
        });
        await newTransaction.save();

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("🚨 Razorpay Order Error:", error);
        res.status(500).json({ success: false, message: "Could not create order" });
    }
};

// API 2: Verify Payment Signature (Security Check)
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // payment verified, then save payment details in DB and mark transaction as completed
            await Transaction.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { razorpayPaymentId: razorpay_payment_id, status: 'Completed' }
            );
            res.status(200).json({ success: true, message: "Payment Verified Successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature! Fake Payment Detected." });
        }
    } catch (error) {
        console.error("🚨 Payment Verification Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { createOrder, verifyPayment };