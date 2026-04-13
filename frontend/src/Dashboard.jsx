import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, AlertCircle, Search, Filter, Network, ChevronRight, Building2, CarFront, ShieldCheck } from 'lucide-react';
import API from './api/axios';
import ENDPOINTS from './api/endpoints';
import useAuth from './hooks/useAuth';
import Loader from './components/ui/Loader';

const Dashboard = () => {
  const { role, isSuperVendor } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isSuperVendor) {
          const response = await API.get(ENDPOINTS.DASHBOARD.SUPER_VENDOR);
          if (response.data.success) {
            setData(response.data.data);
          }
        } else {
          const [cabsRes, docsRes] = await Promise.all([
            API.get(ENDPOINTS.CABS.GET_MY),
            API.get(ENDPOINTS.DOCUMENTS.GET_MY)
          ]);

          const totalCabs = cabsRes.data.count || 0;
          const activeCabs = cabsRes.data.data?.filter(c => c.isActive).length || 0;
          
          const pendingDocs = docsRes.data.data?.filter(d => !d.isVerified) || [];

          setData({
            vendorHierarchy: {
              totalSubVendors: 0,
            },
            fleetStatus: {
              totalVehicles: totalCabs,
              activeVehicles: activeCabs,
              inactiveVehicles: totalCabs - activeCabs
            },
            compliance: {
              pendingVerificationCount: pendingDocs.length,
              driversPendingVerification: pendingDocs
            }
          });
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isSuperVendor]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <Loader size="lg" text="Loading Analytics..." />
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

  // Safe fallbacks if data is somehow empty
  const activeFleet = data?.fleetStatus?.activeVehicles || 0;
  const totalSubVendors = data?.vendorHierarchy?.totalSubVendors || 0;
  const pendingDocsCount = data?.compliance?.pendingVerificationCount || 0;
  const pendingDocsList = data?.compliance?.driversPendingVerification || [];

  return (
    <div className="p-6 md:p-10 relative overflow-hidden">
      
      {/* Deep Space Ambient Glow */}
      <div className="absolute top-[-30%] left-[-15%] w-[700px] h-[700px] bg-gold-500/[0.03] rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-30%] right-[-15%] w-[500px] h-[500px] bg-gold-800/[0.04] rounded-full blur-[140px] pointer-events-none"></div>

      {/* Page Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gold-500/10 rounded-2xl border border-gold-500/20 golden-glow">
            <Building2 className="text-gold-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wider uppercase text-gold-gradient">
              Fleet Command Center
            </h1>
            <p className="text-sm text-gray-400 font-medium tracking-widest uppercase mt-1">
              {role} PORTAL
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search fleet, vendors..." 
              className="w-full input-space rounded-xl py-2.5 pl-11 pr-4 text-sm"
            />
          </div>
          <button className="p-2.5 glass-panel rounded-xl glass-panel-hover transition-all">
            <Filter size={18} className="text-gray-400" />
          </button>
        </div>
      </motion.header>

      {/* Main Dashboard Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
      >
        
        {/* KPI: Active Fleet */}
        <motion.div variants={itemVariants} className="glass-panel-strong p-6 rounded-2xl group cursor-pointer glass-panel-hover transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Active Fleet</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/15">
              <Activity className="text-emerald-400" size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold font-display text-white">{activeFleet}</span>
            <span className="text-gray-500 text-sm font-medium">/ {data?.fleetStatus?.totalVehicles || 0} Total</span>
          </div>
        </motion.div>

        {/* KPI: Sub-Vendors or My Cabs */}
        {isSuperVendor ? (
          <motion.div variants={itemVariants} className="glass-panel-strong p-6 rounded-2xl group cursor-pointer glass-panel-hover transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Sub-Vendors</h3>
              <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/15">
                <Users className="text-gold-400" size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold font-display text-white">{totalSubVendors}</span>
              <span className="text-gold-500 text-sm font-medium">Managed</span>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="glass-panel-strong p-6 rounded-2xl group cursor-pointer glass-panel-hover transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">My Cabs</h3>
              <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/15">
                <CarFront className="text-gold-400" size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold font-display text-white">{data?.fleetStatus?.totalVehicles || 0}</span>
              <span className="text-gold-500 text-sm font-medium">Total Registered</span>
            </div>
          </motion.div>
        )}

        {/* KPI: Action Required */}
        <motion.div variants={itemVariants} className={`glass-panel-strong p-6 rounded-2xl group cursor-pointer transition-all duration-300 relative overflow-hidden ${pendingDocsCount > 0 ? 'border-red-500/20 hover:border-red-500/40' : 'glass-panel-hover'}`}>
          {pendingDocsCount > 0 && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
          )}
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Action Required</h3>
            <div className={`p-2 rounded-lg border ${pendingDocsCount > 0 ? 'bg-red-500/10 border-red-500/15' : 'bg-emerald-500/10 border-emerald-500/15'}`}>
              <AlertCircle className={pendingDocsCount > 0 ? "text-red-400" : "text-emerald-400"} size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 relative z-10">
            <span className="text-4xl font-bold font-display text-white">{pendingDocsCount}</span>
            <span className={`text-sm font-medium ${pendingDocsCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {pendingDocsCount === 0 ? "All Clear" : "Pending Docs"}
            </span>
          </div>
        </motion.div>

        {/* Fleet Network Visualizer */}
        <motion.div variants={slideInRight} className="lg:col-span-2 glass-panel p-8 rounded-2xl min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-display font-semibold tracking-wide text-white">Fleet Network Activity</h2>
              <button className="text-gold-400 text-xs font-semibold flex items-center gap-1 hover:text-gold-300 transition-colors uppercase tracking-wider">
                View Map <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-gray-500 text-sm">Real-time pulse of your multi-tier vendor network.</p>
          </div>
          
          {/* Animated Network Rings */}
          <div className="flex-1 flex items-center justify-center mt-6 relative">
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 h-44 border border-gold-500/20 rounded-full"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-72 h-72 border border-gold-700/15 rounded-full"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.03, 1], opacity: [0.08, 0.2, 0.08] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute w-96 h-96 border border-gold-800/10 rounded-full"
            ></motion.div>
            <div className="relative z-10 p-5 bg-space-900 rounded-full border border-gold-500/30 golden-glow">
              <Network className="text-gold-400" size={36} />
            </div>
          </div>
        </motion.div>

        {/* Priority Verifications */}
        <motion.div variants={slideInRight} className="glass-panel p-6 rounded-2xl flex flex-col">
          <h2 className="text-sm font-display font-semibold mb-5 flex items-center gap-2 tracking-wide uppercase text-gray-200">
            <AlertCircle size={16} className="text-gold-400" />
            Priority Verifications
          </h2>
          
          {pendingDocsList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/15 mb-4">
                <ShieldCheck size={28} className="text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-gray-300">No pending verifications</p>
              <p className="text-xs text-gray-600 mt-1">Your fleet is fully compliant.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 max-h-[280px] overflow-y-auto pr-1">
              {pendingDocsList.slice(0, 5).map((doc, index) => (
                <motion.div 
                  key={doc._id || index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.08) }}
                  className="p-3.5 glass-panel rounded-xl glass-panel-hover cursor-pointer transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200">{doc.documentType} Verification</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Driver: {doc.driverId?.name || "Unknown"}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/15 uppercase tracking-wider">Pending</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {pendingDocsCount > 0 && (
            <button className="w-full py-2.5 mt-4 text-xs font-semibold text-gold-400 border border-gold-500/20 rounded-xl hover:bg-gold-500/5 hover:border-gold-500/30 transition-all uppercase tracking-wider">
              View All {pendingDocsCount} Requests
            </button>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Dashboard;