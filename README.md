# Cab-Vendor-System

A Node.js/Express backend API for managing cab vendors, their cabs, and related operations. Supports vendor registration, authentication, cab management with Cloudinary file uploads.

## Features

- Vendor registration and JWT-based authentication with role-based access (SuperVendor, RegionalVendor, CityVendor, LocalVendor)
- Add and retrieve cabs associated with vendors
- MongoDB integration for data persistence
- File upload handling for documents using Multer and Cloudinary
- Centralized error handling
- Environment-based configuration

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, bcryptjs
- **File Storage**: Cloudinary
- **Development**: Nodemon, dotenv

## Project Structure

```
backend/
├── config/db.js              # MongoDB connection
├── controllers/
│   ├── cabController.js     # Cab CRUD operations
│   └── vendorController.js  # Vendor auth
├── middlewares/
│   ├── authMiddleware.js    # JWT protect/authorize
│   ├── errorHandler.js      # Global error handling
│   └── uploadMiddleware.js  # Multer + Cloudinary
├── models/
│   ├── Cab.js              # Cab schema
│   ├── Driver.js           # Driver schema
│   └── Vendor.js           # Vendor schema
├── routes/
│   ├── cabRoutes.js        # /api/cabs
│   └── vendorRoutes.js     # /api/vendors
└── server.js               # Main server file
```

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for file uploads

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cab-Vendor-System/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example` if available or create manually):
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the application**
   ```bash
   npm start
   ```

   Server will start on `http://localhost:5000`

## API Endpoints

| Method | Endpoint              | Description                  | Auth Required |
|--------|-----------------------|------------------------------|---------------|
| GET    | `/`                   | Health check                 | No            |
| POST   | `/api/vendors/register` | Register new vendor        | No            |
| POST   | `/api/vendors/login`    | Vendor login                 | No            |
| POST   | `/api/cabs`             | Add new cab                  | Yes           |
| GET    | `/api/cabs`             | Get vendor's cabs            | Yes           |

## Models Overview

### Vendor
- name, email, password, role, parentVendor

### Cab
- registrationNumber (unique), model, seatingCapacity, fuelType (Petrol/Diesel/CNG/Electric), vendor

### Driver
- name, contactNumber, documents (with verification), vendor

## Environment Variables

| Variable              | Description                     | Required |
|-----------------------|---------------------------------|----------|
| `MONGO_URI`           | MongoDB connection string       | Yes      |
| `JWT_SECRET`          | JWT signing secret              | Yes      |
| `PORT`                | Server port                     | No       |
| `CLOUDINARY_*`        | Cloudinary credentials          | Yes      |

## Running in Production

Update `package.json` scripts for production:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Set `NODE_ENV=production` and use a process manager like PM2.

## Troubleshooting

- **MongoDB Connection Error**: Verify `MONGO_URI` and network access.
- **Cloudinary Uploads Fail**: Check credentials and folder permissions.
- **JWT Errors**: Ensure `JWT_SECRET` is set and matches across restarts.

## License

ISC
