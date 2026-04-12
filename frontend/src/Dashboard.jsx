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
          // Fetch centralized SuperVendor analytics
          const response = await API.get(ENDPOINTS.DASHBOARD.SUPER_VENDOR);
          if (response.data.success) {
            setData(response.data.data);
          }
        } else {
          // For Sub-vendors, we fetch their specific cabs and drivers to construct basic KPI
          const [cabsRes, docsRes] = await Promise.all([
            API.get(ENDPOINTS.CABS.GET_MY),
            API.get(ENDPOINTS.DOCUMENTS.GET_MY)
          ]);

          const totalCabs = cabsRes.data.count || 0;
          const activeCabs = cabsRes.data.data?.filter(c => c.isActive).length || 0;
          
          const pendingDocs = docsRes.data.data?.filter(d => !d.isVerified) || [];

          setData({
            vendorHierarchy: {
              totalSubVendors: 0, // Sub-vendors typically don't have sub-vendors of their own in this context
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
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <Loader size="lg" text="Loading Analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-space-900 flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl text-white font-semibold">{error}</h2>
        <button onClick={() => window.location.reload()} className="mt-4 btn-ghost px-4 py-2 rounded-xl">
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
    <div className="min-h-screen bg-space-900 text-white p-6 md:p-10 relative overflow-hidden">
      
      {/* Deep Space Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Modern Header Context */}
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <Building2 className="text-indigo-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Fleet Command Center
            </h1>
            <p className="text-sm text-gold-400 font-medium tracking-widest uppercase mt-1">
              {role} PORTAL
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search fleet, vendors..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <Filter size={18} className="text-gray-400" />
          </button>
        </div>
      </motion.header>

      {/* Main Dashboard Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
      >
        
        {/* Top KPI Cards (Mapped to real variables) */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl group cursor-pointer hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Active Fleet</h3>
            <Activity className="text-emerald-400" size={20} />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold">{activeFleet}</span>
            <span className="text-gray-500 text-sm font-medium">/ {data?.fleetStatus?.totalVehicles || 0} Total</span>
          </div>
        </motion.div>

        {isSuperVendor ? (
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl group cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Sub-Vendors</h3>
              <Users className="text-blue-400" size={20} />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">{totalSubVendors}</span>
              <span className="text-blue-400 text-sm font-medium">Managed</span>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">My Cabs</h3>
              <CarFront className="text-indigo-400" size={20} />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold">{data?.fleetStatus?.totalVehicles || 0}</span>
              <span className="text-indigo-400 text-sm font-medium">Total Registered</span>
            </div>
          </motion.div>
        )}

        {/* Priority Alerts Card */}
        <motion.div variants={itemVariants} className={`glass-panel p-6 rounded-3xl group cursor-pointer transition-all relative overflow-hidden ${pendingDocsCount > 0 ? 'border-red-500/30 hover:bg-red-500/[0.02]' : 'hover:border-gold-500/30'}`}>
          {pendingDocsCount > 0 && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
          )}
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Action Required</h3>
            <AlertCircle className={pendingDocsCount > 0 ? "text-red-400" : "text-emerald-400"} size={20} />
          </div>
          <div className="flex items-baseline gap-3 relative z-10">
            <span className="text-5xl font-bold text-white">{pendingDocsCount}</span>
            <span className={pendingDocsCount > 0 ? "text-red-400 text-sm font-medium" : "text-emerald-400 text-sm font-medium"}>
              {pendingDocsCount === 0 ? "All Clear" : "Pending Docs"}
            </span>
          </div>
        </motion.div>

        {/* Fleet Network Visualizer Section (Spans 2 columns) */}
        <motion.div variants={slideInRight} className="lg:col-span-2 glass-panel p-8 rounded-3xl min-h-[400px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Fleet Network Activity</h2>
              <button className="text-gold-400 text-sm font-medium flex items-center hover:text-gold-300">
                View Full Map <ChevronRight size={16} />
              </button>
            </div>
            <p className="text-gray-400 text-sm">Real-time pulse of your entire multi-tier vendor network.</p>
          </div>
          
          {/* Animated Mock Network Area */}
          <div className="flex-1 flex items-center justify-center mt-8 relative">
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-48 h-48 border border-gold-500/30 rounded-full"
            ></motion.div>
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-72 h-72 border border-indigo-500/20 rounded-full"
            ></motion.div>
            <div className="relative z-10 p-4 bg-space-800 rounded-full border border-gold-500/50 shadow-[0_0_30px_rgba(212,168,83,0.3)]">
              <Network className="text-gold-400" size={40} />
            </div>
          </div>
        </motion.div>

        {/* Actionable List Section (Spans 1 column) */}
        <motion.div variants={slideInRight} className="glass-panel p-6 rounded-3xl flex flex-col">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="text-gold-400" />
            Priority Verifications
          </h2>
          
          {pendingDocsList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-10">
              <ShieldCheck size={40} className="text-emerald-400 mb-3" />
              <p className="text-sm font-medium text-gray-300">No pending verifications.</p>
              <p className="text-xs text-gray-500">Your fleet is fully compliant.</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1 h-[260px] overflow-y-auto pr-2 custom-scrollbar">
              {pendingDocsList.slice(0, 4).map((doc, index) => (
                <motion.div 
                  key={doc._id || index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.06] cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold">{doc.documentType} Verification</h4>
                      <p className="text-xs text-gray-400 mt-1">Driver: {doc.driverId?.name || "Unknown"}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md">Pending</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {pendingDocsCount > 0 && (
            <button className="w-full py-3 mt-4 text-sm text-gray-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all">
              View All {pendingDocsCount} Requests
            </button>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Dashboard;