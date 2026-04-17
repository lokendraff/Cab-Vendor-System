import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Car, User2, CheckCircle2, XCircle, AlertCircle,
  Mail, Clock, Loader2, ShieldCheck, Inbox, ChevronRight,
  ZoomIn, ZoomOut, RotateCw, Maximize2, FileImage, Send,
  MessageSquare, X as XIcon, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import { formatDate, truncate } from '../../utils/helpers';
import MissingDocsPanel from './MissingDocsPanel';

// ─── Entity metadata ────────────────────────────────────────────────
const ENTITY_META = {
  cab: {
    label: 'Vehicle (RC)',
    icon: Car,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    accent: 'rgba(6,182,212,0.15)',
  },
  driver: {
    label: 'Driver Profile',
    icon: User2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    accent: 'rgba(139,92,246,0.15)',
  },
};

// ─── Skeleton loader ────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/[0.04] rounded-xl ${className}`} />
);

const QueueSkeleton = () => (
  <div className="space-y-2 p-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-4 rounded-xl border border-white/[0.04] flex items-start gap-3">
        <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
          <Skeleton className="h-2 w-2/5" />
        </div>
      </div>
    ))}
  </div>
);

const PanelSkeleton = () => (
  <div className="h-full flex flex-col gap-5 p-6">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>
    </div>
    <Skeleton className="flex-1 rounded-2xl min-h-[220px]" />
    <div className="grid grid-cols-2 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-9 rounded-xl" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3 mt-auto">
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-12 rounded-xl" />
    </div>
  </div>
);

