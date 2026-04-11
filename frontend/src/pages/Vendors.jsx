import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Filter, Users, Car, Star, AlertTriangle,
  X, ChevronRight, UserPlus, Shield, ToggleLeft, ToggleRight, Search
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { registerVendor, delegateAccess } from '../api/vendorApi';
import { getSuperVendorDashboard } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: 28,
            width: '100%', maxWidth: 480,
            maxHeight: '90vh', overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{title}</div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const roleColors = {
  SuperVendor: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: 'Super Vendor' },
  RegionalVendor: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Regional' },
  CityVendor: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'City' },
  LocalVendor: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6', label: 'Local' },
};

function VendorCard({ vendor, onDelegate, delay }) {
  const rc = roleColors[vendor.role] || roleColors.CityVendor;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card glass-card-hover"
      style={{ overflow: 'hidden', cursor: 'default' }}
    >
      {/* Top colored strip */}
      <div style={{ height: 4, background: rc.color, borderRadius: '12px 12px 0 0' }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${rc.color}40, ${rc.color}20)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: rc.color,
              border: `1px solid ${rc.color}30`,
            }}>
              {vendor.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{vendor.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{vendor.email}</div>
            </div>
          </div>
          <span style={{
            padding: '3px 10px',
            borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: vendor.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(148,163,184,0.15)',
            color: vendor.isActive ? '#10b981' : '#94a3b8',
            border: `1px solid ${vendor.isActive ? 'rgba(16,185,129,0.25)' : 'rgba(148,163,184,0.15)'}`,
          }}>
            {vendor.isActive ? '● ACTIVE' : '○ INACTIVE'}
          </span>
        </div>

        {/* Role badge */}
        <div style={{ marginBottom: 14 }}>
          <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: rc.bg, color: rc.color }}>
            {rc.label}
          </span>
        </div>

        {/* Delegation rights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
          {[
            { key: 'canOnboardCab', label: 'Onboard Cabs' },
            { key: 'canOnboardDriver', label: 'Onboard Drivers' },
            { key: 'canProcessPayments', label: 'Payments' },
          ].map(({ key, label }) => (
            <div key={key} style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: vendor.delegatedRights?.[key] ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
              color: vendor.delegatedRights?.[key] ? '#10b981' : '#64748b',
              border: `1px solid ${vendor.delegatedRights?.[key] ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: vendor.delegatedRights?.[key] ? '#10b981' : '#64748b' }} />
              {label}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onDelegate(vendor)}
            className="btn-primary"
            style={{ fontSize: 12, padding: '7px 12px', flex: 1, justifyContent: 'center' }}
          >
            <Shield size={12} />
            Delegate Access
          </button>
          <button className="btn-ghost" style={{ fontSize: 12, padding: '7px 12px' }}>
            <ChevronRight size={12} />
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Vendors() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showOnboard, setShowOnboard] = useState(false);
  const [showDelegate, setShowDelegate] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [onboardForm, setOnboardForm] = useState({ name: '', email: '', password: '', role: 'CityVendor' });
  const [delegateForm, setDelegateForm] = useState({ canOnboardCab: true, canOnboardDriver: true, canProcessPayments: false });
  const [submitting, setSubmitting] = useState(false);

  const fetchVendors = () => {
    if (user?.role === 'SuperVendor') {
      getSuperVendorDashboard()
        .then(({ data }) => setVendors(data.data?.vendorHierarchy?.subVendorsList || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, [user]);

  const handleOnboard = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerVendor({ ...onboardForm, parentVendor: user?._id });
      toast.success('Vendor onboarded successfully!');
      setShowOnboard(false);
      setOnboardForm({ name: '', email: '', password: '', role: 'CityVendor' });
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to onboard vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelegate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await delegateAccess(selectedVendor._id, delegateForm);
      toast.success('Delegation rights updated!');
      setShowDelegate(false);
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update delegation');
    } finally {
      setSubmitting(false);
    }
  };

  const openDelegate = (vendor) => {
    setSelectedVendor(vendor);
    setDelegateForm({
      canOnboardCab: vendor.delegatedRights?.canOnboardCab ?? true,
      canOnboardDriver: vendor.delegatedRights?.canOnboardDriver ?? true,
      canProcessPayments: vendor.delegatedRights?.canProcessPayments ?? false,
    });
    setShowDelegate(true);
  };

  const filtered = vendors.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: vendors.length,
    active: vendors.filter(v => v.isActive).length,
  };

  return (
    <AppLayout pageTitle="Vendor Management">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Vendor Management</h1>
          <p className="page-subtitle">Manage your vendor network and delegation rights</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ fontSize: 13 }}>
            <Filter size={14} /> Advanced Filters
          </button>
          {user?.role === 'SuperVendor' && (
            <button onClick={() => setShowOnboard(true)} className="btn-primary" style={{ fontSize: 13 }}>
              <UserPlus size={14} /> Onboard Vendor
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Vendors', value: stats.total, sub: 'Under your hierarchy' },
          { label: 'Active', value: stats.active, sub: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% utilization` },
          { label: 'Average Rating', value: '—', sub: 'Coming soon' },
          { label: 'Critical Alerts', value: '0', sub: 'All systems normal' },
        ].map(({ label, value, sub }, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Search + count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 32, fontSize: 13 }}
          />
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          Showing {filtered.length} of {vendors.length} vendors
        </div>
      </div>

      {/* Vendor Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: 220, borderRadius: 12 }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {filtered.map((v, i) => (
            <VendorCard key={v._id} vendor={v} onDelegate={openDelegate} delay={i * 0.06} />
          ))}
          {/* Add partner tile */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filtered.length * 0.06 }}
            onClick={() => setShowOnboard(true)}
            style={{
              border: '2px dashed rgba(59,130,246,0.3)',
              borderRadius: 12, padding: '30px 20px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', gap: 12,
              transition: 'all 0.2s',
            }}
            whileHover={{ borderColor: 'rgba(59,130,246,0.6)', background: 'rgba(59,130,246,0.04)' }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(59,130,246,0.2)',
            }}>
              <Plus size={20} color="#3b82f6" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Add New Partner</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Expand your vendor network</div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <Users size={48} color="#64748b" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>No Vendors Found</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
            {user?.role !== 'SuperVendor' ? 'Only SuperVendors can manage the vendor network.' : 'Start by onboarding your first sub-vendor.'}
          </div>
          {user?.role === 'SuperVendor' && (
            <button onClick={() => setShowOnboard(true)} className="btn-primary" style={{ fontSize: 13 }}>
              <UserPlus size={14} /> Onboard First Vendor
            </button>
          )}
        </div>
      )}

      {/* Onboard Modal */}
      <Modal open={showOnboard} onClose={() => setShowOnboard(false)} title="Onboard New Vendor">
        <form onSubmit={handleOnboard} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { id: 'ov-name', key: 'name', label: 'Full Name', type: 'text', placeholder: 'Vendor name' },
            { id: 'ov-email', key: 'email', label: 'Email Address', type: 'email', placeholder: 'vendor@example.com' },
            { id: 'ov-pw', key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ id, key, label, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
              <input
                id={id}
                type={type}
                required
                value={onboardForm[key]}
                onChange={e => setOnboardForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="input-field"
              />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vendor Role</label>
            <select
              id="ov-role"
              value={onboardForm.role}
              onChange={e => setOnboardForm(p => ({ ...p, role: e.target.value }))}
              className="select-field"
            >
              <option value="RegionalVendor">Regional Vendor</option>
              <option value="CityVendor">City Vendor</option>
              <option value="LocalVendor">Local Vendor</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setShowOnboard(false)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: 13 }}>
              {submitting ? 'Onboarding...' : 'Onboard Vendor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delegate Modal */}
      <Modal open={showDelegate} onClose={() => setShowDelegate(false)} title={`Delegate Access — ${selectedVendor?.name}`}>
        <form onSubmit={handleDelegate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
            Configure which operational rights are granted to this sub-vendor.
          </p>

          {[
            { key: 'canOnboardCab', label: 'Can Onboard Cabs', desc: 'Add vehicles to the system' },
            { key: 'canOnboardDriver', label: 'Can Onboard Drivers', desc: 'Register new drivers' },
            { key: 'canProcessPayments', label: 'Can Process Payments', desc: 'Handle financial transactions' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 10,
              background: delegateForm[key] ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${delegateForm[key] ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)'}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
              onClick={() => setDelegateForm(p => ({ ...p, [key]: !p[key] }))}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{label}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{desc}</div>
              </div>
              {delegateForm[key]
                ? <ToggleRight size={22} color="#3b82f6" />
                : <ToggleLeft size={22} color="#64748b" />}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setShowDelegate(false)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: 13 }}>
              {submitting ? 'Saving...' : 'Save Delegation Rights'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
