import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CarFront, Users, AlertCircle, TrendingUp, Activity, Globe, ChevronRight } from 'lucide-react';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';

const ROLE_CONFIG = {
  Admin:          { color: 'from-red-500 to-rose-600',     border: 'border-red-500/20',   text: 'text-red-400',     bg: 'bg-red-500/10',    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
  SuperVendor:    { color: 'from-gold-400 to-gold-600',    border: 'border-gold-500/20',  text: 'text-gold-400',    bg: 'bg-gold-500/10',   glow: 'shadow-[0_0_15px_rgba(212,168,83,0.15)]' },
  RegionalVendor: { color: 'from-violet-400 to-purple-600', border: 'border-violet-500/20', text: 'text-violet-400', bg: 'bg-violet-500/10', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]' },
  CityVendor:     { color: 'from-cyan-400 to-sky-600',     border: 'border-cyan-500/20',  text: 'text-cyan-400',    bg: 'bg-cyan-500/10',   glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]' },
  LocalVendor:    { color: 'from-emerald-400 to-green-600', border: 'border-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(ENDPOINTS.ADMIN.METRICS);
        if (res.data.success) {
          setMetrics(res.data.data);
        }
      } catch (err) {
        console.error('Admin Metrics Error:', err);
        setError('Failed to load system metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <Loader size="lg" text="Loading System Metrics..." />
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

  const { rolesBreakdown = [], totalGlobalCabs = 0, totalGlobalDrivers = 0 } = metrics || {};
  const totalVendors = rolesBreakdown.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="p-6 md:p-10 relative overflow-hidden">

      {/* Ambient Glows */}
      <div className="absolute top-[-25%] left-[-10%] w-[600px] h-[600px] bg-red-500/[0.02] rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-30%] right-[-15%] w-[500px] h-[500px] bg-gold-500/[0.03] rounded-full blur-[140px] pointer-events-none"></div>

      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20" style={{ boxShadow: '0 0 25px rgba(239,68,68,0.12)' }}>
            <Shield className="text-red-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wider uppercase text-gold-gradient">
              System Command Center
            </h1>
            <p className="text-sm text-gray-400 font-medium tracking-widest uppercase mt-1">
              SUPER ADMIN PORTAL
            </p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">System Online</span>
        </div>
      </motion.header>

      {/* KPI Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10"
      >
        {/* KPI: Total Fleet */}
        <motion.div variants={itemVariants} className="glass-panel-strong p-6 rounded-2xl group cursor-pointer deep-hover-card transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/[0.06] rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Global Fleet</h3>
            <div className="p-2.5 bg-gold-500/10 rounded-xl border border-gold-500/15" style={{ boxShadow: '0 0 12px rgba(212,168,83,0.1)' }}>
              <CarFront className="text-gold-400" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 relative z-10">
            <span className="text-4xl font-bold font-display text-white">{totalGlobalCabs}</span>
            <span className="text-gold-500 text-sm font-medium">Vehicles</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 relative z-10">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">System-wide Fleet</span>
          </div>
        </motion.div>

        {/* KPI: Total Drivers */}
        <motion.div variants={itemVariants} className="glass-panel-strong p-6 rounded-2xl group cursor-pointer deep-hover-card transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.06] rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Global Drivers</h3>
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/15" style={{ boxShadow: '0 0 12px rgba(6,182,212,0.1)' }}>
              <Users className="text-cyan-400" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 relative z-10">
            <span className="text-4xl font-bold font-display text-white">{totalGlobalDrivers}</span>
            <span className="text-cyan-500 text-sm font-medium">Registered</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 relative z-10">
            <Activity size={14} className="text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium">All Networks Combined</span>
          </div>
        </motion.div>

        {/* KPI: Total Vendor Accounts */}
        <motion.div variants={itemVariants} className="glass-panel-strong p-6 rounded-2xl group cursor-pointer deep-hover-card transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/[0.06] rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Vendor Network</h3>
            <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/15" style={{ boxShadow: '0 0 12px rgba(139,92,246,0.1)' }}>
              <Globe className="text-violet-400" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-3 relative z-10">
            <span className="text-4xl font-bold font-display text-white">{totalVendors}</span>
            <span className="text-violet-500 text-sm font-medium">Accounts</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 relative z-10">
            <TrendingUp size={14} className="text-violet-400" />
            <span className="text-xs text-violet-400 font-medium">Across All Tiers</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Roles Breakdown Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-panel p-8 rounded-2xl relative z-10"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-display font-semibold tracking-wide text-white">Hierarchy Breakdown</h2>
            <p className="text-gray-500 text-sm mt-1">Distribution of vendor accounts across all tiers.</p>
          </div>
          <button onClick={() => navigate('/admin/vendors')} className="text-gold-400 text-xs font-semibold flex items-center gap-1 hover:text-gold-300 transition-colors uppercase tracking-wider">
            View Network <ChevronRight size={14} />
          </button>
        </div>

        {rolesBreakdown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Globe size={36} className="text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">No vendor accounts found in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {rolesBreakdown.map((item, index) => {
              const config = ROLE_CONFIG[item._id] || ROLE_CONFIG.LocalVendor;
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  className={`relative p-5 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-sm ${config.glow} cursor-pointer transition-all duration-300 hover:scale-[1.03]`}
                >
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r ${config.color} rounded-full opacity-60`}></div>

                  <div className="flex flex-col items-center text-center pt-2">
                    <span className={`text-3xl font-bold font-display ${config.text}`}>{item.count}</span>
                    <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-widest mt-2">
                      {item._id.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
