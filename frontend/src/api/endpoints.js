// Base URL for the backend API
const BASE = '/api';

const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${BASE}/auth/register`,
    VERIFY_OTP: `${BASE}/auth/verify-otp`,
    LOGIN: `${BASE}/auth/login`,
    FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE}/auth/reset-password`,
  },

  // Vendors
  VENDORS: {
    ME: `${BASE}/vendors/me`,
    ME_PASSWORD: `${BASE}/vendors/me/password`,
    DELEGATE: (id) => `${BASE}/vendors/delegate/${id}`,
  },

  // Cabs
  CABS: {
    ADD: `${BASE}/cabs`,
    GET_MY: `${BASE}/cabs`,
  },

  // Drivers
  DRIVERS: {
    ADD: `${BASE}/drivers`,
    GET_MY: `${BASE}/drivers`,
  },

  // Dashboard
  DASHBOARD: {
    SUPER_VENDOR: `${BASE}/dashboard/super-vendor`,
  },

  // Documents
  DOCUMENTS: {
    UPLOAD: `${BASE}/documents/upload`,
    GET_MY: `${BASE}/documents`,
  },

  // Notifications
  NOTIFICATIONS: {
    GET_MY: `${BASE}/notifications`,
    MARK_READ: (id) => `${BASE}/notifications/${id}/read`,
    MARK_ALL_READ: `${BASE}/notifications/read-all`,
  },

  // Admin
  ADMIN: {
    TOGGLE_VENDOR: `${BASE}/admin/toggle-vendor`,
    AUDIT_LOGS: `${BASE}/admin/audit-logs`,
    GET_VENDORS: `${BASE}/admin/vendors`,
  },

  // Payments
  PAYMENTS: {
    CREATE_ORDER: `${BASE}/payments/create-order`,
    VERIFY: `${BASE}/payments/verify`,
  },
};

export default ENDPOINTS;
