const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vendor_cab_documents', // Cloudinary mein is folder mein save hoga
    allowedFormats: ['jpeg', 'png', 'jpg', 'pdf'], // PDF ki requirement hai documents ke liye
  },
});

const upload = multer({ storage: storage });

module.exports = upload;