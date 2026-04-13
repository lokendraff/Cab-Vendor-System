# 🚀 Cab Vendor System — Backend Deep Analysis

## 1. Architecture Overview

```mermaid
graph TB
    subgraph Client["Client Layer"]
        PM["Postman / Frontend"]
    end
    
    subgraph Server["Express Server (server.js)"]
        CORS["CORS Middleware"]
        JSON["JSON Body Parser"]
        MORGAN["Morgan Logger"]
        ERR["Global Error Handler"]
    end
    
    subgraph Routes["Route Layer (/api/...)"]
        AUTH["/api/auth"]
        VENDOR["/api/vendors"]
        CAB["/api/cabs"]
        DRIVER["/api/drivers"]
        DASH["/api/dashboard"]
        DOC["/api/documents"]
        NOTIF["/api/notifications"]
        ADMIN["/api/admin"]
    end
    
    subgraph Middleware["Middleware Layer"]
        PROTECT["protect (JWT verify)"]
        AUTHORIZE["authorize (role check)"]
        CACHE["cacheMiddleware (node-cache)"]
        UPLOAD["uploadMiddleware (Multer + Cloudinary)"]
    end
    
    subgraph Controllers["Controller Layer"]
        AC["authController"]
        VC["vendorController"]
        CC["cabController"]
        DC["driverController"]
        DBC["dashboardController"]
        DOC_C["document.controller"]
        NC["notificationController"]
        ADC["adminController"]
        PC["paymentController"]
    end
    
    subgraph Models["MongoDB Models"]
        MV["Vendor"]
        MC["Cab"]
        MD["Driver"]
        MDOC["Document"]
        MAL["AuditLog"]
        MT["Transaction"]
        MN["Notification"]
    end

    subgraph Services["Service Layer"]
        OCR["ocr.service (Tesseract.js)"]
        EMAIL["email.service (Nodemailer)"]
        NOTIF_S["notification.service"]
    end

    subgraph Jobs["Background Jobs"]
        CRON["documentExpiryJob (node-cron)"]
    end
    
    PM --> CORS --> JSON --> Routes
    Routes --> Middleware --> Controllers --> Models
    Controllers --> Services
    CRON --> Models
    CRON --> NOTIF_S
```

---

## 2. Database Models

| Model | Key Fields | Relationships |
|-------|-----------|---------------|
| **Vendor** | name, email, password, role (SuperVendor\|Regional\|City\|Local), delegatedRights, isActive, isEmailVerified, otp, otpExpires | `parentVendor` → self-ref (Vendor) |
| **Cab** | registrationNumber (unique), model, seatingCapacity, fuelType, isActive | `vendorId` → Vendor, `driverId` → Driver |
| **Driver** | name, contactNumber (unique), isActive, embedded docs (DL/RC/Permit with URL+expiry+verified) | `vendorId` → Vendor |
| **Document** | documentType (DL/RC/Permit/Pollution/Insurance), documentUrl, isVerified, expiryDate, remarks | `driverId` → Driver |
| **AuditLog** | actionType (BLOCK/UNBLOCK_VENDOR, BLOCK_CAB, APPROVE/REJECT_DOCUMENT), reason | `performedBy` → Vendor, `targetEntityId` |
| **Transaction** | amount, currency, razorpayOrderId, razorpayPaymentId, status | `vendorId` → Vendor |
| **Notification** | title, message, type (ALERT/SYSTEM/DOCUMENT/PAYMENT), isRead | `recipientId` → Vendor |

---

## 3. API Endpoints (Complete Map)

### Auth (`/api/auth`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| POST | `/register` | ❌ Public | `registerVendor` | Register + send OTP email |
| POST | `/verify-otp` | ❌ Public | `verifyEmailOTP` | Verify email with 6-digit OTP |
| POST | `/login` | ❌ Public | `loginVendor` | Login → JWT token + role + vendorId |

### Vendors (`/api/vendors`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| PUT | `/delegate/:id` | 🔒 protect | `delegateAccess` | Update sub-vendor delegation rights |

### Cabs (`/api/cabs`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| POST | `/` | 🔒 protect + authorize(all roles) | `addCab` | Onboard a new cab |
| GET | `/` | 🔒 protect | `getMyCabs` | Get logged-in vendor's cabs |

### Drivers (`/api/drivers`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| POST | `/` | 🔒 protect + authorize(all roles) + upload(3 files) | `addDriver` | Onboard driver with DL/RC/Permit uploads |

### Dashboard (`/api/dashboard`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| GET | `/super-vendor` | 🔒 protect + authorize(SuperVendor) + cache | `getSuperVendorDashboard` | Aggregated metrics |

### Documents (`/api/documents`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| POST | `/upload` | upload.single('file') | `uploadDriverDocument` | Upload doc + OCR verify (DL) |

### Notifications (`/api/notifications`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| GET | `/` | 🔒 protect | `getMyNotifications` | Fetch vendor's notifications |
| PUT | `/:id/read` | 🔒 protect | `markAsRead` | Mark notification as read |

### Admin (`/api/admin`)
| Method | Route | Auth | Controller | Description |
|--------|-------|------|-----------|-------------|
| POST | `/toggle-vendor` | 🔒 protect | `toggleVendorStatus` | Block/unblock vendor + audit log + notification |

---

## 4. Postman Test Journey → Backend Mapping

