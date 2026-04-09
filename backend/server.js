const dns = require('dns');
dns.setServers(["1.1.1.1"]);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const vendorRoutes = require('./routes/vendorRoutes');

const cabRoutes = require('./routes/cabRoutes');




// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Basic Route testing
app.get('/', (req, res) => {
    res.send('Vendor Cab System API is running...');
});

app.use('/api/vendors', vendorRoutes);
app.use('/api/cabs', cabRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});