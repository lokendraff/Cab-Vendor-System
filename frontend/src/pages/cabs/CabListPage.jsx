import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CarFront, Plus, Search, Filter, AlertCircle, UserPlus,
  User2, X, Loader2, CheckCircle2, Phone, RefreshCw, UserX, Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';
import useAuth from '../../hooks/useAuth';

// ─── Assign Driver Modal ────────────────────────────────────────────────────────
const AssignDriverModal = ({ cab, onClose, onAssigned }) => {
  const [drivers, setDrivers]       = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [driversError, setDriversError]     = useState(null);
  const [search, setSearch]         = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [assigning, setAssigning]   = useState(false);
  const searchRef                   = useRef(null);

  // Focus search on open
  useEffect(() => {
    setLoadingDrivers(true);
    API.get(ENDPOINTS.DRIVERS.GET_MY)
      .then(({ data }) => {
        if (data.success) setDrivers(data.data || []);
      })
      .catch(() => setDriversError('Failed to load drivers. Please try again.'))
      .finally(() => setLoadingDrivers(false));

    const t = setTimeout(() => searchRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.contactNumber?.includes(search)
  );

  const handleAssign = async () => {
    if (!selectedDriver) return;
    setAssigning(true);
    try {
      await API.put(ENDPOINTS.CABS.ASSIGN_DRIVER(cab._id), { driverId: selectedDriver._id });
      toast.success(
        `${selectedDriver.name} assigned to ${cab.registrationNumber}!`,
        { style: { background: '#0f1117', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px' } }
      );
      onAssigned(cab._id, selectedDriver);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed. Please try again.', {
        style: { background: '#0f1117', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '12px' },
      });
    } finally {
      setAssigning(false);
    }
  };

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

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d0d1a]/92 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col max-h-[90vh]">

          {/* Gold accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/60 to-transparent shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <UserPlus size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {cab.driverId ? 'Reassign Driver' : 'Assign Driver'}
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <CarFront size={10} className="text-gold-400" />
                  <span className="font-mono text-gold-400 tracking-widest text-[10px]">
                    {cab.registrationNumber}
                  </span>
                  <span className="text-gray-700">·</span>
                  <span>{cab.model}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-white/[0.05] shrink-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or phone..."
                className="w-full input-space rounded-xl py-2 pl-9 pr-4 text-sm"
              />
            </div>
          </div>

          {/* Driver List */}
          <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-1.5 min-h-0">
            {loadingDrivers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-gold-400" />
              </div>
            ) : driversError ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <AlertCircle size={28} className="text-red-500" />
                <p className="text-sm text-red-400">{driversError}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <UserX size={28} className="text-gray-700" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {search ? 'No drivers match your search.' : 'No drivers available to assign.'}
                </p>
                {!search && (
                  <p className="text-xs text-gray-700 max-w-[220px] leading-relaxed">
                    Onboard drivers first via the Drivers section before assigning them to cabs.
                  </p>
                )}
              </div>
            ) : (
              filtered.map(driver => {
                const isSelected = selectedDriver?._id === driver._id;
                const isCurrentlyAssigned = cab.driverId?._id === driver._id || cab.driverId === driver._id;
                return (
                  <motion.button
                    key={driver._id}
                    layout
                    onClick={() => setSelectedDriver(isSelected ? null : driver)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.10]'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold border transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                        : 'bg-white/[0.04] border-white/[0.07] text-gray-400'
                    }`}>
                      {driver.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                          {driver.name}
                        </p>
                        {isCurrentlyAssigned && (
                          <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/25 shrink-0">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                        <Phone size={9} />
                        {driver.contactNumber}
                      </p>
                    </div>

                    {/* Check indicator */}
                    <div className={`shrink-0 transition-all duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                      <CheckCircle2 size={16} className="text-cyan-400" />
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 pt-3 border-t border-white/[0.06] flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 border border-white/[0.08] hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <button
              id="confirm-assign-btn"
              onClick={handleAssign}
              disabled={!selectedDriver || assigning}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-black
                         bg-gradient-to-r from-cyan-400 to-teal-400
                         hover:from-cyan-300 hover:to-teal-300
                         shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                         transition-all duration-300"
            >
              {assigning ? (
                <><Loader2 size={14} className="animate-spin" /> Assigning…</>
              ) : (
                <><CheckCircle2 size={14} /> Confirm Assignment</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Fuel badge colours ────────────────────────────────────────────────────────
const FUEL_STYLE = {
  Petrol:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Diesel:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  CNG:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Electric: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

// ─── Main Page Component ───────────────────────────────────────────────────────
const CabListPage = () => {
  const { role, vendorId }            = useAuth();
  const [cabs, setCabs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState('');
  const [assignTarget, setAssignTarget] = useState(null);
  // Fetched once: the logged-in vendor's delegatedRights (relevant for sub-vendors)
  const [myRights, setMyRights]       = useState(null);

  const fetchCabs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(ENDPOINTS.CABS.GET_MY);
      if (data.success) setCabs(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cabs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch own profile once to read delegatedRights (sub-vendors only need this)
  useEffect(() => {
    API.get(ENDPOINTS.VENDORS.ME)
      .then(({ data }) => {
        if (data.success) setMyRights(data.data?.delegatedRights ?? null);
      })
      .catch(() => {}); // Silent — SuperVendors don't need this
  }, []);

  useEffect(() => { fetchCabs(); }, [fetchCabs]);

  // Optimistically update the assigned driver in local state
  const handleDriverAssigned = useCallback((cabId, driver) => {
    setCabs(prev =>
      prev.map(c => c._id === cabId ? { ...c, driverId: driver } : c)
    );
  }, []);

  /**
   * canAssign(cab) — Returns { allowed: boolean, reason: string | null }
   *
   * Rules:
   *  1. SuperVendor / Admin → always allowed (they own all cabs downstream)
   *  2. Sub-vendors → allowed only when:
   *     a. The cab's vendorId matches their own _id (they onboarded it)
   *     b. Their delegatedRights.canOnboardDriver === true
   */
  const canAssign = useCallback((cab) => {
    // SuperVendors and Admins always have full rights
    if (role === 'SuperVendor' || role === 'Admin') {
      return { allowed: true, reason: null };
    }

    // For sub-vendors: check cab ownership first
    const cabVendorId = cab.vendorId?._id ?? cab.vendorId;
    const isOwner = cabVendorId?.toString() === vendorId?.toString();

    if (!isOwner) {
      return { allowed: false, reason: 'You can only assign drivers to cabs you own.' };
    }

    // Check delegated rights (fetched from /api/vendors/me)
    if (myRights !== null && myRights.canOnboardDriver === false) {
      return { allowed: false, reason: 'Assignment rights restricted by Super Vendor.' };
    }

    return { allowed: true, reason: null };
  }, [role, vendorId, myRights]);

  const filteredCabs = cabs.filter(cab =>
    cab.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
    cab.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {assignTarget && (
        <AssignDriverModal
          cab={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={handleDriverAssigned}
        />
      )}

      <div className="p-6 md:p-10 relative">
        {/* Ambient glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10"
        >
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3 text-white">
              <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
                <CarFront className="text-gold-400" size={22} />
              </div>
              My Fleet
            </h1>
            <p className="text-gray-500 text-sm mt-2 ml-12">
              Manage your vehicles and driver assignments
            </p>
          </div>

          <Link to="/cabs/add">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
            >
              <Plus size={18} /> Add Vehicle
            </motion.div>
          </Link>
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
              placeholder="Search by Registration No. or Model..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full input-space rounded-xl py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
          <button className="px-4 glass-panel rounded-xl flex items-center gap-2 text-gray-400 text-sm font-medium hover:text-gold-400 hover:border-gold-500/20 transition-all">
            <Filter size={16} /> Filter
          </button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          {loading ? (
            <div className="py-24 flex justify-center">
              <Loader text="Fetching fleet..." />
            </div>
          ) : error ? (
            <div className="glass-panel p-10 rounded-2xl text-center">
              <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={fetchCabs}
                className="mt-4 flex items-center gap-2 mx-auto text-xs font-bold text-gray-500 hover:text-white transition-colors"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : filteredCabs.length === 0 ? (
            <div className="glass-panel p-20 rounded-2xl text-center border border-dashed border-white/10">
              <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 inline-block mb-4">
                <CarFront className="text-gold-500/40" size={40} />
              </div>
              <h3 className="text-lg font-semibold text-gray-300">No vehicles in your fleet</h3>
              <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">
                Add your first vehicle to start building your fleet and managing trips.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Registration No.</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Model</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Capacity</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Fuel</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Status</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Assigned Driver</th>
                      <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCabs.map((cab, index) => {
                      const assignedDriver = cab.driverId; // null or populated driver object
                      const fuelStyle = FUEL_STYLE[cab.fuelType] || 'bg-white/[0.04] text-gray-400 border-white/[0.06]';
                      return (
                        <motion.tr
                          key={cab._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="border-b border-white/[0.03] hover:bg-gold-500/[0.02] transition-colors duration-200"
                        >
                          {/* Reg Number */}
                          <td className="px-5 py-4 font-bold text-gold-400 font-display text-xs tracking-widest uppercase">
                            {cab.registrationNumber}
                          </td>

                          {/* Model */}
                          <td className="px-5 py-4 text-gray-300 font-medium">{cab.model}</td>

                          {/* Capacity */}
                          <td className="px-5 py-4 text-gray-400">{cab.seatingCapacity} Seats</td>

                          {/* Fuel */}
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${fuelStyle}`}>
                              {cab.fuelType}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            {cab.isActive ? (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 uppercase tracking-wider">Active</span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/15 uppercase tracking-wider">Inactive</span>
                            )}
                          </td>

                          {/* Assigned Driver */}
                          <td className="px-5 py-4">
                            {assignedDriver ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500/20 to-violet-700/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                                  <span className="text-[9px] font-bold text-violet-400">
                                    {(assignedDriver.name || '?').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-300 truncate max-w-[110px]">
                                  {assignedDriver.name || 'Assigned'}
                                </span>
                              </div>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] text-gray-600 italic">
                                <User2 size={11} /> Unassigned
                              </span>
                            )}
                          </td>

                          {/* Action — Assign / Reassign (Role-Agnostic, Ownership-Strict) */}
                          <td className="px-5 py-4">
                            {(() => {
                              const { allowed, reason } = canAssign(cab);
                              const assignedDriver = cab.driverId;

                              if (allowed) {
                                return (
                                  <button
                                    id={`assign-driver-btn-${cab._id}`}
                                    onClick={() => setAssignTarget(cab)}
                                    className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-250 ${
                                      assignedDriver
                                        ? 'text-amber-400 bg-amber-500/[0.07] border-amber-500/20 hover:bg-amber-500/14 hover:border-amber-500/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.18)]'
                                        : 'text-cyan-400 bg-cyan-500/[0.07] border-cyan-500/20 hover:bg-cyan-500/14 hover:border-cyan-500/40 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                                    }`}
                                  >
                                    {assignedDriver ? (
                                      <><RefreshCw size={11} className="transition-transform duration-500 group-hover:rotate-180" /> Reassign</>
                                    ) : (
                                      <><UserPlus size={11} /> Assign Driver</>
                                    )}
                                  </button>
                                );
                              }

                              // Disabled state with tooltip
                              return (
                                <div className="relative group/tip inline-block">
                                  <button
                                    disabled
                                    aria-label={reason}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border
                                               text-gray-600 bg-white/[0.02] border-white/[0.05] cursor-not-allowed opacity-60"
                                  >
                                    <Lock size={11} />
                                    {cab.driverId ? 'Reassign' : 'Assign Driver'}
                                  </button>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-2.5 py-1.5
                                                  rounded-lg bg-[#1a1a2e] border border-white/[0.10] text-[10px] text-gray-400
                                                  leading-relaxed text-center shadow-xl
                                                  opacity-0 pointer-events-none group-hover/tip:opacity-100
                                                  transition-opacity duration-200 z-20">
                                    {reason}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
                                  </div>
                                </div>
                              );
                            })()}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default CabListPage;
