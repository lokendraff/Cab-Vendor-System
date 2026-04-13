<div align="center">

# 🚕 FLEETMASTER

### Enterprise Fleet & Vendor Management SaaS

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://www.mongodb.com/mern-stack)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Academic-gold?style=for-the-badge)](./LICENSE)

**A production-grade Cab Vendor & Driver Onboarding platform with N-level vendor hierarchy, AI-powered document verification, Razorpay monetization, and a "Space Dark + Golden" Glassmorphism UI.**

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [Project Working Flow](#-project-working-flow)
- [Architecture Trade-offs & Complexities](#-architecture-trade-offs--complexities)
- [Local Setup](#-local-setup)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)

---

## 🌐 Overview

**FleetMaster** is a full-stack SaaS application designed for large-scale cab fleet operations. It enables multi-level vendor organizations to onboard vehicles, verify driver documents using AI (Tesseract OCR), manage hierarchical access control, and process subscription payments—all within a premium, responsive UI built with the **"Space Dark + Golden" Glassmorphism** design system.

The platform addresses real-world challenges in fleet management:

- **Operational Bottlenecks** → Solved via N-level vendor delegation
- **Document Fraud** → Mitigated via AI-powered OCR verification
- **Compliance Tracking** → Automated via CRON-based expiry alerts
- **Unauthorized Access** → Prevented via strict 4-tier RBAC with delegation rights enforcement

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI with hooks |
| **Vite** | Lightning-fast HMR & optimized builds |
| **Tailwind CSS** | Utility-first styling with custom design tokens |
| **Framer Motion** | Fluid micro-animations & page transitions |
| **Axios** | HTTP client with JWT interceptor |
| **React Router v6** | Nested routing with role-based guards |
| **React Hot Toast** | Toast notification system |
| **Lucide React** | Premium icon library |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js 18+** | Runtime environment |
| **Express.js** | RESTful API framework |
| **MongoDB Atlas** | NoSQL database (Mongoose ODM) |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcrypt.js** | Password hashing (salt rounds: 10) |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | Brute-force & DDoS protection |
| **node-cache** | In-memory caching (Cache-Aside pattern) |
| **Tesseract.js** | AI/OCR document verification engine |
| **Cloudinary** | Cloud-based document & image storage |
| **Nodemailer** | SMTP email service (OTP & password reset) |
| **Razorpay** | Payment gateway integration |
| **node-cron** | Scheduled background jobs |
| **Morgan** | HTTP request logger |

---

## ✨ Core Features

### 🔐 Authentication & Security
- Email + OTP based vendor registration
- JWT authentication with strict environment-only secrets
- Password reset via secure tokenized email links
- **Blocked vendor detection** — suspended accounts are rejected at middleware level
- Rate limiting on auth routes (10 req/15 min) and API routes (100 req/15 min)
- Helmet HTTP headers for XSS, clickjacking, and MIME-sniffing protection

### 👥 N-Level Vendor Hierarchy (Strict RBAC)
- **4-tier role system**: `SuperVendor → RegionalVendor → CityVendor → LocalVendor`
- Parent-child relationships via self-referencing MongoDB documents
- **Delegation Rights**: SuperVendors can grant/revoke specific permissions:
  - `canOnboardCab` — Permission to add new vehicles
  - `canOnboardDriver` — Permission to register drivers
  - `canProcessPayments` — Permission to handle billing
- Delegation is **enforced at the controller level** — not just stored

### 🚗 Cab & Driver Onboarding
- Full vehicle onboarding: registration number, model, seating capacity, fuel type
- Driver registration with mandatory document uploads (DL, RC, Permit)
- **Cab-Driver Assignment API** (`PUT /api/cabs/:id/assign-driver`)
- Duplicate prevention via unique constraints on registration numbers and contact numbers

### 🤖 AI Document Verification (Tesseract OCR)
- Automated Driving License verification using Tesseract.js
- DL number regex extraction: `/[A-Z]{2}[0-9]{2}\s?[0-9]{11}/i`
- Auto-verified documents marked as `isVerified: true`
- Non-matching documents flagged for `Manual Verification Required`

### 📊 Centralized Dashboard
- **SuperVendor view**: Sub-vendor count, fleet status (active/inactive), pending document verifications
- **SubVendor view**: Own cab count, personal document compliance status
- Real-time KPIs with animated network visualization

### 💳 Razorpay Payment Integration
- Order creation with server-side amount validation
- Cryptographic signature verification (`HMAC-SHA256`)
- Transaction tracking with status lifecycle: `Pending → Completed / Failed`

### 🔔 Notification & Monitoring System
- In-app notification center with read/unread state management
- Automated alerts on vendor block/unblock actions
- **CRON Job**: Daily scan for expired documents → auto-unverify + vendor alert
- Audit logging for all administrative actions with full traceability

### ⚡ Caching Layer
- In-memory cache on dashboard GET routes using `node-cache`
- Cache-Aside pattern with 5-minute TTL
- Automatic cache bypass for non-GET requests

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLEETMASTER ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐     ┌──────────────┐     ┌───────────────────┐   │
│   │  React SPA  │────▶│  Express API │────▶│  MongoDB Atlas    │   │
│   │  (Vite)     │◀────│  (REST)      │◀────│  (Mongoose ODM)   │   │
│   └─────────────┘     └──────┬───────┘     └───────────────────┘   │
│                              │                                      │
│                    ┌─────────┼─────────┐                            │
│                    │         │         │                             │
│              ┌─────▼───┐ ┌──▼──┐ ┌───▼────┐                       │
│              │Cloudinary│ │ OCR │ │Razorpay│                       │
│              │ Storage  │ │ AI  │ │Payment │                       │
│              └─────────┘ └─────┘ └────────┘                       │
│                                                                     │
│   Security Layer: Helmet │ Rate Limiter │ JWT │ RBAC │ Delegation  │
│   Cache Layer:   node-cache (Cache-Aside, TTL: 300s)               │
│   Jobs Layer:    node-cron (Daily Document Expiry Scanner)         │
│   Monitoring:    Morgan Logger │ Audit Logs │ Notifications        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Project Working Flow

```
Step 1: REGISTRATION & AUTHENTICATION
  ├── Vendor registers with name, email, password, role
  ├── System sends 6-digit OTP via email (Nodemailer)
  ├── Vendor verifies OTP → account activated
  └── Login returns JWT token (valid 24h)

Step 2: ROLE-BASED DASHBOARD ACCESS
  ├── SuperVendor → Full command center (sub-vendors, fleet KPIs, compliance)
  └── SubVendor   → Personal fleet view (own cabs, documents, payments)

Step 3: CAB ONBOARDING
  ├── Vendor fills cab details (reg. number, model, capacity, fuel type)
  ├── System checks delegation rights (canOnboardCab)
  ├── Duplicate check on registration number
  └── Cab created and linked to vendor

Step 4: DRIVER ONBOARDING + AI VERIFICATION
  ├── Vendor uploads driver info + documents (DL, RC, Permit)
  ├── System checks delegation rights (canOnboardDriver)
  ├── DL image → Tesseract OCR → regex match → auto-verify or flag
  ├── Documents stored on Cloudinary with expiry tracking
  └── Driver assigned to cab via PUT /api/cabs/:id/assign-driver

Step 5: COMPLIANCE MONITORING (Automated)
  ├── CRON job runs daily at midnight
  ├── Scans all verified documents for expiry
  ├── Expired docs → unverified + vendor notified
  └── SuperVendor can block non-compliant sub-vendors

Step 6: SUBSCRIPTION PAYMENTS
  ├── Vendor initiates payment → Razorpay order created
  ├── Client-side checkout widget processes payment
  ├── Server verifies signature (HMAC-SHA256)
  └── Transaction status updated: Pending → Completed/Failed

Step 7: ADMINISTRATIVE OVERSIGHT
  ├── SuperVendor can block/unblock sub-vendors
  ├── All admin actions logged in AuditLog collection
  ├── Affected vendors receive in-app notifications
  └── Delegation rights can be modified at any time
```

---

## 🧠 Architecture Trade-offs & Complexities

### 1. Time & Space Complexity Analysis

| Operation | Time Complexity | Space Complexity | Notes |
|---|---|---|---|
| **Tesseract OCR scan** | `O(W × H)` | `O(W × H)` | W = image width, H = height in pixels. Full rasterization of document image. First invocation cold-starts the WASM engine (~10-15s), subsequent scans are faster. |
| **DL regex extraction** | `O(N)` | `O(1)` | N = length of extracted text. Single-pass regex match. |
| **BCrypt password hash** | `O(2^cost)` | `O(1)` | Cost factor = 10 (1024 iterations). Deliberate slowness for brute-force resistance. |
| **JWT verify** | `O(1)` | `O(1)` | HMAC-SHA256 signature check. Stateless — no DB lookup required. |
| **Dashboard aggregation** | `O(V + C + D)` | `O(V + D)` | V = sub-vendors, C = cabs, D = drivers. Parallelized via `Promise.all`. |
| **Document expiry CRON** | `O(D)` | `O(D)` | D = verified documents. Daily batch scan with indexed query on `expiryDate`. |
| **Cache lookup** | `O(1)` | `O(K × S)` | K = cached keys, S = avg response size. Hash-map backed, TTL-evicted. |

### 2. Caching Strategy — Cache-Aside Pattern

```
Client Request ──▶ Cache Check
                      │
              ┌───────┴───────┐
              │               │
          HIT ▼           MISS ▼
       Return cached    Query MongoDB
       response         ──▶ Store in cache
                        ──▶ Return response
```

- **Implementation**: `node-cache` middleware on SuperVendor dashboard route
- **TTL**: 300 seconds (5 minutes) — balances freshness vs. DB load
- **Key Strategy**: `${route}_${vendorId}` — ensures per-user cache isolation
- **Eviction**: Automatic TTL-based expiry. Non-GET requests bypass cache entirely.
- **Trade-off**: Accepts up to 5 minutes of stale data on the dashboard in exchange for significantly reduced MongoDB query load during peak usage.

### 3. Design Trade-offs

| Decision | Chosen Approach | Alternative Considered | Rationale |
|---|---|---|---|
| **Database** | MongoDB (NoSQL) | PostgreSQL (SQL) | The N-level vendor hierarchy requires flexible parent-child relationships via self-referencing documents. A SQL approach would need recursive CTEs or adjacency lists, adding query complexity. MongoDB's document model naturally supports this with `parentVendor` references and `populate()`. |
| **Auth Strategy** | JWT (Stateless) | Session-based | JWTs eliminate server-side session storage, enabling horizontal scaling. Trade-off: tokens cannot be individually revoked (mitigated by 24h expiry + `isActive` check on every request). |
| **Document Storage** | Cloudinary (Cloud) | Local filesystem | Cloud storage ensures CDN-backed delivery, automatic format optimization, and zero local disk dependency. Trade-off: adds external dependency and network latency on upload. |
| **OCR Engine** | Tesseract.js (WASM) | Google Vision API | Tesseract runs locally with zero API costs and no external dependency. Trade-off: lower accuracy on poor-quality scans (mitigated by `Manual Verification Required` fallback). |
| **Caching** | node-cache (In-process) | Redis | node-cache is zero-dependency and sufficient for single-server deployment. Trade-off: cache is lost on restart and not shared across processes (acceptable for MVP). Redis would be the upgrade path for multi-instance production. |
| **Delegation Model** | Schema-level flags | Dynamic permission tables | Static boolean flags (`canOnboardCab`, `canOnboardDriver`, `canProcessPayments`) on the Vendor schema provide fast O(1) checks without joins. Trade-off: adding new permission types requires a schema migration. Chosen for MVP stability and predictable enforcement. |

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account
- **Gmail App Password** (for Nodemailer SMTP)
- **Razorpay** test/live API keys

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Cab-Vendor-System.git
cd Cab-Vendor-System
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Fill in your credentials in .env
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create environment file
cp .env.example .env
# Fill in your credentials in .env
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (Port 5000)
cd backend
node server.js

# Terminal 2 — Frontend (Port 5173)
cd frontend
npm run dev
```

### 5. Access the Application

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |
| API Health Check | `http://localhost:5000/` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new vendor | ❌ |
| `POST` | `/api/auth/verify-otp` | Verify email OTP | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT | ❌ |
| `POST` | `/api/auth/forgot-password` | Request password reset | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password with token | ❌ |

### Vendors
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/vendors/me` | Get current vendor profile | 🔒 |
| `PATCH` | `/api/vendors/me` | Update name/email | 🔒 |
| `PUT` | `/api/vendors/me/password` | Change password | 🔒 |
| `PUT` | `/api/vendors/delegate/:id` | Update sub-vendor delegation rights | 🔒 |

### Cabs
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/cabs` | Onboard new cab | 🔒 RBAC |
| `GET` | `/api/cabs` | Get vendor's cabs | 🔒 |
| `PUT` | `/api/cabs/:id/assign-driver` | Assign driver to cab | 🔒 |

### Drivers
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/drivers` | Onboard new driver + docs | 🔒 RBAC |
| `GET` | `/api/drivers` | Get vendor's drivers | 🔒 |

### Documents
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/documents` | Get vendor's driver documents | 🔒 |
| `POST` | `/api/documents/upload` | Upload & OCR verify document | 🔒 |

### Admin (SuperVendor Only)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/admin/vendors` | Get all sub-vendors | 🔒 SuperVendor |
| `POST` | `/api/admin/toggle-vendor` | Block/unblock vendor | 🔒 SuperVendor |
| `GET` | `/api/admin/audit-logs` | View audit trail | 🔒 SuperVendor |

### Dashboard
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard/super-vendor` | SuperVendor KPI dashboard | 🔒 SuperVendor + Cached |

### Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/payments/create-order` | Create Razorpay order | 🔒 |
| `POST` | `/api/payments/verify` | Verify payment signature | 🔒 |

### Notifications
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/notifications` | Get vendor's notifications | 🔒 |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read | 🔒 |
| `PUT` | `/api/notifications/read-all` | Mark all as read | 🔒 |

---

## 📁 Project Structure

```
Cab-Vendor-System/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, OTP, Password Reset
│   │   ├── vendorController.js      # Profile, Delegation
│   │   ├── cabController.js         # Cab CRUD, Driver Assignment
│   │   ├── driverController.js      # Driver Onboarding
│   │   ├── document.controller.js   # Document Upload + OCR
│   │   ├── adminController.js       # Block/Unblock, Audit Logs
│   │   ├── dashboardController.js   # SuperVendor KPIs
│   │   ├── paymentController.js     # Razorpay Orders & Verification
│   │   └── notificationController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT + isActive + RBAC
│   │   ├── cacheMiddleware.js       # Cache-Aside (node-cache)
│   │   ├── errorHandler.js          # Global error handler
│   │   └── uploadMiddleware.js      # Cloudinary + Multer
│   ├── models/
│   │   ├── Vendor.js                # N-level hierarchy + delegation
│   │   ├── Cab.js                   # Vehicle schema
│   │   ├── Driver.js                # Driver + embedded documents
│   │   ├── Document.js              # Standalone doc verification
│   │   ├── AuditLog.js              # Admin action trail
│   │   ├── Notification.js          # In-app alerts
│   │   └── Transaction.js           # Payment records
│   ├── routes/                      # Express route definitions
│   ├── services/
│   │   ├── ocr.service.js           # Tesseract AI engine
│   │   ├── email.service.js         # Nodemailer SMTP
│   │   └── notification.service.js  # Notification creator
│   ├── jobs/
│   │   └── documentExpiryJob.js     # CRON: daily compliance scan
│   ├── server.js                    # Express app entry point
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios instance + endpoints
│   │   ├── components/              # Reusable UI (Layout, Sidebar, Topbar)
│   │   ├── context/                 # AuthContext (React Context API)
│   │   ├── hooks/                   # useAuth custom hook
│   │   ├── pages/
│   │   │   ├── auth/                # Login, Register, OTP, Password Reset
│   │   │   ├── admin/               # VendorList, AuditLogs
│   │   │   ├── cabs/                # AddCab, CabList
│   │   │   ├── drivers/             # AddDriver, DriverList
│   │   │   ├── documents/           # DocumentList + Verification Center
│   │   │   ├── payments/            # Razorpay Checkout
│   │   │   ├── profile/             # ProfilePage
│   │   │   └── notifications/       # NotificationsPage
│   │   ├── routes/                  # AppRoutes, ProtectedRoute, RoleBasedRoute
│   │   ├── utils/                   # Helper functions
│   │   ├── Dashboard.jsx            # Main dashboard with KPIs
│   │   ├── App.jsx                  # Root component
│   │   └── index.css                # Global styles + design tokens
│   ├── .env.example                 # Environment template
│   └── package.json
│
└── README.md                        # ← You are here
```

---

<div align="center">

**Built with ❤️ using the MERN Stack**

*FleetMaster — Enterprise Fleet Management, Simplified.*

</div>
