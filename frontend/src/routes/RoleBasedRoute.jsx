import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * RoleBasedRoute — Restricts access to specific vendor roles
 * Use: <RoleBasedRoute roles={['SuperVendor']}>...</RoleBasedRoute>
 */
const RoleBasedRoute = ({ children, roles = [] }) => {
  const { role } = useAuth();

  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
