# 🚀 Cab Vendor System — Frontend Implementation Plan

## Goal

Build a **complete, production-grade frontend** for the Cab Vendor Management System with a **Space Dark + Golden UI** theme featuring 3D animations, glassmorphism, glowing golden borders, star-field backgrounds, and Framer Motion transitions. Every backend API must have a corresponding frontend feature.

---

## UI Theme (LOCKED — Do Not Change)

- **Background**: Deep space black (`#0a0a0f`) with animated star particles
- **Primary Accent**: Golden (`#d4a853` → `#f5c842`) with glow effects
- **Secondary Accent**: Deep indigo/purple (`#4f46e5` → `#7c3aed`)
- **Cards**: Glassmorphism — translucent dark panels with golden/indigo border glow
- **Typography**: Inter font, white text with golden highlights
- **Animations**: Framer Motion staggered entries, hover scales, page slide transitions, pulsing glows

---

## Packages to Install

| Package | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing + protected routes |
| `axios` | API calls with interceptors (JWT auto-attach) |
| `react-hot-toast` | Premium toast notifications |
| `recharts` | Dashboard charts & analytics |
| `@react-spring/web` | Physics-based spring animations for 3D effects |

> [!NOTE]
> Existing packages kept: `framer-motion`, `lucide-react`, `tailwindcss v4`, `@tailwindcss/vite`

---

## Frontend Structure

```
frontend/src/
│
├── api/
│   ├── axios.js                    # Axios instance + JWT interceptor + error handler
│   └── endpoints.js                # All backend API endpoint constants
│
├── assets/
│   └── (icons, etc.)
│
├── components/
│   ├── ui/                         # Reusable design system
│   │   ├── Button.jsx              # Golden/ghost/danger variants with glow
│   │   ├── Input.jsx               # Dark glass input with golden focus border
│   │   ├── Modal.jsx               # Glassmorphism modal with backdrop blur
│   │   ├── Card.jsx                # Glass card with golden border glow
│   │   ├── Badge.jsx               # Status badges (active/inactive/blocked/pending)
│   │   ├── Loader.jsx              # Orbital golden spinner animation
│   │   ├── Toggle.jsx              # Golden toggle switch for delegation
│   │   └── FileUpload.jsx          # Drag-and-drop file upload with preview
│   │
│   ├── layout/
│   │   ├── Sidebar.jsx             # Role-based navigation sidebar with golden accents
│   │   ├── TopBar.jsx              # Search bar + notification bell + profile avatar
│   │   ├── StarField.jsx           # Animated space particle background (canvas)
│   │   └── PageTransition.jsx      # Framer Motion page slide wrapper
│   │
│   ├── dashboard/
│   │   ├── StatCard.jsx            # KPI stat card with animated counter + glow
│   │   ├── FleetNetworkViz.jsx     # Animated pulsing network visualization
│   │   ├── ComplianceAlerts.jsx    # Priority verification/alert list
│   │   └── VendorHierarchyTree.jsx # Interactive tree view of N-level hierarchy
│   │
│   ├── tables/
│   │   ├── DataTable.jsx           # Reusable table with search/filter/pagination
│   │   └── TableRow.jsx            # Animated table row with hover effects
│   │
│   └── charts/
│       ├── FleetStatusChart.jsx    # Active/Inactive/Blocked pie chart
│       └── ComplianceTrend.jsx     # Compliance trend line chart
│
├── context/
│   └── AuthContext.jsx             # Auth state, login/logout, token management
│
├── hooks/
│   ├── useAuth.js                  # Auth context consumer hook
│   ├── usePermission.js            # Check delegation rights for conditional rendering
│   └── useApi.js                   # Generic API call hook with loading/error states
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx           # Email + password login → JWT
│   │   ├── RegisterPage.jsx        # Vendor registration form (name, email, pwd, role, parent)
│   │   └── OTPPage.jsx             # 6-digit OTP input + verify → redirect to login
│   │
│   ├── dashboard/
│   │   └── DashboardPage.jsx       # Role-aware: shows Super or Sub vendor dashboard
│   │
│   ├── vendors/
│   │   ├── VendorListPage.jsx      # Sub-vendor list + block/unblock actions
│   │   ├── VendorHierarchyPage.jsx # Visual hierarchy tree
│   │   └── DelegationPage.jsx      # Toggle delegation rights per sub-vendor
│   │
│   ├── cabs/
│   │   ├── CabListPage.jsx         # My cabs table with status filters
│   │   └── AddCabPage.jsx          # Add cab form (reg #, model, fuel, capacity)
│   │
│   ├── drivers/
│   │   ├── DriverListPage.jsx      # Drivers table with compliance status
│   │   └── AddDriverPage.jsx       # Add driver + DL/RC/Permit file upload
│   │
│   ├── documents/
│   │   ├── DocumentUploadPage.jsx  # Upload doc for a driver + OCR trigger
│   │   └── VerificationPage.jsx    # Pending docs queue → approve/reject
│   │
│   ├── notifications/
│   │   └── NotificationsPage.jsx   # All notifications + mark as read
│   │
│   ├── audit/
│   │   └── AuditLogPage.jsx        # Audit log history (block/unblock/approve/reject)
│   │
│   └── NotFoundPage.jsx            # 404 with space theme
│
├── routes/
│   ├── AppRoutes.jsx               # All route definitions
│   ├── ProtectedRoute.jsx          # Redirect to login if not authenticated
│   └── RoleBasedRoute.jsx          # Restrict by vendor role
│
├── utils/
│   ├── helpers.js                  # Date formatting, status colors, etc.
│   └── constants.js                # Role enums, status enums, colors
│
├── App.jsx                         # Root component with Router + AuthProvider
├── main.jsx                        # React DOM render entry
└── index.css                       # Tailwind imports + custom space/glass utilities
```

