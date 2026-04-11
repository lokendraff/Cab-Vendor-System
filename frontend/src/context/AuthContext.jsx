import { createContext, useContext, useState, useEffect } from 'react';
import { loginVendor as loginApi, registerVendor as registerApi } from '../api/vendorApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('fc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('fc_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginApi({ email, password });
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      setToken(data.token);
      localStorage.setItem('fc_token', data.token);
      localStorage.setItem('fc_user', JSON.stringify({
        _id: data._id, name: data.name, email: data.email, role: data.role
      }));
      return { success: true };
    } catch (err) {
      if (!err.response) {
        return { success: false, message: 'Cannot connect to server. Please make sure the backend is running on port 5000.' };
      }
      return { success: false, message: err.response?.data?.message || 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await registerApi(formData);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      setToken(data.token);
      localStorage.setItem('fc_token', data.token);
      localStorage.setItem('fc_user', JSON.stringify({
        _id: data._id, name: data.name, email: data.email, role: data.role
      }));
      return { success: true };
    } catch (err) {
      if (!err.response) {
        return { success: false, message: 'Cannot connect to server. Please make sure the backend is running on port 5000.' };
      }
      return { success: false, message: err.response?.data?.message || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fc_token');
    localStorage.removeItem('fc_user');
  };

  const isRole = (...roles) => roles.includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
