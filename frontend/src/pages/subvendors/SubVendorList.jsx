import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, AlertCircle, Users, Search, Mail, Shield,
  Settings2, X, Car, UserRound, CreditCard, CheckCircle2, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';

// ─── Role Badge Config ─────────────────────────────────────────────────────────
const ROLE_BADGE = {
  SuperVendor:    { label: 'Super Vendor',    bg: 'bg-gold-500/10',    text: 'text-gold-400',    border: 'border-gold-500/20' },
  RegionalVendor: { label: 'Regional Vendor', bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20' },
  CityVendor:     { label: 'City Vendor',     bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/20' },
  LocalVendor:    { label: 'Local Vendor',    bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

// ─── Animated Toggle Component ─────────────────────────────────────────────────
const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
      checked
        ? 'bg-gradient-to-r from-gold-500 to-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
        : 'bg-white/10 border border-white/10'
    }`}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      className={`inline-block h-4 w-4 rounded-full shadow-md ${
        checked ? 'bg-white translate-x-6' : 'bg-gray-400 translate-x-1'
      }`}
      style={{ position: 'relative' }}
    />
  </button>
);

// ─── Delegation Modal ──────────────────────────────────────────────────────────
const DelegationModal = ({ vendor, onClose, onSaved }) => {
  const [rights, setRights] = useState({
    canOnboardCab:      vendor?.delegatedRights?.canOnboardCab      ?? true,
    canOnboardDriver:   vendor?.delegatedRights?.canOnboardDriver   ?? true,
    canProcessPayments: vendor?.delegatedRights?.canProcessPayments ?? false,
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = (key) => (value) => {
    setRights((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put(ENDPOINTS.VENDORS.DELEGATE(vendor._id), rights);
      toast.success(`Rights updated for ${vendor.name}!`, {
        icon: '✅',
        style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid rgba(212,175,55,0.3)' },
      });
      onSaved(vendor._id, rights);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update rights. Please try again.';
      toast.error(msg, {
        style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid rgba(239,68,68,0.3)' },
      });
    } finally {
      setSaving(false);
    }
  };

  const RIGHTS_CONFIG = [
    {
      key: 'canOnboardCab',
      label: 'Onboard Cabs',
      description: 'Allow this vendor to register new cabs to the fleet.',
      Icon: Car,
      accentColor: 'text-cyan-400',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/20',
    },
    {
      key: 'canOnboardDriver',
      label: 'Onboard Drivers',
      description: 'Allow this vendor to recruite and onboard new drivers.',
      Icon: UserRound,
      accentColor: 'text-violet-400',
      accentBg: 'bg-violet-500/10',
      accentBorder: 'border-violet-500/20',
    },
    {
      key: 'canProcessPayments',
      label: 'Process Payments',
      description: 'Allow this vendor to initiate and manage payment transactions.',
      Icon: CreditCard,
      accentColor: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-500/20',
    },
  ];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal Panel */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0d1a]/90 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* Gold top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/20">
                <Settings2 size={18} className="text-gold-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">Manage Rights</h2>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <span className="inline-block w-4 h-4 rounded-md bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/15 text-[9px] font-bold text-gold-400 flex items-center justify-center">
                    {vendor.name?.charAt(0).toUpperCase()}
                  </span>
                  {vendor.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body — Toggle Rows */}
          <div className="px-6 py-5 space-y-3">
            {RIGHTS_CONFIG.map(({ key, label, description, Icon, accentColor, accentBg, accentBorder }) => (
              <motion.div
                key={key}
                layout
                className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  rights[key]
                    ? `${accentBg} ${accentBorder}`
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${accentBg} border ${accentBorder}`}>
                    <Icon size={14} className={accentColor} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold transition-colors ${rights[key] ? 'text-white' : 'text-gray-400'}`}>
                      {label}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{description}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <Toggle
                    id={`toggle-${key}`}
                    checked={rights[key]}
                    onChange={handleToggle(key)}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-all"
            >
              Cancel
            </button>
            <button
              id="save-delegation-btn"
              onClick={handleSave}
              disabled={saving}
              className="relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-gold-400 to-amber-400 hover:from-gold-300 hover:to-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.5)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const SubVendorList = () => {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [vendors, setVendors]       = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null); // vendor object for modal

  useEffect(() => {
    const fetchSubVendors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(ENDPOINTS.DASHBOARD.SUPER_VENDOR);
        if (res.data.success) {
          setVendors(res.data.data.vendorHierarchy?.subVendorsList || []);
        }
      } catch (err) {
        console.error('SubVendor Fetch Error:', err);
        setError('Failed to load sub-vendor data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubVendors();
  }, []);

  // Optimistic local update after successful save
  const handleRightsSaved = useCallback((vendorId, newRights) => {
    setVendors((prev) =>
      prev.map((v) =>
        v._id === vendorId
          ? { ...v, delegatedRights: { ...v.delegatedRights, ...newRights } }
          : v
      )
    );
  }, []);

  const filteredVendors = vendors.filter(
    (v) =>
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const rowVariants = {
    hidden:  { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <Loader size="lg" text="Loading Sub-Vendors..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl text-white font-semibold">{error}</h2>
        <button onClick={() => window.location.reload()} className="mt-4 btn-ghost px-6 py-2.5 rounded-xl text-sm">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Delegation Modal */}
      {selectedVendor && (
        <DelegationModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onSaved={handleRightsSaved}
        />
      )}

      <div className="p-6 md:p-10 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-[-25%] right-[-10%] w-[500px] h-[500px] bg-gold-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 relative z-10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-500/10 rounded-2xl border border-gold-500/20 golden-glow">
              <Building2 className="text-gold-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-wider uppercase text-gold-gradient">
                My Sub-Vendors
              </h1>
              <p className="text-sm text-gray-400 font-medium tracking-widest uppercase mt-1">
                Direct Downstream Network
              </p>
            </div>
          </div>

          {/* Count Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl">
              <Users size={16} className="text-gold-400" />
              <span className="text-sm font-bold text-white">{vendors.length}</span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</span>
            </div>
          </div>
        </motion.header>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 relative z-10"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full input-space rounded-xl py-2.5 pl-11 pr-4 text-sm"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl overflow-hidden relative z-10"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="col-span-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">#</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vendor Name</div>
            <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</div>
            <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</div>
            <div className="col-span-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Status</div>
            <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Actions</div>
          </div>

          {/* Table Body */}
          {filteredVendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users size={36} className="text-gray-600 mb-3" />
              <p className="text-sm text-gray-400 font-medium">
                {searchQuery ? 'No vendors match your search.' : 'No sub-vendors found under your account.'}
              </p>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {filteredVendors.map((vendor, index) => {
                const badge = ROLE_BADGE[vendor.role] || ROLE_BADGE.LocalVendor;
                return (
                  <motion.div
                    key={vendor._id}
                    variants={rowVariants}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/[0.04] transition-all duration-300 hover:bg-white/[0.03] hover:border-gold-500/10 group"
                  >
                    {/* Index */}
                    <div className="col-span-1">
                      <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/15 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-gold-400">{vendor.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                        {vendor.name}
                      </span>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 flex items-center gap-2">
                      <Mail size={13} className="text-gray-600 shrink-0" />
                      <span className="text-sm text-gray-400 truncate">{vendor.email}</span>
                    </div>

                    {/* Role Badge */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <Shield size={10} />
                        {badge.label}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        vendor.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${vendor.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {vendor.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </div>

                    {/* Actions — Manage Rights Button */}
                    <div className="col-span-2 flex justify-center">
                      <button
                        id={`manage-rights-btn-${vendor._id}`}
                        onClick={() => setSelectedVendor(vendor)}
                        className="group/btn relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gold-400 bg-gold-500/[0.07] border border-gold-500/20 hover:bg-gold-500/15 hover:border-gold-500/40 hover:shadow-[0_0_14px_rgba(212,175,55,0.2)] transition-all duration-300"
                        title={`Manage delegation rights for ${vendor.name}`}
                      >
                        <Settings2
                          size={12}
                          className="transition-transform duration-500 group-hover/btn:rotate-90"
                        />
                        Manage Rights
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default SubVendorList;
