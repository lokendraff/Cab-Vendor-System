import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, AlertCircle, Users, Search, ChevronDown, Mail, Shield } from 'lucide-react';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';

const ROLE_BADGE = {
  SuperVendor:    { label: 'Super Vendor',    bg: 'bg-gold-500/10',    text: 'text-gold-400',    border: 'border-gold-500/20' },
  RegionalVendor: { label: 'Regional Vendor', bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20' },
  CityVendor:     { label: 'City Vendor',     bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/20' },
  LocalVendor:    { label: 'Local Vendor',     bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

const SubVendorList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredVendors = vendors.filter(
    (v) =>
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }
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
    <div className="p-6 md:p-10 relative overflow-hidden">

      {/* Ambient Glows */}
      <div className="absolute top-[-25%] right-[-10%] w-[500px] h-[500px] bg-gold-500/[0.03] rounded-full blur-[160px] pointer-events-none"></div>

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
          <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Active Cabs</div>
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
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/[0.04] transition-all duration-300 hover:bg-white/[0.03] hover:border-gold-500/10 cursor-pointer group"
                >
                  {/* Index */}
                  <div className="col-span-1">
                    <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors">{String(index + 1).padStart(2, '0')}</span>
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
                      <div className={`w-1.5 h-1.5 rounded-full ${vendor.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      {vendor.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </div>

                  {/* Active Cab Count */}
                  <div className="col-span-2 flex justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-gray-500">
                      N/A
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SubVendorList;
