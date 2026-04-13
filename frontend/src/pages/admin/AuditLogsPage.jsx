import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertCircle, UserCircle, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';
import { formatDateTime } from '../../utils/helpers';

// Map backend action types to UI-friendly labels and color schemes
const ACTION_CONFIG = {
  BLOCK_VENDOR: { label: 'Blocked Vendor', color: 'red', icon: '🚫' },
  UNBLOCK_VENDOR: { label: 'Unblocked Vendor', color: 'emerald', icon: '✅' },
  BLOCK_CAB: { label: 'Blocked Cab', color: 'red', icon: '🚗' },
  APPROVE_DOCUMENT: { label: 'Approved Document', color: 'emerald', icon: '📄' },
  REJECT_DOCUMENT: { label: 'Rejected Document', color: 'amber', icon: '📄' },
};

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(ENDPOINTS.ADMIN.AUDIT_LOGS);
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getConfig = (actionType) => ACTION_CONFIG[actionType] || { label: actionType, color: 'gray', icon: '⚙️' };

  return (
    <div className="p-6 md:p-10 relative">
      {/* Ambient glow */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-500/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3 text-white">
          <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
            <ShieldAlert className="text-gold-400" size={22} />
          </div>
          Audit Trail
        </h1>
        <p className="text-gray-500 text-sm mt-2 ml-12">Complete history of administrative actions in your network</p>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative z-10"
      >
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Fetching audit logs..." /></div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-2xl text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="glass-panel p-20 rounded-2xl text-center border border-dashed border-white/10">
            <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 inline-block mb-4">
              <ShieldAlert className="text-gold-500/40" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">No audit logs yet</h3>
            <p className="text-sm text-gray-600 mt-1">Administrative actions like blocking vendors will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => {
              const config = getConfig(log.actionType);
              const colorMap = {
                red: { bg: 'bg-red-500/10', border: 'border-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
                emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
                amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
                gray: { bg: 'bg-gray-500/10', border: 'border-gray-500/15', text: 'text-gray-400', dot: 'bg-gray-400' },
              };
              const c = colorMap[config.color] || colorMap.gray;

              return (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="glass-panel rounded-2xl p-5 glass-panel-hover transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center pt-1">
                      <div className={`w-3 h-3 rounded-full ${c.dot} shadow-[0_0_8px] ${c.dot === 'bg-red-400' ? 'shadow-red-500/40' : c.dot === 'bg-emerald-400' ? 'shadow-emerald-500/40' : 'shadow-amber-500/40'}`}></div>
                      {index < logs.length - 1 && (
                        <div className="w-px h-full bg-white/[0.04] mt-2 min-h-[30px]"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        {/* Action Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.bg} ${c.text} border ${c.border} uppercase tracking-wider`}>
                            {config.icon} {config.label}
                          </span>
                          <ArrowRight size={12} className="text-gray-600 hidden sm:block" />
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            {log.targetEntityType}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <span className="text-[10px] text-gray-600 font-medium tracking-wide">
                          {formatDateTime(log.createdAt)}
                        </span>
                      </div>

                      {/* Actor */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
                        <UserCircle size={14} className="text-gold-500/60 shrink-0" />
                        <span className="font-medium text-gray-300">{log.performedBy?.name || 'System'}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500">{log.performedBy?.email}</span>
                        {log.performedBy?.role && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-gold-500/70 font-semibold">{log.performedBy.role}</span>
                          </>
                        )}
                      </div>

                      {/* Reason */}
                      {log.reason && (
                        <p className="text-xs text-gray-500 italic pl-5 border-l-2 border-white/[0.04] mt-2">
                          "{log.reason}"
                        </p>
                      )}
                    </div>
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

export default AuditLogsPage;