---

## Requirement → Frontend Mapping

### I. Multi-Level Vendor Hierarchy

| Requirement | Frontend Implementation |
|-------------|----------------------|
| N-Level parent-child hierarchy | `VendorHierarchyPage.jsx` → interactive tree visualization |
| Role-based access management | `RoleBasedRoute.jsx` + `usePermission.js` hook |
| Structured access control | `Sidebar.jsx` shows different nav items per role |

### II. Super Vendor Access & Delegation

| Requirement | Frontend Implementation |
|-------------|----------------------|
| Grant/revoke permissions | `DelegationPage.jsx` → toggle switches per sub-vendor |
| Delegation of authority | `PUT /api/vendors/delegate/:id` called from DelegationPage |
| Controlled delegation rights | Toggle individual permissions: canOnboardCab, canOnboardDriver, canProcessPayments |

### III. Sub-Vendor Fleet & Driver Management

| Requirement | Frontend Implementation |
|-------------|----------------------|
| Vehicle onboarding | `AddCabPage.jsx` → form with reg#, model, capacity, fuel |
| Driver onboarding | `AddDriverPage.jsx` → form + 3 file uploads (DL/RC/Permit) |
| Document upload & verification | `DocumentUploadPage.jsx` → upload with OCR results |
| Expired doc flagging | `DriverListPage.jsx` → red badges on expired docs |

### IV. Super Vendor Complete Control

| Requirement | Frontend Implementation |
|-------------|----------------------|
| Centralized dashboard | `DashboardPage.jsx` → stat cards + charts + alerts |
| Real-time sub-vendor view | `VendorListPage.jsx` → table with status/actions |
| Fleet status (active/inactive) | `CabListPage.jsx` → filtered table + `FleetStatusChart` |
| Pending verifications | `VerificationPage.jsx` → approval queue |
| Override sub-vendor actions | `VendorListPage.jsx` → block/unblock via admin API |
| System-wide analytics | `DashboardPage.jsx` → charts (Recharts) |

