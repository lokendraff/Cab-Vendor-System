import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, AlertCircle, Mail, CalendarDays,
  CheckCircle2, Loader2, ShieldAlert, Sparkles, Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import { formatDate } from '../../utils/helpers';
import { getInitials } from '../../utils/helpers';

// ─── Approval Badge ────────────────────────────────────────────────
const ApprovalCard = ({ vendor, onApprove, isApproving }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="relative glass-panel-strong rounded-2xl p-6 flex flex-col gap-5 group overflow-hidden
               border border-white/[0.06] hover:border-gold-500/20 transition-all duration-300
               hover:shadow-[0_0_30px_rgba(212,168,83,0.06)]"
  >
    {/* Top shimmer accent */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {/* Ambient background glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.04] rounded-full blur-2xl pointer-events-none" />

    {/* Vendor info */}
    <div className="flex items-start gap-4 relative z-10">
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-base font-bold text-gold-400
                   bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/20
                   shadow-[0_0_15px_rgba(212,168,83,0.12)]"
      >
        {getInitials(vendor.name)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-display font-bold text-white text-base tracking-wide truncate">
          {vendor.name}
        </p>

        {/* Email */}
        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 truncate">
          <Mail size={12} className="shrink-0 text-gray-600" />
          {vendor.email}
        </p>

        {/* Joined */}
        <p className="flex items-center gap-1.5 text-[11px] text-gray-600 mt-1">
          <CalendarDays size={11} className="shrink-0" />
          Joined {formatDate(vendor.createdAt)}
        </p>
      </div>

      {/* Pending badge */}
      <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px]
                       font-bold uppercase tracking-wider border
                       bg-amber-500/10 text-amber-400 border-amber-500/20
                       shadow-[0_0_10px_rgba(245,158,11,0.10)]">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Pending
      </span>
    </div>

    {/* Divider */}
    <div className="h-px bg-white/[0.05] relative z-10" />

    {/* Action */}
    <div className="relative z-10">
      <button
        onClick={() => onApprove(vendor._id, vendor.name)}
        disabled={isApproving}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold
                   tracking-wide uppercase transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                   bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
                   hover:bg-emerald-500/20 hover:border-emerald-500/35
                   hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]
                   active:scale-[0.98]"
      >
        {isApproving ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Approving…
          </>
        ) : (
          <>
            <CheckCircle2 size={15} />
            Approve Documents
          </>
        )}
      </button>
    </div>
  </motion.div>
);

// ─── Empty State ───────────────────────────────────────────────────
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-28 text-center"
  >
    {/* Glowing shield */}
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl scale-150" />
      <div
        className="relative p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5
                    shadow-[0_0_40px_rgba(16,185,129,0.10)]"
      >
        <ShieldCheck className="text-emerald-400" size={44} />
      </div>
    </div>

    <h3 className="text-xl font-display font-bold text-white tracking-wide mb-2">
      All Caught Up!
    </h3>
    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
      There are no SuperVendors with pending document approvals right now. Check back later.
    </p>

    {/* Decorative sparkle */}
    <div className="flex items-center gap-2 mt-6 text-emerald-500/40">
      <Sparkles size={14} />
      <span className="text-xs font-medium tracking-widest uppercase">System Clear</span>
      <Sparkles size={14} />
    </div>
  </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────
const SuperVendorApprovals = () => {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null); // vendorId currently being approved

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get(ENDPOINTS.ADMIN.GET_VENDORS);
      if (data.success) {
        // Filter locally: SuperVendors with pending approvalStatus
        const pending = data.data.filter(
          (v) => v.role === 'SuperVendor' && v.approvalStatus === 'pending'
        );
        setPendingVendors(pending);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendor data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (vendorId, vendorName) => {
    try {
      setApprovingId(vendorId);
      const { data } = await API.put(ENDPOINTS.ADMIN.APPROVE_VENDOR(vendorId));

      if (data.success) {
        toast.success(`✅ ${vendorName} approved successfully!`, {
          style: {
            background: '#0f1117',
            color: '#34d399',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: '12px',
          },
        });
        // Optimistic UI: remove from list without reload
        setPendingVendors((prev) => prev.filter((v) => v._id !== vendorId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed. Please try again.', {
        style: {
          background: '#0f1117',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: '12px',
        },
      });
    } finally {
      setApprovingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="p-6 md:p-10 relative min-h-full">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-500/[0.025] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* ── Page Header ───────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div
            className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20"
            style={{ boxShadow: '0 0 25px rgba(245,158,11,0.10)' }}
          >
            <ShieldAlert className="text-amber-400" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wider uppercase text-gold-gradient">
              SuperVendor Approvals
            </h1>
            <p className="text-sm text-gray-500 font-medium tracking-wide mt-1">
              Review and approve pending SuperVendor document submissions
            </p>
          </div>
        </div>

        {/* Live count chip */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl"
          >
            <Users size={15} className="text-amber-400" />
            <span className="text-sm font-bold text-white">{pendingVendors.length}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Pending
            </span>
            {pendingVendors.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
            )}
          </motion.div>
        )}
      </motion.header>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="text-gold-400 animate-spin" size={36} />
            <p className="text-sm text-gray-500 font-medium tracking-widest uppercase">
              Fetching pending approvals…
            </p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-10 rounded-2xl flex flex-col items-center text-center gap-3"
          >
            <AlertCircle className="text-red-500" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={fetchPending}
              className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
            >
              Retry
            </button>
          </motion.div>
        ) : pendingVendors.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {pendingVendors.map((vendor) => (
                <ApprovalCard
                  key={vendor._id}
                  vendor={vendor}
                  onApprove={handleApprove}
                  isApproving={approvingId === vendor._id}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperVendorApprovals;
