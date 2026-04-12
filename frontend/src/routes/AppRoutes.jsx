import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OTPPage from '../pages/auth/OTPPage';
import NotFoundPage from '../pages/NotFoundPage';
import Dashboard from '../Dashboard'; 
import CabListPage from '../pages/cabs/CabListPage';
import AddCabPage from '../pages/cabs/AddCabPage';
import DriverListPage from '../pages/drivers/DriverListPage';
import AddDriverPage from '../pages/drivers/AddDriverPage';

// Routes & Layout
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPPage />} />

      {/* Protected Layout & Routes */}
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/cabs" element={<CabListPage />} />
        <Route path="/cabs/add" element={<AddCabPage />} />
        <Route path="/drivers" element={<DriverListPage />} />
        <Route path="/drivers/add" element={<AddDriverPage />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
