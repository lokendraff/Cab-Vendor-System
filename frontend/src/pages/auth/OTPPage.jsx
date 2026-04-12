import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Button from '../../components/ui/Button';
import StarField from '../../components/layout/StarField';

/**
 * OTP Verification Page — 6-digit input with auto-focus
 * Receives email from RegisterPage via React Router location state
 */
const OTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Redirect if no email in state (direct access attempt)
  useEffect(() => {
    if (!email) {
      toast.error('Please register first to get OTP');
      navigate('/register');
    }
  }, [email, navigate]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow single digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // On backspace, move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post(ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        otp: otpString,
      });

      if (data.success) {
        toast.success(data.message || 'Email verified! You can login now.');
        navigate('/login');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'OTP verification failed';
      toast.error(msg);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4 relative overflow-hidden">
      <StarField />

      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel-strong rounded-3xl p-8 md:p-10 golden-glow">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-4">
              <ShieldCheck className="text-gold-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold font-display tracking-wider text-gold-gradient">
              VERIFY EMAIL
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter the 6-digit code sent to
            </p>
            <p className="text-gold-400 text-sm font-medium mt-1">
              {email}
            </p>
          </motion.div>

          {/* OTP Input Grid */}
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex gap-3 justify-center mb-8"
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="
                    w-12 h-14 text-center text-xl font-bold
                    input-space rounded-xl
                    focus:border-gold-400 focus:shadow-[0_0_15px_rgba(212,168,83,0.2)]
                    transition-all duration-300
                  "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                type="submit"
                variant="gold"
                fullWidth
                loading={loading}
              >
                <ShieldCheck size={18} />
                Verify OTP
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 text-center space-y-2"
          >
            <p className="text-gray-500 text-sm">
              OTP valid for 10 minutes
            </p>
            <p className="text-gray-500 text-sm">
              <Link
                to="/login"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                Back to Login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPPage;
