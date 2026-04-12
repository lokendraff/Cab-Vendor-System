const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

            
            req.user = await Vendor.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User no longer exists' });
            }

            next(); 
        } catch (error) {
            console.error("🚨 Token Verification Error:", error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};


// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access Denied: Role (${req.user.role}) is not authorized to perform this action` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };