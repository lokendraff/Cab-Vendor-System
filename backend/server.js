const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan'); // 1. Naya package import kiya
const { errorHandler } = require('./middlewares/errorHandler');
const connectDB = require('./config/db');

// Route imports
const vendorRoutes = require('./routes/vendorRoutes');
const cabRoutes = require('./routes/cabRoutes');
const driverRoutes = require('./routes/driverRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// CORS — open for all origins in development
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

// 2. System Monitoring: HTTP request logger middleware
// 'dev' format gives concise output colored by response status for development use
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Basic Route testing
app.get('/', (req, res) => {
    res.send('Vendor Cab System API is running...');
});

// Mount routes
app.use('/api/vendors', vendorRoutes);
app.use('/api/cabs', cabRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Custom Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});