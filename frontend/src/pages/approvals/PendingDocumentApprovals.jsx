import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Car, User2, CheckCircle2, XCircle, AlertCircle,
  CalendarDays, Hash, Fuel, Users, Mail, Clock, Loader2,
  ShieldCheck, Inbox, ChevronRight, FileImage
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import { formatDate, truncate } from '../../utils/helpers';
import MissingDocsPanel from './MissingDocsPanel';

// ─── Constants ─────────────────────────────────────────────────────
const ENTITY_META = {
  cab: {
    label: 'Vehicle (RC)',
    icon: Car,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.12)]',
  },
  driver: {
    label: 'Driver Profile',
    icon: User2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    glow: 'shadow-[0_0_12px_rgba(139,92,246,0.12)]',
  },
};

// ─── Tiny sub-components ───────────────────────────────────────────
const OcrField = ({ label, value, mono = false }) => (
  <div>
    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-1">{label}</p>
    <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 font-medium truncate">
      {value ? (
        <span className={mono ? 'font-mono text-[12px] text-gray-400' : ''}>{value}</span>
      ) : (
        <span className="text-gray-600 italic font-normal">N/A</span>
      )}
    </div>
  </div>
);

const QueueCard = ({ item, entityType, isSelected, onClick }) => {
  const meta = ENTITY_META[entityType];
  const Icon = meta.icon;
  const submitter = item.vendorId;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
        ${isSelected
          ? 'bg-gold-500/[0.06] border-gold-500/30 shadow-[0_0_20px_rgba(212,168,83,0.08)]'
          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.10]'
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Entity type icon */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${meta.bg} ${meta.border} ${meta.glow}`}>
          <Icon size={15} className={meta.color} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm font-bold text-white truncate">
              {entityType === 'cab'
                ? (item.registrationNumber || 'Unknown Cab')
                : (item.name || 'Unknown Driver')}
            </p>
            <ChevronRight
              size={14}
              className={`shrink-0 transition-all duration-200 ${isSelected ? 'text-gold-400 translate-x-0.5' : 'text-gray-700 group-hover:text-gray-500'}`}
            />
          </div>

          {/* Entity type badge */}
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}>
            <Icon size={9} /> {meta.label}
          </span>

          {/* Submitted by */}
          {submitter && (
            <p className="flex items-center gap-1 text-[11px] text-gray-600 mt-1.5 truncate">
              <Mail size={10} className="shrink-0" />
              {truncate(submitter.name, 22)} · {submitter.role?.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          )}

          {/* Date */}
          <p className="flex items-center gap-1 text-[10px] text-gray-700 mt-0.5">
            <Clock size={10} />
            {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

// ─── Review Panel ──────────────────────────────────────────────────
const ReviewPanel = ({ item, entityType, onApprove, onReject, isProcessing }) => {
  const meta = ENTITY_META[entityType];
  const Icon = meta.icon;
  const submitter = item.vendorId;

  // Build OCR-style fields depending on entity type
  const ocrFields = entityType === 'cab'
    ? [
        { label: 'Registration Number', value: item.registrationNumber, mono: true },
        { label: 'Model',               value: item.model },
        { label: 'Fuel Type',           value: item.fuelType },
        { label: 'Seating Capacity',    value: item.seatingCapacity?.toString() },
        { label: 'Approval Status',     value: item.approvalStatus },
        { label: 'Submitted By',        value: submitter?.name },
        { label: 'Submitter Email',     value: submitter?.email },
        { label: 'Submitted On',        value: formatDate(item.createdAt) },
      ]
    : [
        { label: 'Driver Name',          value: item.name },
        { label: 'Contact Number',       value: item.contactNumber, mono: true },
        { label: 'DL URL',              value: item.documents?.drivingLicense?.documentUrl ? 'Uploaded ✓' : null },
        { label: 'DL Expiry',           value: formatDate(item.documents?.drivingLicense?.expiryDate) },
        { label: 'RC Expiry',           value: formatDate(item.documents?.registrationCertificate?.expiryDate) },
        { label: 'Approval Status',      value: item.approvalStatus },
        { label: 'Submitted By',         value: submitter?.name },
        { label: 'Submitted On',         value: formatDate(item.createdAt) },
      ];

  return (
    <motion.div
      key={item._id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      {/* Review header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-3 rounded-xl border ${meta.bg} ${meta.border}`} style={{ boxShadow: meta.glow.replace('shadow-', '') }}>
          <Icon className={meta.color} size={22} />
        </div>
        <div>
          <h3 className="text-base font-display font-bold text-white tracking-wide">
            {entityType === 'cab'
              ? (item.registrationNumber || 'Cab Document')
              : (item.name || 'Driver Document')}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Submitted by <span className="text-gray-400 font-semibold">{submitter?.name || 'Unknown'}</span> on {formatDate(item.createdAt)}
          </p>
        </div>
      </div>

      {/* Document Image Placeholder */}
      <div className="w-full h-40 rounded-2xl bg-space-900 border border-white/[0.05] flex flex-col items-center justify-center gap-3 mb-5 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <FileImage size={28} className="text-gray-600" />
        </div>
        <p className="text-xs text-gray-600 font-medium tracking-wider uppercase">Document Image</p>
        <p className="text-[10px] text-gray-700">Preview not available in this build</p>
      </div>

      {/* OCR Extracted Data */}
      <div className="glass-panel rounded-2xl p-4 mb-5 flex-1 overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-gold-400 to-gold-700" />
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.18em]">
            Extracted Record Data
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ocrFields.map((field) => (
            <OcrField key={field.label} label={field.label} value={field.value} mono={field.mono} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <button
          onClick={onReject}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold
                     uppercase tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                     bg-red-500/10 text-red-400 border border-red-500/20
                     hover:bg-red-500/20 hover:border-red-500/35 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]
                     active:scale-[0.98]"
        >
          {isProcessing === 'reject' ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <XCircle size={15} />
          )}
          Reject
        </button>

        <button
          onClick={onApprove}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold
                     uppercase tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                     bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
                     hover:bg-emerald-500/20 hover:border-emerald-500/35 hover:shadow-[0_0_20px_rgba(16,185,129,0.18)]
                     active:scale-[0.98]"
        >
          {isProcessing === 'approve' ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCircle2 size={15} />
          )}
          Approve
        </button>
      </div>
    </motion.div>
  );
};

