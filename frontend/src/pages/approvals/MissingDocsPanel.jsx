import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckSquare, Square, Users, Mail, ShieldCheck,
  Loader2, AlertCircle, RefreshCw, Building2, Send,
  ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';

// ─── Role Meta ────────────────────────────────────────────────────────
const ROLE_META = {
  RegionalVendor: { color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20'   },
  CityVendor:     { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  LocalVendor:    { color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
  SuperVendor:    { color: 'text-gold-400',   bg: 'bg-gold-500/10',   border: 'border-gold-500/20'   },
};
const DEFAULT_META = { color: 'text-gray-400', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]' };

const getRoleMeta = (role) => ROLE_META[role] || DEFAULT_META;

const formatRole = (role) =>
  role ? role.replace(/([A-Z])/g, ' $1').trim() : '—';

// ─── Tiny Checkbox ────────────────────────────────────────────────────
const Checkbox = ({ checked, indeterminate = false, onChange, id }) => (
  <button
    id={id}
    type="button"
    onClick={onChange}
    aria-checked={checked}
    role="checkbox"
    className="shrink-0 w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center
               focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none
               hover:border-gold-500/60"
    style={{
      background: checked ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.03)',
      borderColor: checked || indeterminate ? 'rgba(212,168,83,0.5)' : 'rgba(255,255,255,0.12)',
    }}
  >
    {indeterminate && !checked
      ? <span className="w-2.5 h-0.5 rounded-full bg-gold-400" />
      : checked
      ? <CheckSquare size={12} className="text-gold-400" />
      : null
    }
  </button>
);

// ─── Vendor Row ───────────────────────────────────────────────────────
const VendorRow = ({ vendor, checked, onToggle, index }) => {
  const meta = getRoleMeta(vendor.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, scale: 0.98 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      onClick={onToggle}
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer
                  border transition-all duration-200 group select-none
                  ${checked
                    ? 'bg-gold-500/[0.06] border-gold-500/25 shadow-[0_0_16px_rgba(212,168,83,0.06)]'
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.10]'
                  }`}
    >
      <Checkbox
        id={`vendor-check-${vendor._id}`}
        checked={checked}
        onChange={onToggle}
      />

      {/* Avatar initials */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0
                       border ${meta.bg} ${meta.border} ${meta.color}`}>
        {vendor.name?.slice(0, 2).toUpperCase() || '??'}
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate leading-none mb-1">
          {vendor.name || 'Unknown Vendor'}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider
                            px-1.5 py-0.5 rounded border ${meta.bg} ${meta.color} ${meta.border}`}>
            <Building2 size={8} /> {formatRole(vendor.role)}
          </span>
          {vendor.email && (
            <span className="flex items-center gap-1 text-[10px] text-gray-600 truncate">
              <Mail size={9} className="shrink-0" /> {vendor.email}
            </span>
          )}
        </div>
      </div>

      {/* Joined */}
      {vendor.createdAt && (
        <div className="hidden md:flex items-center gap-1 text-[10px] text-gray-700 shrink-0">
          <Clock size={10} />
          {new Date(vendor.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          })}
        </div>
      )}

      {/* missing badge */}
      <span className="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full
                       border border-red-500/20 bg-red-500/10 text-red-400 uppercase tracking-wider">
        No Docs
      </span>
    </motion.div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="relative mb-5">
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl scale-150" />
      <div className="relative p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06]
                      shadow-[0_0_36px_rgba(16,185,129,0.10)]">
        <ShieldCheck className="text-emerald-400" size={40} />
      </div>
    </div>
    <h3 className="text-lg font-display font-bold text-white tracking-wide mb-2">
      All Sub-Vendors Are Fully Documented!
    </h3>
    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
      Every vendor in your hierarchy has submitted the required documents.
      No pending reminders needed.
    </p>
    <div className="flex items-center gap-2 mt-5 text-emerald-500/40">
      <ShieldCheck size={12} />
      <span className="text-xs font-medium tracking-widest uppercase">Network Compliant</span>
      <ShieldCheck size={12} />
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────
const MissingDocsPanel = () => {
  const [vendors, setVendors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [selected, setSelected]     = useState(new Set()); // Set of _id strings
  const [sending, setSending]       = useState(false);
  const [collapsed, setCollapsed]   = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────
  const fetchMissingDocs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get(ENDPOINTS.SUPER_VENDOR.MISSING_DOCS);
      if (data.success) {
        setVendors(data.data || []);
        setSelected(new Set()); // reset selection on refresh
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load missing docs list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMissingDocs(); }, [fetchMissingDocs]);

  // ── Selection helpers ──────────────────────────────────────────────
  const allSelected   = vendors.length > 0 && selected.size === vendors.length;
  const someSelected  = selected.size > 0 && selected.size < vendors.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(vendors.map(v => v._id)));
    }
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Send Reminders ─────────────────────────────────────────────────
  const handleSendReminders = async () => {
    if (selected.size === 0) return;
    try {
      setSending(true);
      const { data } = await API.post(ENDPOINTS.SUPER_VENDOR.SEND_REMINDER, {
        targetVendorIds: Array.from(selected),
      });

      if (data.success) {
        toast.success(`Reminders sent to ${selected.size} vendor${selected.size !== 1 ? 's' : ''}!`, {
          icon: '📬',
          duration: 4000,
          style: {
            background: '#0f1117',
            color: '#34d399',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
          },
        });
        // Clear selection, then re-fetch to see if any vendors uploaded docs
        setSelected(new Set());
        await fetchMissingDocs();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reminders.', {
        style: {
          background: '#0f1117',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: '12px',
        },
      });
    } finally {
      setSending(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-panel rounded-2xl overflow-hidden"
    >
      {/* ── Panel Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <Bell size={16} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-white tracking-wide uppercase">
              Document Reminders
            </h2>
            <p className="text-[10px] text-gray-600 mt-0.5 tracking-wide">
              Sub-vendors in your network with zero uploaded documents
            </p>
          </div>

          {/* live count pill */}
          {!loading && !error && vendors.length > 0 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-1 px-2.5 py-1 text-[10px] font-bold text-red-400 bg-red-500/10
                         border border-red-500/20 rounded-full uppercase tracking-wider"
            >
              {vendors.length} missing
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            onClick={fetchMissingDocs}
            disabled={loading}
            title="Refresh list"
            className="p-2 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]
                       hover:bg-white/[0.05] transition-all text-gray-600 hover:text-gray-300 disabled:opacity-40"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand' : 'Collapse'}
            className="p-2 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]
                       hover:bg-white/[0.05] transition-all text-gray-600 hover:text-gray-300"
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* ── Collapsible Body ─────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-4">

              {/* ── Loading ─────────────────────────────────────── */}
              {loading ? (
                <div className="flex items-center justify-center gap-3 py-12">
                  <Loader2 className="text-gold-400 animate-spin" size={26} />
                  <span className="text-sm text-gray-600 font-medium tracking-widest uppercase">
                    Scanning hierarchy…
                  </span>
                </div>

              /* ── Error ─────────────────────────────────────────── */
              ) : error ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <AlertCircle className="text-red-500" size={30} />
                  <p className="text-sm text-red-400 font-medium">{error}</p>
                  <button
                    onClick={fetchMissingDocs}
                    className="text-xs font-bold uppercase tracking-wider text-gray-600
                               hover:text-white transition-colors"
                  >
                    Retry
                  </button>
                </div>

              /* ── Empty ─────────────────────────────────────────── */
              ) : vendors.length === 0 ? (
                <EmptyState />

              /* ── List ──────────────────────────────────────────── */
              ) : (
                <>
                  {/* Select-all bar */}
                  <div className="flex items-center gap-3 px-4 py-2.5 mb-3 rounded-xl
                                  bg-white/[0.02] border border-white/[0.05]">
                    <Checkbox
                      id="select-all-vendors"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleSelectAll}
                    />
                    <label
                      htmlFor="select-all-vendors"
                      className="text-xs font-semibold text-gray-400 cursor-pointer select-none flex-1"
                      onClick={toggleSelectAll}
                    >
                      {allSelected
                        ? `All ${vendors.length} vendors selected`
                        : someSelected
                        ? `${selected.size} of ${vendors.length} selected`
                        : `Select all ${vendors.length} vendors`}
                    </label>
                    <div className="flex items-center gap-3 text-[10px] text-gray-700 uppercase tracking-wider font-bold">
                      <span className="hidden sm:block">Vendor</span>
                      <span className="hidden md:block w-24 text-right">Joined</span>
                      <span className="w-14 text-right">Status</span>
                    </div>
                  </div>

                  {/* Vendor rows */}
                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                    <AnimatePresence mode="popLayout">
                      {vendors.map((vendor, i) => (
                        <VendorRow
                          key={vendor._id}
                          vendor={vendor}
                          checked={selected.has(vendor._id)}
                          onToggle={() => toggleOne(vendor._id)}
                          index={i}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* ── CTA ───────────────────────────────────────── */}
                  <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">
                      {selected.size === 0
                        ? 'Select vendors above to enable reminders'
                        : `${selected.size} vendor${selected.size !== 1 ? 's' : ''} will receive an in-app notification`}
                    </p>

                    <motion.button
                      id="send-reminder-btn"
                      onClick={handleSendReminders}
                      disabled={selected.size === 0 || sending}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold
                                  uppercase tracking-wide border transition-all duration-300
                                  disabled:opacity-40 disabled:cursor-not-allowed
                                  ${selected.size > 0 && !sending
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/35 shadow-[0_0_24px_rgba(245,158,11,0.12)] hover:shadow-[0_0_30px_rgba(245,158,11,0.20)]'
                                    : 'bg-white/[0.03] text-gray-600 border-white/[0.06]'
                                  }`}
                    >
                      {sending ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Reminder Notifications
                          {selected.size > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20
                                             text-amber-300 rounded-full border border-amber-500/30">
                              {selected.size}
                            </span>
                          )}
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default MissingDocsPanel;
