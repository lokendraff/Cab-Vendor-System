const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token nikalna (Bearer <token> me se)
            token = req.headers.authorization.split(' ')[1];

            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.vendor = await Vendor.findById(decoded.id).select('-password');

            next(); 
        } catch (error) {
            console.error(error);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// RBAC (Role-Based Access Control) Middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.vendor.role)) {
            res.status(403); // 403 Forbidden
            return next(new Error(`Role: ${req.vendor.role} is not authorized to access this route`));
        }
        next();
    };
};

module.exports = { protect, authorize };