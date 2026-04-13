import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Upload, AlertCircle, Eye, ShieldCheck, ShieldX, Clock, ExternalLink, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';
import { formatDate, isExpired } from '../../utils/helpers';
import { DOC_TYPES } from '../../utils/constants';

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | verified | pending | expired

  // Upload Modal State
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ driverId: '', documentType: '' });
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, driversRes] = await Promise.all([
        API.get(ENDPOINTS.DOCUMENTS.GET_MY),
        API.get(ENDPOINTS.DRIVERS.GET_MY)
      ]);
      if (docsRes.data.success) setDocuments(docsRes.data.data);
      if (driversRes.data.success) setDrivers(driversRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.driverId || !uploadForm.documentType || !uploadFile) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('driverId', uploadForm.driverId);
      formData.append('documentType', uploadForm.documentType);
      formData.append('file', uploadFile);

      const { data } = await API.post(ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        const ocrMsg = data.verificationResult?.isVerified
          ? '✅ Document verified by AI!'
          : `⚠️ ${data.verificationResult?.message || 'Pending manual review'}`;
        toast.success(`Uploaded! ${ocrMsg}`, { duration: 5000 });
        setUploadModal(false);
        setUploadForm({ driverId: '', documentType: '' });
        setUploadFile(null);
        fetchData(); // Refresh list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Filtering logic
  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      (doc.driverId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(search.toLowerCase());

    if (filter === 'verified') return matchesSearch && doc.isVerified;
    if (filter === 'pending') return matchesSearch && !doc.isVerified && !isExpired(doc.expiryDate);
    if (filter === 'expired') return matchesSearch && isExpired(doc.expiryDate);
    return matchesSearch;
  });

  const stats = {
    total: documents.length,
    verified: documents.filter(d => d.isVerified).length,
    pending: documents.filter(d => !d.isVerified && !isExpired(d.expiryDate)).length,
    expired: documents.filter(d => isExpired(d.expiryDate)).length,
  };

  const FILTER_TABS = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'verified', label: 'Verified', count: stats.verified },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'expired', label: 'Expired', count: stats.expired },
  ];

  return (
    <div className="p-6 md:p-10 relative">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-500/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10"
      >
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3 text-white">
            <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
              <FileText className="text-gold-400" size={22} />
            </div>
            Document Verification Center
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">AI-powered compliance verification for your fleet documents</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setUploadModal(true)}
          className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
        >
          <Upload size={18} /> Upload Document
        </motion.button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-10"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`glass-panel p-4 rounded-2xl text-center transition-all duration-300 ${
              filter === tab.key
                ? 'border-gold-500/30 golden-glow'
                : 'glass-panel-hover'
            }`}
          >
            <p className="text-2xl font-bold font-display text-white">{tab.count}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mt-1">{tab.label}</p>
          </button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel p-3 rounded-2xl mb-6 relative z-10"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by driver name or document type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-space rounded-xl py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
      </motion.div>

      {/* Document Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Fetching documents..." /></div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-2xl text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="glass-panel p-20 rounded-2xl text-center border border-dashed border-white/10">
            <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 inline-block mb-4">
              <FileText className="text-gold-500/40" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">No documents found</h3>
            <p className="text-sm text-gray-600 mt-1">Upload driver documents to trigger AI verification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc, index) => {
              const expired = isExpired(doc.expiryDate);
              return (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`glass-panel rounded-2xl p-5 transition-all duration-300 glass-panel-hover relative overflow-hidden ${
                    expired ? 'border-red-500/20' : doc.isVerified ? 'border-emerald-500/10' : ''
                  }`}
                >
                  {/* Expired overlay glow */}
                  {expired && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  )}

                  {/* Header: Doc Type + Status Badge */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg border ${
                        doc.isVerified
                          ? 'bg-emerald-500/10 border-emerald-500/15'
                          : expired
                            ? 'bg-red-500/10 border-red-500/15'
                            : 'bg-amber-500/10 border-amber-500/15'
                      }`}>
                        <FileText size={16} className={
                          doc.isVerified ? 'text-emerald-400' : expired ? 'text-red-400' : 'text-amber-400'
                        } />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{doc.documentType}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Document</p>
                      </div>
                    </div>

                    {/* Status */}
                    {expired ? (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/15 uppercase tracking-wider flex items-center gap-1">
                        <ShieldX size={11} /> Expired
                      </span>
                    ) : doc.isVerified ? (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={11} /> Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15 uppercase tracking-wider flex items-center gap-1">
                        <Clock size={11} /> Pending
                      </span>
                    )}
                  </div>

                  {/* Driver Info */}
                  <div className="space-y-2 mb-4 relative z-10">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Driver</span>
                      <span className="text-gray-300 font-medium">{doc.driverId?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Contact</span>
                      <span className="text-gray-400 font-mono">{doc.driverId?.contactNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Expiry</span>
                      <span className={`font-medium ${expired ? 'text-red-400' : 'text-gray-300'}`}>
                        {formatDate(doc.expiryDate)}
                      </span>
                    </div>
                  </div>

                  {/* Remarks */}
                  {doc.remarks && (
                    <div className="text-[11px] text-gray-500 italic border-t border-white/[0.04] pt-3 mb-3 relative z-10">
                      AI: "{doc.remarks}"
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 relative z-10">
                    {doc.documentUrl && (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-gold-400 border border-gold-500/20 hover:bg-gold-500/5 hover:border-gold-500/30 transition-all"
                      >
                        <Eye size={13} /> View
                      </a>
                    )}
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl text-xs text-gray-500 border border-white/[0.06] hover:border-white/10 hover:text-gray-300 transition-all"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !uploading && setUploadModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel-strong rounded-2xl p-6 md:p-8 w-full max-w-md golden-glow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
                  <Upload className="text-gold-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white tracking-wide">Upload Document</h3>
                  <p className="text-xs text-gray-500">DL uploads trigger Tesseract.js OCR verification</p>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* Driver Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Driver *</label>
                  <select
                    value={uploadForm.driverId}
                    onChange={(e) => setUploadForm({ ...uploadForm, driverId: e.target.value })}
                    className="w-full input-space rounded-xl py-2.5 px-4 text-sm"
                    required
                  >
                    <option value="">— Choose a driver —</option>
                    {drivers.map(d => (
                      <option key={d._id} value={d._id}>{d.name} ({d.contactNumber})</option>
                    ))}
                  </select>
                </div>

                {/* Doc Type Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Document Type *</label>
                  <select
                    value={uploadForm.documentType}
                    onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
                    className="w-full input-space rounded-xl py-2.5 px-4 text-sm"
                    required
                  >
                    <option value="">— Choose type —</option>
                    {DOC_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upload File *</label>
                  <div className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 group ${
                    uploadFile
                      ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                      : 'border-white/10 hover:border-gold-400/40 hover:bg-gold-500/[0.02]'
                  }`}>
                    <input
                      type="file"
                      onChange={(e) => e.target.files[0] && setUploadFile(e.target.files[0])}
                      accept="image/*,application/pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    {uploadFile ? (
                      <>
                        <CheckCircle2 className="mx-auto text-emerald-400 mb-1" size={20} />
                        <p className="text-xs text-emerald-400 font-semibold truncate">{uploadFile.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto text-gray-600 group-hover:text-gold-400 mb-1 transition-colors" size={20} />
                        <p className="text-xs text-gray-500">Click or drop file here</p>
                      </>
                    )}
                  </div>
                </div>

                {/* OCR Hint */}
                {uploadForm.documentType === 'DL' && (
                  <div className="flex items-start gap-2 p-3 bg-gold-500/5 border border-gold-500/10 rounded-xl">
                    <ShieldCheck size={16} className="text-gold-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gold-400/80">
                      <strong>AI Mode:</strong> DL uploads are automatically processed by our Tesseract.js OCR engine for instant verification.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadModal(false)}
                    disabled={uploading}
                    className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-gold px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>Processing...</>
                    ) : (
                      <><Upload size={14} /> Upload & Verify</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentListPage;
