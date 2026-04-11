import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Car, X, Fuel, Users, Hash, CheckCircle, Search } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { addCab, getMyCabs } from '../api/cabApi';
import toast from 'react-hot-toast';

const fuelBadge = {
  Petrol: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Diesel: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  CNG: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  Electric: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
};

function CabCard({ cab, delay }) {
  const fuel = fuelBadge[cab.fuelType] || fuelBadge.Petrol;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="glass-card glass-card-hover"
      style={{ overflow: 'hidden' }}
    >
      {/* Top gradient bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(59,130,246,0.2)',
            }}>
              <Car size={20} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{cab.model}</div>
              <div style={{ fontSize: 12, color: '#3b82f6', fontFamily: 'monospace', fontWeight: 600, marginTop: 2 }}>
                {cab.registrationNumber}
              </div>
            </div>
          </div>
          <span style={{
            padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: cab.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(148,163,184,0.1)',
            color: cab.isActive ? '#10b981' : '#94a3b8',
          }}>
            {cab.isActive ? '● ACTIVE' : '○ INACTIVE'}
          </span>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase' }}>Seating</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Users size={12} color="#94a3b8" />
              {cab.seatingCapacity} seats
            </div>
          </div>
          <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase' }}>Fuel Type</div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: fuel.bg, color: fuel.color }}>
                <Fuel size={10} style={{ display: 'inline', marginRight: 4 }} />
                {cab.fuelType}
              </span>
            </div>
          </div>
        </div>

        {cab.driverId && (
          <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
            <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
              <CheckCircle size={11} />
              Driver Assigned
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Vehicles() {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ registrationNumber: '', model: '', seatingCapacity: '', fuelType: 'Petrol' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCabs = () => {
    getMyCabs()
      .then(({ data }) => setCabs(Array.isArray(data.data) ? data.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCabs(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addCab({ ...form, seatingCapacity: Number(form.seatingCapacity) });
      toast.success('Cab added to fleet!');
      setShowAdd(false);
      setForm({ registrationNumber: '', model: '', seatingCapacity: '', fuelType: 'Petrol' });
      fetchCabs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add cab');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = cabs.filter(c =>
    c.model?.toLowerCase().includes(search.toLowerCase()) ||
    c.registrationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const active = cabs.filter(c => c.isActive).length;

  return (
    <AppLayout pageTitle="Fleet Manager">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Vehicles</h1>
          <p className="page-subtitle">Manage your fleet — add and track all registered cabs</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ fontSize: 13 }}>
          <Plus size={14} /> Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Fleet', value: cabs.length, color: '#3b82f6' },
          { label: 'Active', value: active, color: '#10b981' },
          { label: 'Inactive', value: cabs.length - active, color: '#ef4444' },
          { label: 'With Driver', value: cabs.filter(c => c.driverId).length, color: '#8b5cf6' },
        ].map(({ label, value, color }, i) => (
          <div key={i} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.02em' }}>{loading ? '...' : value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 32, fontSize: 13 }}
          />
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} vehicles</div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="shimmer" style={{ height: 180, borderRadius: 12 }} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map((cab, i) => <CabCard key={cab._id} cab={cab} delay={i * 0.05} />)}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAdd(true)}
            style={{
              border: '2px dashed rgba(59,130,246,0.3)', borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10, cursor: 'pointer', minHeight: 160, transition: 'all 0.2s',
            }}
            whileHover={{ borderColor: 'rgba(59,130,246,0.6)', background: 'rgba(59,130,246,0.04)' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Plus size={18} color="#3b82f6" />
            </div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Add Vehicle</div>
          </motion.div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <Car size={48} color="#64748b" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>No vehicles found</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Add your first cab to get started.</div>
          <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ fontSize: 13 }}>
            <Plus size={14} /> Add First Vehicle
          </button>
        </div>
      )}

      {/* Add Cab Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="modal-overlay" onClick={() => setShowAdd(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>Add New Vehicle</div>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { id: 'cab-reg', key: 'registrationNumber', label: 'Registration Number', placeholder: 'e.g. DL01AB1234', type: 'text' },
                  { id: 'cab-model', key: 'model', label: 'Vehicle Model', placeholder: 'e.g. Toyota Innova', type: 'text' },
                  { id: 'cab-seats', key: 'seatingCapacity', label: 'Seating Capacity', placeholder: 'e.g. 4', type: 'number' },
                ].map(({ id, key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <input
                      id={id}
                      type={type}
                      required
                      value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      min={type === 'number' ? 1 : undefined}
                      className="input-field"
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fuel Type</label>
                  <select id="cab-fuel" value={form.fuelType} onChange={e => setForm(p => ({ ...p, fuelType: e.target.value }))} className="select-field">
                    {['Petrol', 'Diesel', 'CNG', 'Electric'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: 13 }}>
                    {submitting ? 'Adding...' : 'Add Vehicle'}
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
