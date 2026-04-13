import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Zap, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StarField from '../../components/layout/StarField';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      if (data.success) {
        toast.success(data.message || 'Check your email for reset instructions.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 relative overflow-hidden">
      <StarField />

      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel-strong rounded-3xl p-8 md:p-10 golden-glow">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-4">
              <KeyRound className="text-gold-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-wider text-gold-gradient">
              FORGOT PASSWORD
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your email and we will send you a reset link
            </p>
          </motion.div>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button type="submit" variant="gold" fullWidth loading={loading}>
                <Zap size={18} />
                Send reset link
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm">
              <Link
                to="/login"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                Back to login
              </Link>
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-gray-600 text-xs mt-6"
        >
          FleetMaster SaaS — AI-Powered Fleet Management
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