### Plus Points Coverage

| Plus Point | Frontend Implementation |
|-----------|----------------------|
| Authentication | JWT in AuthContext, protect/role guards, interceptor auto-attach |
| Error handling | Global axios error interceptor + toast notifications + error boundaries |
| System monitoring | Real-time dashboard metrics from cached API |
| Caching | Backend handles cache; frontend uses optimistic UI updates |
| OOP principles | Component composition, context pattern, hook abstractions |

---

## Backend Bug Fix Required

> [!WARNING]
> The `protect` middleware sets `req.user` but `cabController`, `driverController`, and `dashboardController` reference `req.vendor._id`. Before frontend integration, we need to either:
> - **Option A**: Add `req.vendor = req.user` in the protect middleware (1-line fix)
> - **Option B**: Update all controllers to use `req.user._id`
> 
> I recommend **Option A** — adding one line to `authMiddleware.js` after `req.user` is set.

---

## Build Order (Execution Plan)

### Phase 1 — Foundation
1. Install new packages (react-router-dom, axios, react-hot-toast, recharts)
2. Set up `index.css` with space dark golden design system
3. Create `api/axios.js` + `api/endpoints.js`
4. Create `AuthContext.jsx` + `useAuth.js`
5. Create `StarField.jsx` animated background
6. Create reusable UI components (Button, Input, Card, Modal, Badge, Loader, Toggle, FileUpload)

### Phase 2 — Layout & Navigation
7. Create `Sidebar.jsx` (role-based nav)
8. Create `TopBar.jsx` (search + notifications + profile)
9. Create `DashboardLayout.jsx` (sidebar + topbar + content area)
10. Create `AuthLayout.jsx` (centered glass card + star background)
11. Set up routing (`AppRoutes.jsx`, `ProtectedRoute.jsx`, `RoleBasedRoute.jsx`)

### Phase 3 — Auth Pages
12. `LoginPage.jsx` — email/password → JWT token
13. `RegisterPage.jsx` — vendor registration form
14. `OTPPage.jsx` — 6-digit OTP verification

### Phase 4 — Dashboard
15. `StatCard.jsx` with animated counters
16. `FleetNetworkViz.jsx` animated network
17. `FleetStatusChart.jsx` + `ComplianceTrend.jsx`
18. `DashboardPage.jsx` — role-aware rendering

### Phase 5 — Core Modules
19. `CabListPage.jsx` + `AddCabPage.jsx`
20. `DriverListPage.jsx` + `AddDriverPage.jsx`
21. `DocumentUploadPage.jsx` + `VerificationPage.jsx`
22. `VendorListPage.jsx` + `VendorHierarchyPage.jsx`
23. `DelegationPage.jsx`

### Phase 6 — Admin & Extras
24. `AuditLogPage.jsx`
25. `NotificationsPage.jsx`
26. `NotFoundPage.jsx`

### Phase 7 — Polish
27. Page transitions (Framer Motion AnimatePresence)
28. Responsive design pass
29. Backend bug fix (req.vendor)
30. End-to-end testing

---

## Verification Plan

### Automated
- `npm run dev` — dev server starts without errors
- `npm run build` — production build succeeds

### Browser Testing
- Navigate all routes
- Login/Register flow with OTP
- Role-based sidebar changes
- Add cab / Add driver with file upload
- Dashboard data rendering
- Delegation toggles
- Block/unblock vendor
- Notifications panel
- 404 page

---

## Open Questions

> [!IMPORTANT]
> 1. **Backend `req.vendor` bug**: Should I fix this in the backend as part of this work, or leave it for you?
> 2. **Backend API base URL**: Is the backend currently running on `http://localhost:5000`? I'll configure axios with this.
> 3. **Audit Log GET API**: The backend only has a `POST /api/admin/toggle-vendor` that creates audit logs, but no `GET` endpoint to fetch them. Should I add a GET audit logs route to the backend?
