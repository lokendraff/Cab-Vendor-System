import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, ShieldBan, ShieldCheck, AlertCircle, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';
import { ROLE_LABELS } from '../../utils/constants';

const VendorListPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState(null); // stores vendorId being toggled
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
        // Update local state immediately
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

  const filteredVendors = vendors.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase()) ||
    v.role?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3 text-white">
            <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
              <Building2 className="text-gold-400" size={22} />
            </div>
            Sub-Vendor Management
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Manage, block, or unblock your downstream vendors</p>
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
          <div className="py-24 flex justify-center"><Loader text="Fetching vendors..." /></div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-2xl text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="glass-panel p-20 rounded-2xl text-center border border-dashed border-white/10">
            <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 inline-block mb-4">
              <Building2 className="text-gold-500/40" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">No sub-vendors found</h3>
            <p className="text-sm text-gray-600 mt-1">Sub-vendors will appear here once they register under you.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Vendor</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Role</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Email Verified</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Joined</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Status</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor, index) => (
                    <motion.tr
                      key={vendor._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="border-b border-white/[0.03] hover:bg-gold-500/[0.02] transition-colors duration-200"
                    >
                      {/* Name + Email */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-white">{vendor.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail size={11} /> {vendor.email}
                          </p>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gold-500/10 text-gold-400 border border-gold-500/15 uppercase tracking-wider">
                          {ROLE_LABELS[vendor.role] || vendor.role}
                        </span>
                      </td>

                      {/* Email Verified */}
                      <td className="px-5 py-4">
                        {vendor.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            <ShieldCheck size={13} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                            <Clock size={13} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {formatDate(vendor.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {vendor.isActive ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 uppercase tracking-wider">Active</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/15 uppercase tracking-wider">Blocked</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
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
                      </td>
                    </motion.tr>
                  ))}
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
