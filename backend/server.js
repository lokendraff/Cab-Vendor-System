require('dotenv').config();

const express = require('express');
const morgan = require('morgan'); 
const { errorHandler } = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const { checkExpiredDocuments } = require('./jobs/documentExpiryJob');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');



// Routes
const vendorRoutes = require('./routes/vendorRoutes');
const cabRoutes = require('./routes/cabRoutes');
const driverRoutes = require('./routes/driverRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/document.routes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const superVendorRoutes = require('./routes/superVendorRoutes');

const app = express();
app.set('trust proxy', 1);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Relaxed for production testing
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many auth requests. Please try again later.' },
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, // Relaxed for production testing
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith('/api/auth'),
    message: { success: false, message: 'Too many requests. Please try again later.' },
});

app.use(helmet());

// Body parser
app.use(express.json());


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL],
    credentials: true
}));
app.use(apiLimiter);

// Logger
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Test route
app.get('/', (req, res) => {
    res.send('Vendor Cab System API is running...');
});

// Routes
app.use('/api/vendors', vendorRoutes);
app.use('/api/cabs', cabRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/approvals', require('./routes/approvalRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/super-vendor', superVendorRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route Not Found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

checkExpiredDocuments();
console.log("🤖 Background Jobs Activated");