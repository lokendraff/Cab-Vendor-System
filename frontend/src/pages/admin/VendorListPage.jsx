import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, ShieldBan, ShieldCheck, AlertCircle, Mail, Clock, ChevronDown, ChevronRight, Shield, Globe, Users, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';

const ROLE_BADGE = {
  Admin:          { label: 'Admin',           bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20' },
  SuperVendor:    { label: 'Super Vendor',    bg: 'bg-gold-500/10',    text: 'text-gold-400',    border: 'border-gold-500/20' },
  RegionalVendor: { label: 'Regional Vendor', bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20' },
  CityVendor:     { label: 'City Vendor',     bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/20' },
  LocalVendor:    { label: 'Local Vendor',    bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

const APPROVAL_BADGE = {
  approved: { label: 'Approved', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2, glow: 'shadow-[0_0_10px_rgba(16,185,129,0.12)]' },
  pending:  { label: 'Pending',  bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20',   icon: Clock,          glow: 'shadow-[0_0_10px_rgba(245,158,11,0.12)]' },
  rejected: { label: 'Rejected', bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20',     icon: XCircle,        glow: 'shadow-[0_0_10px_rgba(239,68,68,0.12)]' },
};

const getRoleBadge = (role) => ROLE_BADGE[role] || ROLE_BADGE.LocalVendor;
const getApprovalBadge = (status) => APPROVAL_BADGE[status] || APPROVAL_BADGE.pending;

const VendorListPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedSV, setExpandedSV] = useState({});
  const [toggling, setToggling] = useState(null);
  const [reasonModal, setReasonModal] = useState({ open: false, vendorId: null, vendorName: '', newStatus: null });
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(ENDPOINTS.ADMIN.GET_VENDORS);
      if (data.success) {
        setVendors(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const openToggleModal = (vendor) => {
    setReasonModal({
      open: true,
      vendorId: vendor._id,
      vendorName: vendor.name,
      newStatus: !vendor.isActive
    });
    setReason('');
  };

  const handleToggle = async () => {
    const { vendorId, newStatus } = reasonModal;
    try {
      setToggling(vendorId);
      const { data } = await API.post(ENDPOINTS.ADMIN.TOGGLE_VENDOR, {
        targetVendorId: vendorId,
        status: newStatus,
        reason: reason || 'Administrative Action'
      });

      if (data.success) {
        toast.success(data.message);
        setVendors(prev => prev.map(v =>
          v._id === vendorId ? { ...v, isActive: newStatus } : v
        ));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed');
    } finally {
      setToggling(null);
      setReasonModal({ open: false, vendorId: null, vendorName: '', newStatus: null });
      setReason('');
    }
  };

  const toggleExpand = (id) => {
    setExpandedSV(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Derived data ---
  const admins = vendors.filter(v => v.role === 'Admin');
  const superVendors = vendors.filter(v => v.role === 'SuperVendor');
  const childVendors = vendors.filter(v => v.role !== 'Admin' && v.role !== 'SuperVendor');

  // FIX: Check BOTH parentVendor and parentId fields for the parent link
  const getChildren = (svId) => childVendors.filter(v => v.parentVendor === svId || v.parentId === svId);

  // Search filter applies globally
  const matchesSearch = (v) =>
    !search ||
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase()) ||
    v.role?.toLowerCase().includes(search.toLowerCase());

  // If search matches a child, also show/expand its parent SuperVendor
  const childMatchingSVIds = new Set();
  childVendors.forEach(c => {
    if (matchesSearch(c)) {
      // Push whichever parent ref exists
      if (c.parentVendor) childMatchingSVIds.add(c.parentVendor);
      if (c.parentId) childMatchingSVIds.add(c.parentId);
    }
  });
  // Merge: show SVs that match themselves OR have matching children
  const visibleSuperVendors = superVendors.filter(
    sv => matchesSearch(sv) || childMatchingSVIds.has(sv._id)
  );
  const filteredAdmins = admins.filter(matchesSearch);

  // --- Render Helpers ---

  // Inline email with verification icon
  const EmailWithStatus = ({ email, isVerified }) => (
    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
      <Mail size={11} className="shrink-0" />
      <span className="truncate">{email}</span>
      {isVerified ? (
        <CheckCircle2 size={12} className="text-emerald-400 shrink-0 ml-0.5" />
      ) : (
        <AlertTriangle size={12} className="text-amber-400/60 shrink-0 ml-0.5" />
      )}
    </p>
  );

  // Approval Status Badge
  const ApprovalBadge = ({ status }) => {
    const config = getApprovalBadge(status);
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border} ${config.glow}`}>
        <Icon size={11} />
        {config.label}
      </span>
    );
  };

  const VendorRow = ({ vendor, isChild = false, animDelay = 0 }) => {
    const badge = getRoleBadge(vendor.role);
    return (
      <motion.tr
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ delay: animDelay, duration: 0.25 }}
        className={`border-b border-white/[0.03] transition-colors duration-200 ${
          isChild
            ? 'bg-white/[0.015] hover:bg-white/[0.035]'
            : 'hover:bg-gold-500/[0.02]'
        }`}
      >
        {/* Name + Email + Verification Icon */}
        <td className="px-5 py-3.5">
          <div className={`flex items-center gap-3 ${isChild ? 'pl-8' : ''}`}>
            {isChild && (
              <div className="w-px h-5 bg-white/10 -ml-4 mr-1 shrink-0"></div>
            )}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/15 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-gold-400">{vendor.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{vendor.name}</p>
              <EmailWithStatus email={vendor.email} isVerified={vendor.isEmailVerified} />
            </div>
          </div>
        </td>

        {/* Role */}
        <td className="px-5 py-3.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
            <Shield size={10} />
            {badge.label}
          </span>
        </td>

        {/* Docs Approval */}
        <td className="px-5 py-3.5">
          <ApprovalBadge status={vendor.approvalStatus} />
        </td>

        {/* Joined */}
        <td className="px-5 py-3.5 text-gray-400 text-xs">
          {formatDate(vendor.createdAt)}
        </td>

        {/* Status */}
        <td className="px-5 py-3.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            vendor.isActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${vendor.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
            {vendor.isActive ? 'Active' : 'Blocked'}
          </span>
        </td>

        {/* Action */}
        <td className="px-5 py-3.5 text-right">
          {vendor.role !== 'Admin' && (
            <button
              onClick={() => openToggleModal(vendor)}
              disabled={toggling === vendor._id}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 ${
                vendor.isActive
                  ? 'bg-red-500/10 text-red-400 border border-red-500/15 hover:bg-red-500/20 hover:border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 hover:bg-emerald-500/20 hover:border-emerald-500/30'
              }`}
            >
              {vendor.isActive ? <ShieldBan size={13} /> : <ShieldCheck size={13} />}
              {vendor.isActive ? 'Block' : 'Unblock'}
            </button>
          )}
        </td>
      </motion.tr>
    );
  };

  return (
    <div className="p-6 md:p-10 relative">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-500/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gold-500/10 rounded-2xl border border-gold-500/20 golden-glow">
            <Globe className="text-gold-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wider uppercase text-gold-gradient">
              Vendor Network
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium tracking-wide">
              Hierarchical view of all vendor accounts in the system
            </p>
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl">
          <Users size={16} className="text-gold-400" />
          <span className="text-sm font-bold text-white">{vendors.length}</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Accounts</span>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-3 rounded-2xl mb-6 flex gap-3 relative z-10"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-space rounded-xl py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Fetching vendor network..." /></div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-2xl text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="glass-panel p-20 rounded-2xl text-center border border-dashed border-white/10">
            <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 inline-block mb-4">
              <Building2 className="text-gold-500/40" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">No vendors found</h3>
            <p className="text-sm text-gray-600 mt-1">Vendors will appear here once they register in the system.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Vendor</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Role</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Docs Approval</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Joined</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Status</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Admin Row(s) — non-expandable */}
                  {filteredAdmins.map((admin) => (
                    <VendorRow key={admin._id} vendor={admin} />
                  ))}

                  {/* Admin / SV divider */}
                  {filteredAdmins.length > 0 && visibleSuperVendors.length > 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent"></div>
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Vendor Hierarchies</span>
                          <div className="flex-1 h-px bg-gradient-to-l from-gold-500/20 to-transparent"></div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* SuperVendor Accordion Rows */}
                  {visibleSuperVendors.map((sv, index) => {
                    const isExpanded = expandedSV[sv._id] || false;
                    const allChildren = getChildren(sv._id);
                    const children = allChildren.filter(matchesSearch);

                    return (
                      <React.Fragment key={sv._id}>
                        {/* SuperVendor parent row */}
                        <motion.tr
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className={`border-b border-white/[0.03] cursor-pointer transition-all duration-200 ${
                            isExpanded
                              ? 'bg-gold-500/[0.04] border-l-2 border-l-gold-500/40'
                              : 'hover:bg-gold-500/[0.02]'
                          }`}
                          onClick={() => toggleExpand(sv._id)}
                        >
                          {/* Name + Email + Expand Toggle */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <button className={`p-1 rounded-md transition-all duration-200 ${isExpanded ? 'bg-gold-500/10 text-gold-400' : 'text-gray-600 hover:text-gray-400'}`}>
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </button>
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400/25 to-gold-700/15 border border-gold-500/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(212,168,83,0.1)]">
                                <span className="text-xs font-bold text-gold-400">{sv.name?.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-white text-sm truncate">{sv.name}</p>
                                  <span className="text-[9px] font-bold text-gray-600 bg-white/[0.04] px-1.5 py-0.5 rounded tracking-wider">
                                    {allChildren.length} sub
                                  </span>
                                </div>
                                <EmailWithStatus email={sv.email} isVerified={sv.isEmailVerified} />
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-gold-500/10 text-gold-400 border-gold-500/20">
                              <Shield size={10} />
                              Super Vendor
                            </span>
                          </td>

                          {/* Docs Approval */}
                          <td className="px-5 py-3.5">
                            <ApprovalBadge status={sv.approvalStatus} />
                          </td>

                          {/* Joined */}
                          <td className="px-5 py-3.5 text-gray-400 text-xs">
                            {formatDate(sv.createdAt)}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              sv.isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${sv.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                              {sv.isActive ? 'Active' : 'Blocked'}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => openToggleModal(sv)}
                              disabled={toggling === sv._id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 ${
                                sv.isActive
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/15 hover:bg-red-500/20 hover:border-red-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 hover:bg-emerald-500/20 hover:border-emerald-500/30'
                              }`}
                            >
                              {sv.isActive ? <ShieldBan size={13} /> : <ShieldCheck size={13} />}
                              {sv.isActive ? 'Block' : 'Unblock'}
                            </button>
                          </td>
                        </motion.tr>

                        {/* Expanded children */}
                        <AnimatePresence>
                          {isExpanded && (
                            <>
                              {children.length === 0 ? (
                                <motion.tr
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                >
                                  <td colSpan={6} className="px-5 py-6 text-center bg-white/[0.01]">
                                    <p className="text-xs text-gray-600 italic">No sub-vendors registered under this SuperVendor yet.</p>
                                  </td>
                                </motion.tr>
                              ) : (
                                children.map((child, ci) => (
                                  <VendorRow key={child._id} vendor={child} isChild={true} animDelay={ci * 0.04} />
                                ))
                              )}
                            </>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {reasonModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setReasonModal({ open: false, vendorId: null, vendorName: '', newStatus: null })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel-strong rounded-2xl p-6 md:p-8 w-full max-w-md golden-glow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg border ${reasonModal.newStatus ? 'bg-emerald-500/10 border-emerald-500/15' : 'bg-red-500/10 border-red-500/15'}`}>
                  {reasonModal.newStatus ? <ShieldCheck className="text-emerald-400" size={20} /> : <ShieldBan className="text-red-400" size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white tracking-wide">
                    {reasonModal.newStatus ? 'Unblock' : 'Block'} Vendor
                  </h3>
                  <p className="text-xs text-gray-400">
                    {reasonModal.vendorName}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Reason <span className="text-gray-600">(optional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Compliance violation, payment overdue..."
                  rows={3}
                  className="w-full input-space rounded-xl py-3 px-4 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setReasonModal({ open: false, vendorId: null, vendorName: '', newStatus: null })}
                  className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                    reasonModal.newStatus
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30'
                  }`}
                >
                  {toggling ? 'Processing...' : `Confirm ${reasonModal.newStatus ? 'Unblock' : 'Block'}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorListPage;
