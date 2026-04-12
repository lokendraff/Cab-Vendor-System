import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Axios instance pre-configured with:
 * - Base URL pointing to the backend
 * - JWT token auto-attached via request interceptor
 * - Global error handling via response interceptor
 */
const API = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 30000, // 30 seconds (OCR can take 10-15s)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach JWT token to every request ──
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor: Handle global errors ──
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    const status = error.response?.status;

    // Handle specific HTTP status codes
    if (status === 401) {
      // Token expired or invalid → force logout
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('vendorId');
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && 
          !window.location.pathname.startsWith('/register') &&
          !window.location.pathname.startsWith('/verify-otp')) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('Access Denied: You do not have permission.');
    } else if (status === 500) {
      toast.error('Server Error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default API;
