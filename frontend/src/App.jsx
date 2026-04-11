import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Bookings from './pages/Bookings';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/vendors"   element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
          <Route path="/vehicles"  element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
          <Route path="/drivers"   element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
          <Route path="/bookings"  element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/billing"   element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a2236',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0a0e1a' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0a0e1a' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
