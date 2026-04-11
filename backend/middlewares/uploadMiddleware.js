const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Refined Storage configuration for handling both Images and PDFs
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder and format based on the file type
    let folderName = 'vendor_cab_documents';
    
    return {
      folder: folderName,
      // Setting resource_type to 'auto' allows Cloudinary to detect PDF vs Image
      resource_type: 'auto', 
      // Ensure file original name or extension is preserved
      public_id: file.originalname.split('.')[0] + '_' + Date.now(),
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;