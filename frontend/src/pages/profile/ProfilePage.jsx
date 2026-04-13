import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProfilePage = () => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await API.get(ENDPOINTS.VENDORS.ME);
        if (cancelled || !data.success || !data.data) return;
        setProfileForm({
          name: data.data.name || '',
          email: data.data.email || '',
        });
      } catch {
        if (!cancelled) toast.error('Could not load profile');
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await API.patch(ENDPOINTS.VENDORS.ME, {
        name: profileForm.name,
        email: profileForm.email,
      });
      if (data.success) {
        toast.success(data.message || 'Profile updated');
        if (data.data) {
          setProfileForm({
            name: data.data.name || '',
            email: data.data.email || '',
          });
        }
        if (data.emailVerificationRequired) {
          toast('Check your inbox for the verification OTP.', { icon: '📧' });
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      const { data } = await API.put(ENDPOINTS.VENDORS.ME_PASSWORD, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (data.success) {
        toast.success(data.message || 'Password updated');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="p-6 md:p-10 relative">
      <div className="absolute top-[-20%] right-[5%] w-[520px] h-[520px] bg-gold-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-25%] left-[0%] w-[480px] h-[480px] bg-indigo-900/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full mb-4">
          <Sparkles className="text-gold-400" size={14} />
          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em]">
            Account
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wide text-white">
              Profile & <span className="text-gold-gradient">Settings</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-xl">
              Update how you appear in FleetMaster and keep your password secure.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
            <Shield size={12} className="text-gold-500/80" />
            Encrypted session
          </div>
        </div>
      </motion.header>

      {loadingProfile ? (
        <div className="relative z-10 flex items-center justify-center py-24 text-gray-500 text-sm">
          Loading profile…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl relative z-10">
          {/* Profile details */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-panel-strong rounded-2xl p-6 md:p-8 border-gold-500/15 golden-glow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                <User className="text-gold-400" size={20} />
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-white tracking-wide">
                  Profile details
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Name and sign-in email
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <Input
                label="Full name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Your name"
                required
                icon={User}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="you@company.com"
                required
                icon={Mail}
              />
              <p className="text-[11px] text-gray-500 leading-relaxed -mt-1">
                If you change your email, we will send a verification OTP to the new address.{' '}
                <Link
                  to="/verify-otp"
                  state={{ email: profileForm.email }}
                  className="text-gold-400 hover:text-gold-300 font-medium"
                >
                  Verify here
                </Link>
                .
              </p>
              <Button type="submit" fullWidth loading={savingProfile}>
                Save profile
              </Button>
            </form>
          </motion.section>

          {/* Password */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="glass-panel rounded-2xl p-6 md:p-8 glass-panel-hover transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <Lock className="text-gold-400/90" size={20} />
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-white tracking-wide">
                  Change password
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Use at least 8 characters
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <Input
                label="Current password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                icon={Lock}
              />
              <Input
                label="New password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                icon={Lock}
              />
              <Input
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                icon={Lock}
              />
              <Button type="submit" variant="ghost" fullWidth loading={changingPassword}>
                Update password
              </Button>
            </form>
          </motion.section>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
