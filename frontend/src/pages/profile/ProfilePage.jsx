import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Shield, Sparkles, CalendarDays,
  Building2, FileCheck2, Hash, CheckCircle2, Clock, XCircle,
  KeyRound, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatDate } from '../../utils/helpers';
import { getInitials } from '../../utils/helpers';

// ─── Tiny helpers ─────────────────────────────────────────────────
const ROLE_BADGE = {
  Admin:          { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20' },
  SuperVendor:    { bg: 'bg-gold-500/10',    text: 'text-gold-400',    border: 'border-gold-500/20' },
  RegionalVendor: { bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20' },
  CityVendor:     { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/20' },
  LocalVendor:    { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

const APPROVAL_CONFIG = {
  approved: { icon: CheckCircle2, label: 'Approved', cls: 'text-emerald-400' },
  pending:  { icon: Clock,        label: 'Pending',  cls: 'text-amber-400'   },
  rejected: { icon: XCircle,      label: 'Rejected', cls: 'text-red-400'     },
};

const InfoRow = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={13} className="text-gray-500" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-gray-200 truncate ${mono ? 'font-mono text-xs text-gray-400' : ''}`}>
        {value || <span className="text-gray-600 font-normal italic">N/A</span>}
      </p>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, iconBg = 'bg-gold-500/10', iconBorder = 'border-gold-500/20', iconColor = 'text-gold-400' }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className={`p-2.5 rounded-xl ${iconBg} border ${iconBorder}`}>
      <Icon className={iconColor} size={18} />
    </div>
    <div>
      <h2 className="text-sm font-display font-bold text-white tracking-wide">{title}</h2>
      {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
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
        if (!cancelled && data.success && data.data) {
          setProfile(data.data);
        }
      } catch {
        if (!cancelled) toast.error('Could not load profile');
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
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
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setChangingPassword(false);
    }
  };

  const roleBadge = ROLE_BADGE[profile?.role] || ROLE_BADGE.LocalVendor;
  const approvalCfg = APPROVAL_CONFIG[profile?.approvalStatus] || APPROVAL_CONFIG.pending;
  const ApprovalIcon = approvalCfg.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  return (
    <div className="p-6 md:p-10 relative min-h-full">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] right-[5%] w-[520px] h-[520px] bg-gold-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-25%] left-[0%] w-[480px] h-[480px] bg-indigo-900/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* ── Page Header ─────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full mb-4">
          <Sparkles className="text-gold-400" size={13} />
          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em]">Account Settings</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wide text-white">
              Profile &amp; <span className="text-gold-gradient">Settings</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-xl">
              Your account details, compliance status, and security settings.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
            <Shield size={12} className="text-gold-500/80" />
            Encrypted session
          </div>
        </div>
      </motion.header>

      {loadingProfile ? (
        <div className="relative z-10 flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin" />
          <p className="text-sm text-gray-600 tracking-widest uppercase font-medium">Loading your profile…</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl"
        >
          {/* ── Left column: Avatar + Account Details ─────── */}
          <div className="lg:col-span-1 flex flex-col gap-5">

            {/* Avatar card */}
            <motion.div
              variants={cardVariants}
              className="glass-panel-strong rounded-2xl p-6 flex flex-col items-center text-center gap-3 golden-glow border border-gold-500/10"
            >
              <div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400/30 to-gold-700/15 border-2 border-gold-500/30
                            flex items-center justify-center shadow-[0_0_30px_rgba(212,168,83,0.15)] mt-1"
              >
                <span className="text-2xl font-bold font-display text-gold-400">
                  {getInitials(profile?.name)}
                </span>
              </div>
              <div>
                <p className="text-base font-display font-bold text-white tracking-wide">{profile?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{profile?.email}</p>
              </div>
              {/* Role badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}>
                <Shield size={10} />
                {profile?.role?.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              {/* Verification dot */}
              <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${profile?.isEmailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${profile?.isEmailVerified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {profile?.isEmailVerified ? 'Email Verified' : 'Email Unverified'}
              </div>
            </motion.div>

            {/* Section 1: Account Details */}
            <motion.section
              variants={cardVariants}
              className="glass-panel rounded-2xl p-5 border border-white/[0.05] backdrop-blur-sm"
            >
              <SectionHeader icon={User} title="Account Details" subtitle="Identity & membership info" />
              <InfoRow icon={User} label="Full Name" value={profile?.name} />
              <InfoRow icon={Mail} label="Email" value={profile?.email} />
              <InfoRow icon={Shield} label="Role" value={profile?.role?.replace(/([A-Z])/g, ' $1').trim()} />
              <InfoRow icon={CalendarDays} label="Member Since" value={formatDate(profile?.createdAt)} />
            </motion.section>
          </div>

          {/* ── Right column: Compliance + Password ──────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Section 2: Business / Compliance */}
            <motion.section
              variants={cardVariants}
              className="glass-panel rounded-2xl p-6 border border-white/[0.05] backdrop-blur-sm"
            >
              <SectionHeader
                icon={Building2}
                title="Business & Compliance"
                subtitle="Your tier position and document approval status"
                iconBg="bg-violet-500/10"
                iconBorder="border-violet-500/20"
                iconColor="text-violet-400"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {/* Doc Approval Status — special treatment */}
                <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] sm:col-span-2">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 size={13} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-1">
                      Document Approval
                    </p>
                    <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${approvalCfg.cls}`}>
                      <ApprovalIcon size={15} />
                      {approvalCfg.label}
                    </span>
                  </div>
                </div>

                <InfoRow
                  icon={Hash}
                  label="Vendor ID"
                  value={profile?._id}
                  mono
                />
                <InfoRow
                  icon={Hash}
                  label="Parent Vendor ID"
                  value={profile?.parentId || profile?.parentVendor || null}
                  mono
                />
                <InfoRow
                  icon={Building2}
                  label="Can Onboard Cabs"
                  value={profile?.delegatedRights?.canOnboardCab ? 'Enabled' : 'Disabled'}
                />
                <InfoRow
                  icon={Building2}
                  label="Can Onboard Drivers"
                  value={profile?.delegatedRights?.canOnboardDriver ? 'Enabled' : 'Disabled'}
                />
              </div>

              <Link
                to="/documents"
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-gold-400 hover:text-gold-300 uppercase tracking-wider transition-colors"
              >
                View Documents <ChevronRight size={13} />
              </Link>
            </motion.section>

            {/* Section 3: Change Password */}
            <motion.section
              variants={cardVariants}
              className="glass-panel rounded-2xl p-6 border border-white/[0.05] backdrop-blur-sm"
            >
              <SectionHeader
                icon={KeyRound}
                title="Change Password"
                subtitle="Use at least 8 characters"
                iconBg="bg-white/[0.04]"
                iconBorder="border-white/[0.08]"
                iconColor="text-gold-400/90"
              />

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                <Button type="submit" variant="ghost" fullWidth loading={changingPassword}>
                  Update Password
                </Button>
              </form>
            </motion.section>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
