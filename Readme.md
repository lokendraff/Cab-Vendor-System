<div align="center">

# 🚕 FLEETMASTER

### Enterprise Fleet & Vendor Management SaaS

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://www.mongodb.com/mern-stack)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Academic-gold?style=for-the-badge)](./LICENSE)

**A production-grade Cab Vendor & Driver Onboarding platform with N-level vendor hierarchy, AI-powered document verification, and Razorpay monetization. Features a premium "Space Dark + Golden" Glassmorphism UI.**

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Core Features & Flow](#-core-features--flow)
- [System Architecture](#-system-architecture)
- [Architecture Trade-offs & Complexities](#-architecture-trade-offs--complexities)
- [Local Setup](#-local-setup)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)

---

## 🌐 Overview

**FleetMaster** is a full-stack MERN SaaS application designed for large-scale cab fleet operations. It enables multi-level vendor organizations to onboard vehicles, verify driver documents using AI, manage hierarchical access control, and process subscription payments. The platform is designed with a deeply immersive, premium "Space Dark + Golden" visual language.

---

## 🛠 Tech Stack

### Frontend
- **React 18 & Vite** (Lightning-fast development)
- **Tailwind CSS** (Utility-first styling with custom spacing/colors)
- **Framer Motion** (Fluid micro-animations)
- **Axios** (HTTP client with interceptors)

### Backend
- **Node.js 18+ & Express.js**
- **MongoDB Atlas & Mongoose ODM**
- **JWT (jsonwebtoken) & bcrypt.js** 
- **Helmet & express-rate-limit** (Security)
- **node-cache** (Caching Layer)
- **Tesseract.js** (AI/OCR Document Verification)
- **Cloudinary** (Cloud Storage)
- **Razorpay** (Payment Gateway)

---

## ✨ Core Features & Flow

### User Journey
1. **Registration**: Vendors sign up and receive a secure OTP via email.
2. **Access Control**: Role-based access ensures SuperVendors have a master view, while sub-vendors only see their delegated subset.
3. **Onboarding**: Sub-vendors can onboard drivers and cabs (if delegated rights permit).
4. **AI Document Verification**: Uploaded driving licenses are processed instantly by Tesseract OCR to flag expired or invalid documents.
5. **Monetization**: Razorpay securely powers subscriptions directly within the app.

### Strict 4-Level RBAC
- **4-tier role system**: `SuperVendor → RegionalVendor → CityVendor → LocalVendor`
- SuperVendors can grant/revoke exact permissions (e.g., `canOnboardCab`, `canProcessPayments`).

---

## 🧠 Architecture Trade-offs & Complexities

### 1. Time & Space Complexity of OCR
- **Tesseract.js Execution**: `O(W × H)` time/space complexity per image (W = width, H = height). Tesseract must fully load the WASM worker and array buffers into memory. This is offset by deferring verification to background requests to ensure the UI remains non-blocking for file uploads.

### 2. Caching Strategy
- **Cache-Aside Pattern**: `node-cache` shields the MongoDB database on high-traffic GET endpoints (e.g., the SuperVendor dashboard, which aggregates data across sub-vendors).
- Reduces DB latency significantly while maintaining a low memory footprint per instance.

### 3. Systematic Trade-offs
- **DB Model (MongoDB over SQL)**: A NoSQL document store perfectly models the deep N-level parent-child vendor hierarchy, avoiding the recursive CTE complications typical in structured SQL environments.
- **RBAC Delegation (Static Flags over Dynamic Entities)**: Delegation rights are mapped as static boolean fields within the Mongoose Schema rather than a complex graph resolution mechanism. This design choice guarantees MVP stability and guarantees quick `O(1)` permission lookups.

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18.x
- MongoDB Atlas account (or local MongoDB)
- Cloudinary, Gmail (SMTP), and Razorpay accounts

### Run the App

```bash
# 1. Clone the Repo
git clone https://github.com/your-username/Cab-Vendor-System.git
cd Cab-Vendor-System

# 2. Backend Setup
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm start

# 3. Frontend Setup
cd ../frontend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

Visit `http://localhost:5173` to see the Landing Page!
