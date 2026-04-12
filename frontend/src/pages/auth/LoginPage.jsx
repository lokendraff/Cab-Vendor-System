import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StarField from '../../components/layout/StarField';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post(ENDPOINTS.AUTH.LOGIN, form);

      if (data.success) {
        login(data.token, data.role, data.vendorId);
        toast.success(data.message || 'Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 relative overflow-hidden">
      <StarField />

      {/* Ambient glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-panel-strong rounded-3xl p-8 md:p-10 golden-glow">
          {/* Logo / Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-4">
              <Zap className="text-gold-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-wider text-gold-gradient">
              FLEETMASTER
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to your vendor portal
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="vendor@fleetmaster.com"
                value={form.email}
                onChange={handleChange}
                icon={Mail}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                type="submit"
                variant="gold"
                fullWidth
                loading={loading}
              >
                <LogIn size={18} />
                Sign In
              </Button>
            </motion.div>
          </form>

          {/* Footer Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                Register here
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Bottom branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-gray-600 text-xs mt-6"
        >
          FleetMaster SaaS — AI-Powered Fleet Management
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
