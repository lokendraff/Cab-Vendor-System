import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, UserCheck, X, Upload, FileText, AlertTriangle,
  CheckCircle, Clock, Phone, Search
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { addDriver } from '../api/driverApi';
import toast from 'react-hot-toast';

function DocStatus({ label, file, date }) {
  const isExpired = date && new Date(date) < new Date();
  const hasDoc = !!file;
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 8, fontSize: 11,
      background: !hasDoc ? 'rgba(255,255,255,0.03)' : isExpired ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
      border: `1px solid ${!hasDoc ? 'rgba(255,255,255,0.08)' : isExpired ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {!hasDoc
        ? <Clock size={11} color="#64748b" />
        : isExpired
          ? <AlertTriangle size={11} color="#ef4444" />
          : <CheckCircle size={11} color="#10b981" />}
      <span style={{ color: !hasDoc ? '#64748b' : isExpired ? '#ef4444' : '#10b981', fontWeight: 600 }}>
        {label}
      </span>
      {isExpired && hasDoc && <span style={{ color: '#ef4444' }}>— Expired</span>}
    </div>
  );
}

function DriverCard({ driver, delay }) {
  const docs = driver.documents || {};
  const expiredCount = ['drivingLicense', 'registrationCertificate', 'permitAndPollution']
    .filter(k => docs[k]?.expiryDate && new Date(docs[k].expiryDate) < new Date()).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="glass-card glass-card-hover"
      style={{ overflow: 'hidden' }}
    >
      <div style={{ height: 3, background: expiredCount > 0 ? 'linear-gradient(90deg, #ef4444, #f59e0b)' : 'linear-gradient(90deg, #10b981, #3b82f6)' }} />

      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)',
            }}>
              {driver.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{driver.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Phone size={10} />
                {driver.contactNumber}
              </div>
            </div>
          </div>
          <span style={{
            padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: driver.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(148,163,184,0.1)',
            color: driver.isActive ? '#10b981' : '#94a3b8',
          }}>
            {driver.isActive ? '● ACTIVE' : '○ INACTIVE'}
          </span>
        </div>

        {/* Documents */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Document Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <DocStatus label="Driving License" file={docs.drivingLicense?.documentUrl} date={docs.drivingLicense?.expiryDate} />
            <DocStatus label="RC" file={docs.registrationCertificate?.documentUrl} date={docs.registrationCertificate?.expiryDate} />
            <DocStatus label="Permit & Pollution" file={docs.permitAndPollution?.documentUrl} date={docs.permitAndPollution?.expiryDate} />
          </div>
        </div>

        {expiredCount > 0 && (
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 11, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={11} />
            {expiredCount} document(s) require renewal
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FileUploadField({ id, label, onChange }) {
  const [fileName, setFileName] = useState('');
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <div className="file-input-wrapper">
        <input
          id={id}
          type="file"
          accept="image/*,application/pdf"
          required
          onChange={e => {
            setFileName(e.target.files[0]?.name || '');
            onChange(e.target.files[0]);
          }}
        />
        <Upload size={16} color={fileName ? '#10b981' : '#64748b'} />
        <div style={{ fontSize: 12, color: fileName ? '#10b981' : '#64748b', fontWeight: 500, marginTop: 4 }}>
          {fileName || 'Click to upload (PDF/Image)'}
        </div>
      </div>
    </div>
  );
}

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', contactNumber: '',
    dlExpiry: '', rcExpiry: '', ppExpiry: '',
    dlFile: null, rcFile: null, ppFile: null,
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('contactNumber', form.contactNumber);
      // ✅ Field names match driverController.js exactly
      fd.append('dlExpiry', form.dlExpiry);
      fd.append('rcExpiry', form.rcExpiry);
      fd.append('permitExpiry', form.ppExpiry);
      if (form.dlFile) fd.append('drivingLicense', form.dlFile);
      if (form.rcFile) fd.append('registrationCertificate', form.rcFile);
      if (form.ppFile) fd.append('permitAndPollution', form.ppFile);

      const { data } = await addDriver(fd);
      // Backend returns { success: true, data: driver }
      setDrivers(prev => [data.data, ...prev]);
      toast.success('Driver onboarded successfully!');
      setShowAdd(false);
      setForm({ name: '', contactNumber: '', dlExpiry: '', rcExpiry: '', ppExpiry: '', dlFile: null, rcFile: null, ppFile: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add driver');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.contactNumber?.includes(search)
  );

  const expiredDrivers = drivers.filter(d => {
    const docs = d.documents || {};
    return ['drivingLicense', 'registrationCertificate', 'permitAndPollution']
      .some(k => docs[k]?.expiryDate && new Date(docs[k].expiryDate) < new Date());
  }).length;

  return (
    <AppLayout pageTitle="Fleet Manager">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Drivers</h1>
          <p className="page-subtitle">Manage your driver network and document compliance</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ fontSize: 13 }}>
          <Plus size={14} /> Onboard Driver
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Drivers', value: drivers.length, color: '#3b82f6' },
          { label: 'Active', value: drivers.filter(d => d.isActive).length, color: '#10b981' },
          { label: 'Compliance Issues', value: expiredDrivers, color: '#ef4444' },
          { label: 'Docs Verified', value: '—', color: '#8b5cf6' },
        ].map(({ label, value, color }, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.02em' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input type="text" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} drivers</div>
      </div>

      {/* Grid or empty */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((d, i) => <DriverCard key={d._id || i} driver={d} delay={i * 0.05} />)}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <UserCheck size={48} color="#64748b" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>No Drivers Found</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Onboard your first driver with all required documents.</div>
          <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ fontSize: 13 }}>
            <Plus size={14} /> Onboard First Driver
          </button>
        </div>
      )}

      {/* Add Driver Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="modal-overlay" onClick={() => setShowAdd(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: 28, width: '100%', maxWidth: 520,
                maxHeight: '90vh', overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>Onboard New Driver</div>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Basic info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Driver Name</label>
                    <input id="drv-name" type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" className="input-field" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact Number</label>
                    <input id="drv-phone" type="tel" required value={form.contactNumber} onChange={e => setForm(p => ({ ...p, contactNumber: e.target.value }))} placeholder="10-digit number" className="input-field" />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={13} />
                    Document Uploads
                  </div>

                  {/* DL */}
                  <div style={{ marginBottom: 14 }}>
                    <FileUploadField id="drv-dl" label="Driving License" onChange={f => setForm(p => ({ ...p, dlFile: f }))} />
                    <input id="drv-dl-exp" type="date" required value={form.dlExpiry} onChange={e => setForm(p => ({ ...p, dlExpiry: e.target.value }))} className="input-field" style={{ marginTop: 8, fontSize: 13 }} />
                  </div>

                  {/* RC */}
                  <div style={{ marginBottom: 14 }}>
                    <FileUploadField id="drv-rc" label="Registration Certificate" onChange={f => setForm(p => ({ ...p, rcFile: f }))} />
                    <input id="drv-rc-exp" type="date" required value={form.rcExpiry} onChange={e => setForm(p => ({ ...p, rcExpiry: e.target.value }))} className="input-field" style={{ marginTop: 8, fontSize: 13 }} />
                  </div>

                  {/* PP */}
                  <div>
                    <FileUploadField id="drv-pp" label="Permit & Pollution" onChange={f => setForm(p => ({ ...p, ppFile: f }))} />
                    <input id="drv-pp-exp" type="date" required value={form.ppExpiry} onChange={e => setForm(p => ({ ...p, ppExpiry: e.target.value }))} className="input-field" style={{ marginTop: 8, fontSize: 13 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: 13 }}>
                    {submitting ? 'Uploading...' : 'Onboard Driver'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
