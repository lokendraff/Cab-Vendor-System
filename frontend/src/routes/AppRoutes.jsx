import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OTPPage from '../pages/auth/OTPPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../Dashboard'; 
import CabListPage from '../pages/cabs/CabListPage';
import AddCabPage from '../pages/cabs/AddCabPage';
import DriverListPage from '../pages/drivers/DriverListPage';
import AddDriverPage from '../pages/drivers/AddDriverPage';
import VendorListPage from '../pages/admin/VendorListPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';
import DocumentListPage from '../pages/documents/DocumentListPage';
import PaymentPage from '../pages/payments/PaymentPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import SubVendorList from '../pages/subvendors/SubVendorList';
import SuperVendorApprovals from '../pages/admin/SuperVendorApprovals';

// Routes & Layout
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Layout & Routes */}
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Common Routes (All Vendors + Admin) */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/cabs" element={<CabListPage />} />
        <Route path="/cabs/add" element={<AddCabPage />} />
        <Route path="/drivers" element={<DriverListPage />} />
        <Route path="/drivers/add" element={<AddDriverPage />} />
        <Route path="/documents" element={<DocumentListPage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* SuperVendor Route: Sub-Vendor Drill-Down */}
        <Route path="/sub-vendors" element={
          <RoleBasedRoute roles={['SuperVendor']}>
            <SubVendorList />
          </RoleBasedRoute>
        } />

        {/* Admin Routes (Admin Only) */}
        <Route path="/admin/vendors" element={
          <RoleBasedRoute roles={['Admin']}>
            <VendorListPage />
          </RoleBasedRoute>
        } />
        <Route path="/admin/audit" element={
          <RoleBasedRoute roles={['Admin']}>
            <AuditLogsPage />
          </RoleBasedRoute>
        } />
        {/* Admin: SuperVendor Approvals */}
        <Route path="/admin/approvals" element={
          <RoleBasedRoute roles={['Admin']}>
            <SuperVendorApprovals />
          </RoleBasedRoute>
        } />
      </Route>

      {/* Auth Redirects / Landing */}
      <Route path="/dashboard-redirect" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
