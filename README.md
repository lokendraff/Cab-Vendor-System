# Cab Vendor System — Backend API

A RESTful backend API for managing a hierarchical cab vendor system. Vendors can register, manage sub-vendors, onboard cabs, and manage drivers with document compliance tracking.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **File Uploads:** Multer + Cloudinary
- **Dev Tool:** Nodemon

---

## Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── vendorController.js    # Register & Login logic
│   └── cabController.js       # Add & fetch cabs
├── middlewares/
│   ├── authMiddleware.js      # JWT protect + RBAC authorize
│   ├── errorHandler.js        # Global error handler
│   └── uploadMiddleware.js    # Multer + Cloudinary upload
├── models/
│   ├── Vendor.js              # Vendor schema (self-referencing hierarchy)
│   ├── Cab.js                 # Cab schema
│   └── Driver.js              # Driver schema with document compliance
├── routes/
│   ├── vendorRoutes.js        # /api/vendors
│   └── cabRoutes.js           # /api/cabs
├── .env                       # Environment variables
└── server.js                  # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cab-vendor-system?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Important:** Use the `mongodb+srv://` format for MongoDB Atlas URI. Also make sure your current IP is whitelisted in Atlas under **Network Access**.

### Run the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server runs at: `http://localhost:5000`

---

## API Endpoints

### Vendors — `/api/vendors`

| Method | Endpoint             | Access  | Description          |
|--------|----------------------|---------|----------------------|
| POST   | `/api/vendors/register` | Public  | Register a new vendor |
| POST   | `/api/vendors/login`    | Public  | Login and get JWT token |

#### Register Vendor — Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword",
  "role": "CityVendor",
  "parentVendor": "<parent_vendor_id>"
}
```

#### Login Vendor — Request Body
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

---

### Cabs — `/api/cabs`

> All cab routes require `Authorization: Bearer <token>` header.

| Method | Endpoint    | Access                                              | Description              |
|--------|-------------|-----------------------------------------------------|--------------------------|
| POST   | `/api/cabs` | SuperVendor, RegionalVendor, CityVendor, LocalVendor | Onboard a new cab        |
| GET    | `/api/cabs` | Any logged-in vendor                                | Get all cabs of the vendor |

#### Add Cab — Request Body
```json
{
  "registrationNumber": "MH12AB1234",
  "model": "Toyota Innova",
  "seatingCapacity": 7,
  "fuelType": "Diesel"
}
```

---

## Vendor Hierarchy (N-Level)

Vendors follow a self-referencing hierarchy using `parentVendor`:

```
SuperVendor
  └── RegionalVendor
        └── CityVendor
              └── LocalVendor
```

- A vendor with `parentVendor: null` is a **SuperVendor**.
- Each vendor can fetch their sub-vendors using the `getSubVendors()` instance method on the Vendor model.

---

## Role-Based Access Control (RBAC)

The `authorize(...roles)` middleware restricts routes by vendor role:

| Role            | Can Add Cabs |
|-----------------|--------------|
| SuperVendor     | ✅           |
| RegionalVendor  | ✅           |
| CityVendor      | ✅           |
| LocalVendor     | ✅           |

---

## Driver Document Compliance

The Driver model tracks 3 documents:
- Driving License
- Registration Certificate (RC)
- Permit & Pollution Certificate

Each document has a `expiryDate` and `isVerified` flag. The `checkCompliance()` instance method returns `false` if any document is expired.

---

## Error Handling

All errors are caught and forwarded to the global `errorHandler` middleware, which returns a consistent JSON response:

```json
{
  "message": "Error description",
  "stack": "..." 
}
```

---

## License

ISC