| # | Postman Item | Actual API | Method | Flow |
|---|-------------|-----------|--------|------|
| 1 | **Register Vendor** | `POST /api/auth/register` | POST | Creates vendor with hashed password + generates 6-digit OTP + sends email |
| 2 | **OTP Generation** | Part of registration flow | — | OTP auto-generated during registration |
| 3 | **OTP Verification** | `POST /api/auth/verify-otp` | POST | Verifies OTP → sets `isEmailVerified: true` |
| 4 | **Login** | `POST /api/auth/login` | POST | Checks email verified → returns JWT token |
| 5 | **Add Cab** | `POST /api/cabs` | POST | Auth + creates cab linked to vendor |
| 6 | **Add Driver** | `POST /api/drivers` | POST | Auth + multipart upload (DL/RC/Permit) → Cloudinary |
| 7 | **DL Verification** | `POST /api/documents/upload` | POST | Uploads doc + Tesseract.js OCR → regex DL match |
| 8 | **Get Super Vendor Dashboard** | `GET /api/dashboard/super-vendor` | GET | Auth + SuperVendor only → cached aggregation |
| 9 | **Injecting Fake Vendor** | `POST /api/auth/register` (bypass) | POST | Test creating vendor without OTP flow |
| 10 | **Audit Log** | `POST /api/admin/toggle-vendor` | POST | Block/unblock vendor → creates AuditLog entry |

---

## 5. Key Working Flow

```mermaid
sequenceDiagram
    participant V as Vendor
    participant API as Express API
    participant DB as MongoDB
    participant CL as Cloudinary
    participant EM as Email (Gmail)
    participant OCR as Tesseract.js
    participant CRON as Cron Job

    Note over V,CRON: REGISTRATION FLOW
    V->>API: POST /api/auth/register
    API->>DB: Check existing email
    API->>DB: Save vendor (hashed pwd + OTP)
    API->>EM: Send OTP email
    API-->>V: "Check email for OTP"

    V->>API: POST /api/auth/verify-otp
    API->>DB: Verify OTP → set isEmailVerified=true
    API-->>V: "Email verified!"

    Note over V,CRON: LOGIN FLOW
    V->>API: POST /api/auth/login
    API->>DB: Find vendor + check verified + compare password
    API-->>V: JWT Token + Role + VendorId

    Note over V,CRON: CAB ONBOARDING
    V->>API: POST /api/cabs (+ Bearer token)
    API->>DB: Create Cab linked to vendorId
    API-->>V: Cab created

    Note over V,CRON: DRIVER ONBOARDING
    V->>API: POST /api/drivers (multipart: files + data)
    API->>CL: Upload DL, RC, Permit to Cloudinary
    CL-->>API: File URLs
    API->>DB: Create Driver with doc URLs
    API-->>V: Driver onboarded

    Note over V,CRON: DOCUMENT VERIFICATION (OCR)
    V->>API: POST /api/documents/upload (DL image)
    API->>CL: Upload to Cloudinary
    API->>OCR: Scan image for DL pattern
    OCR-->>API: Match/No Match
    API->>DB: Save Document with verification status
    API-->>V: Verification result

    Note over V,CRON: ADMIN OVERRIDE
    V->>API: POST /api/admin/toggle-vendor
    API->>DB: Update vendor isActive
    API->>DB: Create AuditLog
    API->>DB: Create Notification
    API-->>V: Vendor blocked/unblocked

    Note over V,CRON: BACKGROUND JOB (DAILY)
    CRON->>DB: Find expired verified documents
    CRON->>DB: Mark as unverified
    CRON->>DB: Create vendor notifications
```

---

## 6. Middleware Chain

```
Request → CORS → JSON Parser → Morgan Logger
  → Route Match
    → protect (JWT token verify → sets req.user)
    → authorize (role check)
    → cacheMiddleware (GET only, node-cache 5min TTL)
    → uploadMiddleware (Multer → Cloudinary)
    → Controller
  → 404 Handler
  → Global Error Handler
```

> [!IMPORTANT]
> **Inconsistency Found**: `authMiddleware.protect` sets `req.user` but some controllers (cab, driver, dashboard) use `req.vendor._id`. The `protect` middleware sets `req.user` NOT `req.vendor`. This means cab/driver/dashboard routes likely fail unless there's a mapping somewhere. The `vendorController` was already fixed to use `req.user.id`.

---

## 7. What the Frontend Needs to Integrate

Based on the backend analysis, the frontend must handle:

| Feature Area | Backend APIs Available | Frontend Pages Needed |
|-------------|----------------------|----------------------|
| **Auth** | register, verify-otp, login | Login, Register, OTP Verification |
| **Dashboard** | super-vendor dashboard | SuperVendor Dashboard, SubVendor Dashboard |
| **Cab Management** | addCab, getMyCabs | Cab List, Add Cab Form |
| **Driver Management** | addDriver (with file upload) | Driver List, Add Driver Form (with file upload) |
| **Document Verification** | uploadDocument + OCR | Document Upload, Verification Status |
| **Delegation** | delegateAccess | Delegation Panel (toggle switches) |
| **Admin Control** | toggleVendorStatus | Vendor Block/Unblock actions |
| **Notifications** | getMyNotifications, markAsRead | Notification Panel/Bell |
| **Payments** | createOrder, verifyPayment | Payment Page (Razorpay integration) |
| **Audit Logs** | Via admin actions | Audit Log viewer |

---

## 8. Ready for Frontend

✅ Backend fully analyzed and understood. I'm now ready for your frontend requirements/folder structure. I'll build a **premium Space Dark + Golden UI** with:
- 3D animations & special effects
- Glassmorphism + glowing golden borders
- Framer Motion staggered transitions
- Role-based dynamic dashboards
- Complete API integration layer