// ─── Document image viewer ──────────────────────────────────────────
// tabs: Array<{ key: string, label: string, url: string | null }>
// url:  fallback single URL (used for non-driver entities like cabs)
const DocImageViewer = ({ tabs = null, url = null, alt = 'Document' }) => {
  const [activeTab, setActiveTab] = useState(() => tabs?.[0]?.key ?? null);
  const [zoom, setZoom]           = useState(1);
  const [rotation, setRotation]   = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [imgError, setImgError]   = useState(false);

  // Derive the currently visible URL
  const activeUrl = tabs
    ? (tabs.find(t => t.key === activeTab)?.url ?? null)
    : url;

  // Reset viewer state whenever the tab changes
  const handleTabChange = (key) => {
    if (key === activeTab) return;
    setActiveTab(key);
    setZoom(1);
    setRotation(0);
    setImgError(false);
  };

  const zoomIn  = () => setZoom(z => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const rotate  = () => setRotation(r => (r + 90) % 360);
  const reset   = () => { setZoom(1); setRotation(0); };

  // Tab colour accents
  const TAB_ACCENT = {
    dl:     { active: 'bg-violet-500/15 text-violet-300 border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]', inactive: 'text-gray-500 border-white/[0.06] hover:text-violet-300 hover:border-violet-500/25' },
    rc:     { active: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]',       inactive: 'text-gray-500 border-white/[0.06] hover:text-cyan-300 hover:border-cyan-500/25' },
    permit: { active: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',  inactive: 'text-gray-500 border-white/[0.06] hover:text-amber-300 hover:border-amber-500/25' },
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Document Tabs (only rendered for drivers) ── */}
      {tabs && tabs.length > 1 && (
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-2 shrink-0">
          {tabs.map(tab => {
            const accent = TAB_ACCENT[tab.key] || TAB_ACCENT.dl;
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                  isActive ? accent.active : accent.inactive
                }`}
              >
                <FileImage size={10} />
                {tab.label}
              </button>
            );
          })}
          <span className="ml-auto text-[9px] text-gray-700 font-medium tracking-wider uppercase">
            {tabs.find(t => t.key === activeTab)?.label ?? ''}
          </span>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className={`flex items-center justify-between px-3 py-2 border-b border-white/[0.05] bg-white/[0.02] shrink-0 ${
        tabs && tabs.length > 1 ? '' : 'rounded-t-2xl'
      }`}>
        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.18em]">
          Document Preview
        </span>
        <div className="flex items-center gap-1">
          {[
            { icon: ZoomOut,   fn: zoomOut,  tip: 'Zoom out' },
            { icon: ZoomIn,    fn: zoomIn,   tip: 'Zoom in' },
            { icon: RotateCw,  fn: rotate,   tip: 'Rotate' },
            { icon: Maximize2, fn: () => setFullscreen(true), tip: 'Fullscreen' },
          ].map(({ icon: Icon, fn, tip }) => (
            <button
              key={tip}
              onClick={fn}
              title={tip}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition-all duration-150"
            >
              <Icon size={13} />
            </button>
          ))}
          {(zoom !== 1 || rotation !== 0) && (
            <button onClick={reset} title="Reset"
              className="px-2 py-1 rounded-lg text-[9px] font-bold text-amber-400 hover:bg-amber-500/10 transition-all tracking-wider uppercase">
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Image area ── */}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-space-900 rounded-b-2xl border border-white/[0.05] border-t-0 relative min-h-0">
        {!activeUrl || imgError ? (
          <div className="flex flex-col items-center gap-3 text-center p-8">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <FileImage size={36} className="text-gray-700" />
            </div>
            <p className="text-xs text-gray-600 font-medium tracking-wider uppercase">
              {imgError ? 'Failed to load image' : 'No document image available'}
            </p>
            <p className="text-[10px] text-gray-700 max-w-[200px] leading-relaxed">
              The document image could not be retrieved for this record.
            </p>
          </div>
        ) : (
          <img
            key={activeUrl} // Force re-mount on tab change to clear stale error
            src={activeUrl}
            alt={alt}
            onError={() => setImgError(true)}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.25s ease',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              cursor: zoom > 1 ? 'grab' : 'default',
            }}
          />
        )}
      </div>

      {/* ── Fullscreen overlay ── */}
      <AnimatePresence>
        {fullscreen && activeUrl && !imgError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setFullscreen(false)}
          >
            <button className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
              <XIcon size={20} className="text-white" />
            </button>
            <img
              src={activeUrl}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── OCR text field ─────────────────────────────────────────────────
const OcrField = ({ label, value, mono = false, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-1">{label}</p>
    <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 font-medium truncate">
      {value
        ? <span className={mono ? 'font-mono text-[11px] text-gray-400' : ''}>{value}</span>
        : <span className="text-gray-600 italic font-normal text-xs">N/A</span>
      }
    </div>
  </div>
);

// ─── Rejection modal ────────────────────────────────────────────────
const RejectModal = ({ isOpen, onCancel, onConfirm, isSending }) => {
  const [reason, setReason] = useState('');
  const textRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setTimeout(() => textRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const QUICK_REASONS = [
    'Image is blurry or unreadable',
    'Document appears to be expired',
    'Incorrect document type submitted',
    'Information does not match records',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md glass-panel rounded-2xl border border-red-500/20 overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(239,68,68,0.08)' }}
          >
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <MessageSquare size={16} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Rejection Reason</h3>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Provide a clear reason — this will be visible to the vendor.
                </p>
              </div>
              <button onClick={onCancel} className="ml-auto p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-600 hover:text-gray-300 transition-all">
                <XIcon size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Quick pick reasons */}
              <div>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-2">
                  Quick Select
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REASONS.map(q => (
                    <button
                      key={q}
                      onClick={() => setReason(q)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-medium transition-all duration-150
                                  ${reason === q
                                    ? 'bg-red-500/15 text-red-300 border-red-500/30'
                                    : 'bg-white/[0.03] text-gray-400 border-white/[0.06] hover:border-white/[0.12] hover:text-gray-300'
                                  }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free-text area */}
              <div>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-1">
                  Custom Reason (Optional)
                </p>
                <textarea
                  ref={textRef}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Describe why this document is being rejected..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-xl
                             focus:outline-none focus:border-red-500/30 focus:bg-white/[0.05] transition-all resize-none
                             placeholder:text-gray-700"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-white/[0.08]
                             hover:text-gray-300 hover:border-white/[0.14] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(reason)}
                  disabled={isSending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-red-400 border border-red-500/25
                             bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/40
                             hover:shadow-[0_0_20px_rgba(239,68,68,0.12)] transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Confirm Reject
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Queue card ─────────────────────────────────────────────────────
const QueueCard = ({ item, entityType, isSelected, onClick }) => {
  const meta = ENTITY_META[entityType];
  const Icon = meta.icon;
  const submitter = item.vendorId;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group
        ${isSelected
          ? 'bg-gold-500/[0.07] border-gold-500/30 shadow-[0_0_18px_rgba(212,168,83,0.07)]'
          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.10]'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${meta.bg} ${meta.border}`}
             style={{ boxShadow: `0 0 10px ${meta.accent}` }}>
          <Icon size={13} className={meta.color} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs font-bold text-white truncate">
              {entityType === 'cab'
                ? (item.registrationNumber || 'Unknown Cab')
                : (item.name || 'Unknown Driver')}
            </p>
            <ChevronRight
              size={12}
              className={`shrink-0 transition-transform duration-200 ${isSelected ? 'text-gold-400 translate-x-0.5' : 'text-gray-700 group-hover:text-gray-500'}`}
            />
          </div>

          <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border} mb-1.5`}>
            <Icon size={8} /> {meta.label}
          </span>

          {submitter && (
            <p className="flex items-center gap-1 text-[10px] text-gray-600 truncate">
              <Mail size={9} className="shrink-0" />
              {truncate(submitter.name, 20)}
            </p>
          )}
          <p className="flex items-center gap-1 text-[9px] text-gray-700 mt-0.5">
            <Clock size={9} />
            {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

// ─── Review panel (split-pane) ──────────────────────────────────────
const ReviewPanel = ({ item, entityType, onApprove, onReject, isProcessing }) => {
  const meta = ENTITY_META[entityType];
  const Icon = meta.icon;
  const submitter = item.vendorId;

  // ── Build tabbed docs for drivers; cabs use a plain null URL ──
  const driverTabs = entityType === 'driver'
    ? [
        { key: 'dl',     label: 'DL',     url: item.documents?.drivingLicense?.documentUrl     || null },
        { key: 'rc',     label: 'RC',     url: item.documents?.registrationCertificate?.documentUrl || null },
        { key: 'permit', label: 'Permit', url: item.documents?.permitAndPollution?.documentUrl  || null },
      ]
    : null;

  // OCR / extracted data fields
  const ocrFields = entityType === 'cab'
    ? [
        { label: 'Registration No.',  value: item.registrationNumber, mono: true },
        { label: 'Model',             value: item.model },
        { label: 'Fuel Type',         value: item.fuelType },
        { label: 'Seating Capacity',  value: item.seatingCapacity?.toString() },
        { label: 'Current Status',    value: item.approvalStatus },
        { label: 'Submitted On',      value: formatDate(item.createdAt), fullWidth: true },
      ]
    : [
        { label: 'Driver Name',       value: item.name },
        { label: 'Contact #',         value: item.contactNumber, mono: true },
        { label: 'DL Status',         value: item.documents?.drivingLicense?.isVerified ? 'Verified ✓' : 'Unverified' },
        { label: 'DL Expiry',         value: formatDate(item.documents?.drivingLicense?.expiryDate) },
        { label: 'RC Expiry',         value: formatDate(item.documents?.registrationCertificate?.expiryDate) },
        { label: 'Approval Status',   value: item.approvalStatus },
        { label: 'Submitted On',      value: formatDate(item.createdAt), fullWidth: true },
      ];

  return (
    <motion.div
      key={item._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full flex flex-col gap-4"
    >
      {/* Review header */}
      <div className="flex items-center gap-3 shrink-0">
        <div className={`p-2.5 rounded-xl border ${meta.bg} ${meta.border}`}
             style={{ boxShadow: `0 0 16px ${meta.accent}` }}>
          <Icon className={meta.color} size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-display font-bold text-white tracking-wide truncate">
            {entityType === 'cab' ? (item.registrationNumber || 'Cab') : (item.name || 'Driver')}
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            By <span className="text-gray-400 font-semibold">{submitter?.name || 'Unknown'}</span>
            {' · '}{submitter?.email || ''}
          </p>
        </div>
      </div>

      {/* ── SPLIT PANE ───────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-0">

        {/* Left — Tabbed Document Image Viewer */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-white/[0.06] min-h-[260px]">
          <DocImageViewer
            tabs={driverTabs}
            url={null} 
            alt={entityType === 'cab' ? item.registrationNumber : item.name}
          />
        </div>

        {/* Right — OCR Extracted Data */}
        <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02] shrink-0 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-gold-400 to-gold-700" />
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.18em]">
              OCR Extracted Data
            </span>
            <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/15 rounded-full uppercase tracking-wider">
              Tesseract
            </span>
          </div>

          {/* Fields grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {ocrFields.map(f => (
                <OcrField key={f.label} label={f.label} value={f.value} mono={f.mono} fullWidth={f.fullWidth} />
              ))}
            </div>

            {/* Submitter info */}
            {submitter && (
              <div className="mt-4 pt-4 border-t border-white/[0.05] grid grid-cols-2 gap-3">
                <OcrField label="Submitted By" value={submitter.name} />
                <OcrField label="Submitter Role" value={submitter.role?.replace(/([A-Z])/g, ' $1').trim()} />
                <OcrField label="Submitter Email" value={submitter.email} fullWidth />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <button
          id="reject-doc-btn"
          onClick={onReject}
          disabled={!!isProcessing}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold
                     uppercase tracking-wide transition-all duration-300
                     bg-red-500/10 text-red-400 border border-red-500/20
                     hover:bg-red-500/18 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.14)]
                     disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isProcessing === 'reject'
            ? <Loader2 size={14} className="animate-spin" />
            : <XCircle size={14} />}
          Reject Document
        </button>

        <button
          id="approve-doc-btn"
          onClick={onApprove}
          disabled={!!isProcessing}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold
                     uppercase tracking-wide transition-all duration-300
                     bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
                     hover:bg-emerald-500/18 hover:border-emerald-500/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.18)]
                     disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isProcessing === 'approve'
            ? <Loader2 size={14} className="animate-spin" />
            : <CheckCircle2 size={14} />}
          Approve Document
        </button>
      </div>
    </motion.div>
  );
};

// ─── Empty state ────────────────────────────────────────────────────
const EmptyApprovals = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center h-full py-20 text-center px-6"
  >
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl scale-150" />
      <div className="relative p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05]
                      shadow-[0_0_40px_rgba(16,185,129,0.10)]">
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

// ─── Main page component ────────────────────────────────────────────
const PendingDocumentApprovals = () => {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [queue, setQueue]           = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [processing, setProcessing] = useState(null);   // 'approve' | 'reject' | null
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get(ENDPOINTS.APPROVALS.PENDING);
      if (data.success) {
        const cabs    = (data.data.cabs    || []).map(c => ({ ...c, _entityType: 'cab' }));
        const drivers = (data.data.drivers || []).map(d => ({ ...d, _entityType: 'driver' }));
        const merged  = [...cabs, ...drivers].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setQueue(merged);
        if (merged.length > 0) setSelectedId(prev => prev || merged[0]._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending approvals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  // Called from Review panel's Approve button
  const handleApprove = async () => {
    const item = queue.find(q => q._id === selectedId);
    if (!item) return;
    try {
      setProcessing('approve');
      const { data } = await API.put(
        ENDPOINTS.APPROVALS.PROCESS(item._entityType, item._id),
        { status: 'approved' }
      );
      if (data.success) {
        const name = item._entityType === 'cab' ? item.registrationNumber : item.name;
        toast.success(`${name} approved ✅`, {
          style: { background: '#0f1117', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px' },
        });
        removeFromQueue(item._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.');
    } finally {
      setProcessing(null);
    }
  };

  // Opens the rejection modal
  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  // Called when user confirms rejection reason
  const handleRejectConfirm = async (reason) => {
    const item = queue.find(q => q._id === selectedId);
    if (!item) return;
    try {
      setProcessing('reject');
      const { data } = await API.put(
        ENDPOINTS.APPROVALS.PROCESS(item._entityType, item._id),
        { status: 'rejected', remarks: reason || 'Rejected by SuperVendor' }
      );
      if (data.success) {
        const name = item._entityType === 'cab' ? item.registrationNumber : item.name;
        toast.success(`${name} rejected`, {
          style: { background: '#0f1117', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '12px' },
        });
        setShowRejectModal(false);
        removeFromQueue(item._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setProcessing(null);
    }
  };

  const removeFromQueue = (id) => {
    setQueue(prev => {
      const next = prev.filter(q => q._id !== id);
      setSelectedId(next.length > 0 ? next[0]._id : null);
      return next;
    });
  };

  const selected    = queue.find(q => q._id === selectedId);
  const totalPending = queue.length;

  return (
    <div className="p-6 md:p-8 relative flex flex-col gap-6 min-h-screen overflow-x-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/[0.022] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-gold-500/[0.018] rounded-full blur-[140px] pointer-events-none" />

      {/* ── Page Header ─────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10"
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
            <p className="text-sm text-gray-500 font-medium tracking-wide mt-0.5">
              Review pending cab &amp; driver document submissions from your network
            </p>
          </div>
        </div>

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl"
          >
            <Clock size={14} className="text-amber-400" />
            <span className="text-sm font-bold text-white">{totalPending}</span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending</span>
            {totalPending > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />}
          </motion.div>
        )}
      </motion.header>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1">
        {loading ? (
          /* Skeleton state */
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 h-[700px]">
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
                <Skeleton className="h-3 w-32" />
              </div>
              <QueueSkeleton />
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <PanelSkeleton />
            </div>
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
          <div className="glass-panel rounded-2xl min-h-[380px] flex items-center justify-center">
            <EmptyApprovals />
          </div>
        ) : (
          /* Main split view */
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5"
               style={{ minHeight: '680px', maxHeight: '80vh' }}>

            {/* ── Queue sidebar ──────────────────────────────── */}
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.18em]">
                  Queue · {totalPending}
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[9px] font-bold text-cyan-400">
                    <Car size={9} /> RC
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-bold text-violet-400">
                    <User2 size={9} /> DL
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
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

            {/* ── Review panel ───────────────────────────────── */}
            <div className="glass-panel rounded-2xl p-5 overflow-y-auto flex flex-col">
              <AnimatePresence mode="wait">
                {selected ? (
                  <ReviewPanel
                    key={selected._id}
                    item={selected}
                    entityType={selected._entityType}
                    onApprove={handleApprove}
                    onReject={handleRejectClick}
                    isProcessing={processing}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-4 py-20"
                  >
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <Eye size={36} className="text-gray-700" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Select a document from the queue to begin review
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ── Reminder Panel ──────────────────────────────────────── */}
      <div className="relative z-10">
        <MissingDocsPanel />
      </div>

      {/* ── Rejection modal ─────────────────────────────────────── */}
      <RejectModal
        isOpen={showRejectModal}
        onCancel={() => { setShowRejectModal(false); setProcessing(null); }}
        onConfirm={handleRejectConfirm}
        isSending={processing === 'reject'}
      />
    </div>
  );
};

export default PendingDocumentApprovals;
