import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

/**
 * AuthProvider — Manages authentication state globally
 * Stores token, role, vendorId in localStorage for persistence
 * Provides login/logout functions to all children via context
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [vendorId, setVendorId] = useState(localStorage.getItem('vendorId') || null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if stored auth is still valid
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedVendorId = localStorage.getItem('vendorId');

    if (storedToken && storedRole && storedVendorId) {
      setToken(storedToken);
      setRole(storedRole);
      setVendorId(storedVendorId);
    }
    setIsLoading(false);
  }, []);

  /**
   * Login — store credentials and update state
   * Called after successful /api/auth/login response
   */
  const login = (tokenValue, roleValue, vendorIdValue) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('role', roleValue);
    localStorage.setItem('vendorId', vendorIdValue);
    setToken(tokenValue);
    setRole(roleValue);
    setVendorId(vendorIdValue);
  };

  /**
   * Logout — clear everything and reset state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('vendorId');
    setToken(null);
    setRole(null);
    setVendorId(null);
  };

  const isAuthenticated = !!token;
  const isSuperVendor = role === 'SuperVendor';

  const value = {
    token,
    role,
    vendorId,
    isAuthenticated,
    isSuperVendor,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