// ─── Empty State ───────────────────────────────────────────────────
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center h-full py-20 text-center px-6"
  >
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl scale-150" />
      <div className="relative p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.10)]">
        <ShieldCheck className="text-emerald-400" size={44} />
      </div>
    </div>
    <h3 className="text-xl font-display font-bold text-white tracking-wide mb-2">Inbox Zero!</h3>
    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
      All documents in your network have been reviewed. No pending approvals remain.
    </p>
    <div className="flex items-center gap-2 mt-5 text-emerald-500/40">
      <Inbox size={13} />
      <span className="text-xs font-medium tracking-widest uppercase">All Verified</span>
      <Inbox size={13} />
    </div>
  </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────
const PendingDocumentApprovals = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Flat list: each item has { ...entityData, _entityType: 'cab'|'driver' }
  const [queue, setQueue] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [processing, setProcessing] = useState(null); // 'approve' | 'reject' | null

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get(ENDPOINTS.APPROVALS.PENDING);
      if (data.success) {
        const cabs    = (data.data.cabs    || []).map(c => ({ ...c, _entityType: 'cab' }));
        const drivers = (data.data.drivers || []).map(d => ({ ...d, _entityType: 'driver' }));
        const merged  = [...cabs, ...drivers].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setQueue(merged);
        // Auto-select first item when queue loads
        if (merged.length > 0 && !selectedId) {
          setSelectedId(merged[0]._id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending approvals.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const handleProcess = async (action) => {
    const item = queue.find(q => q._id === selectedId);
    if (!item) return;

    try {
      setProcessing(action);
      const { data } = await API.put(
        ENDPOINTS.APPROVALS.PROCESS(item._entityType, item._id),
        { status: action === 'approve' ? 'approved' : 'rejected' }
      );

      if (data.success) {
        const actionLabel = action === 'approve' ? 'approved ✅' : 'rejected';
        const entityLabel = item._entityType === 'cab'
          ? item.registrationNumber
          : item.name;
        toast.success(`${entityLabel} ${actionLabel}`, {
          style: {
            background: '#0f1117',
            color: action === 'approve' ? '#34d399' : '#f87171',
            border: `1px solid ${action === 'approve' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
            borderRadius: '12px',
          },
        });

        // Optimistic: remove from queue, select next item
        setQueue(prev => {
          const next = prev.filter(q => q._id !== selectedId);
          setSelectedId(next.length > 0 ? next[0]._id : null);
          return next;
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const selected = queue.find(q => q._id === selectedId);
  const totalPending = queue.length;

  return (
    <div className="p-6 md:p-10 relative h-full flex flex-col">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/[0.025] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] bg-gold-500/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* ── Header ────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-5 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 rounded-2xl border border-violet-500/20"
               style={{ boxShadow: '0 0 22px rgba(139,92,246,0.10)' }}>
            <FileText className="text-violet-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wider uppercase text-gold-gradient">
              Document Approvals
            </h1>
            <p className="text-sm text-gray-500 font-medium tracking-wide mt-1">
              Review and process pending cab &amp; driver submissions
            </p>
          </div>
        </div>

        {/* Counter chip */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl"
          >
            <Clock size={15} className="text-amber-400" />
            <span className="text-sm font-bold text-white">{totalPending}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending</span>
            {totalPending > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
            )}
          </motion.div>
        )}
      </motion.header>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="text-gold-400 animate-spin" size={34} />
            <p className="text-sm text-gray-600 font-medium tracking-widest uppercase">Loading queue…</p>
          </div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-2xl flex flex-col items-center gap-3 text-center">
            <AlertCircle className="text-red-500" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
            <button onClick={fetchQueue}
              className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-white transition-colors mt-1">
              Retry
            </button>
          </div>
        ) : queue.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 h-full">

            {/* ── Left: Queue List ─────────────────────────── */}
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
              {/* List header */}
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.18em]">
                  Queue · {totalPending} items
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400">
                    <Car size={10} /> Cabs
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-violet-400">
                    <User2 size={10} /> Drivers
                  </span>
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <AnimatePresence mode="popLayout">
                  {queue.map(item => (
                    <QueueCard
                      key={item._id}
                      item={item}
                      entityType={item._entityType}
                      isSelected={item._id === selectedId}
                      onClick={() => setSelectedId(item._id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Right: Review Panel ──────────────────────── */}
            <div className="glass-panel rounded-2xl p-6 overflow-y-auto flex flex-col">
              <AnimatePresence mode="wait">
                {selected ? (
                  <ReviewPanel
                    key={selected._id}
                    item={selected}
                    entityType={selected._entityType}
                    onApprove={() => handleProcess('approve')}
                    onReject={() => handleProcess('reject')}
                    isProcessing={processing}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-3 py-20"
                  >
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <FileText size={32} className="text-gray-700" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Select a document from the queue to review
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}
      </div>

      {/* ── Reminder Panel (below queue) ─────────────────────────── */}
      <div className="relative z-10 mt-6">
        <MissingDocsPanel />
      </div>
    </div>
  );
};

export default PendingDocumentApprovals;
