import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Zap, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StarField from '../../components/layout/StarField';
import { ROLE_OPTIONS } from '../../utils/constants';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    parentVendor: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.role) newErrors.role = 'Please select a role';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        parentVendor: form.parentVendor || undefined,
      };

      const { data } = await API.post(ENDPOINTS.AUTH.REGISTER, payload);

      if (data.success) {
        toast.success(data.message || 'Registration successful! Check your email for OTP.');
        navigate('/verify-otp', { state: { email: form.email } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputAnim = (delay) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay, duration: 0.4 },
  });

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 relative overflow-hidden">
      <StarField />
      <div className="absolute top-[-15%] right-[-5%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-panel-strong rounded-3xl p-8 md:p-10 golden-glow">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-4">
              <Zap className="text-gold-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-wider text-gold-gradient">
              JOIN FLEETMASTER
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Register as a vendor to manage your fleet
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div {...inputAnim(0.2)}>
              <Input label="Full Name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} icon={User} error={errors.name} required />
            </motion.div>

            <motion.div {...inputAnim(0.25)}>
              <Input label="Email Address" type="email" name="email" placeholder="vendor@company.com" value={form.email} onChange={handleChange} icon={Mail} error={errors.email} required />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div {...inputAnim(0.3)}>
                <Input label="Password" type="password" name="password" placeholder="Min. 6 chars" value={form.password} onChange={handleChange} icon={Lock} error={errors.password} required />
              </motion.div>
              <motion.div {...inputAnim(0.35)}>
                <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} icon={Lock} error={errors.confirmPassword} required />
              </motion.div>
            </div>

            <motion.div {...inputAnim(0.4)}>
              <Input
                label="Vendor Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                icon={Building2}
                options={ROLE_OPTIONS}
                placeholder="Select your role"
                error={errors.role}
                required
              />
            </motion.div>

            <motion.div {...inputAnim(0.45)}>
              <Input label="Parent Vendor ID (Optional)" name="parentVendor" placeholder="Leave empty if Super Vendor" value={form.parentVendor} onChange={handleChange} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="pt-2">
              <Button type="submit" variant="gold" fullWidth loading={loading}>
                <UserPlus size={18} />
                Create Account
              </Button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account? <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;