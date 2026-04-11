import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Navigation, ChevronRight, Users, Clock,
  Zap, CheckCircle, LocateFixed, Layers, Plus, Minus,
  Activity, AlertCircle
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

const VEHICLES = [
  { id: 'black-exec', name: 'Black Executive', price: '₹42.50', seats: 4, eta: '4 min', img: '🚗', popular: true },
  { id: 'luxury-suv',  name: 'Luxury SUV',      price: '₹58.00', seats: 6, eta: '7 min', img: '🚙', popular: false },
  { id: 'elec-prime',  name: 'Electric Prime',  price: '₹35.20', seats: 4, eta: '12 min', img: '⚡', popular: false },
];

export default function Bookings() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0].id);

  return (
    <AppLayout pageTitle="Bookings">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Book a Ride</h1>
          <p className="page-subtitle">Configure dispatch parameters and select vehicle category.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Location inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ padding: '22px' }}
          >
            <div style={{ marginBottom: 16 }}>
              <div className="section-label" style={{ marginBottom: 10, color: '#94a3b8' }}>Pick-Up Location</div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 8, height: 8, borderRadius: '50%', background: '#3b82f6',
                  boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                }} />
                <input
                  id="pickup-location"
                  type="text"
                  placeholder="Enter pickup address..."
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 28 }}
                />
              </div>
            </div>

            {/* Connector line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 12px' }}>
              <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', marginLeft: 15 }} />
            </div>

            <div>
              <div className="section-label" style={{ marginBottom: 10, color: '#94a3b8' }}>Destination</div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 8, height: 8, borderRadius: 2, background: '#10b981',
                  boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                }} />
                <input
                  id="destination-location"
                  type="text"
                  placeholder="Where to?"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 28 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Vehicle selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card"
            style={{ padding: '22px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="section-label" style={{ color: '#94a3b8' }}>Select Vehicle</div>
              <span className="badge badge-info">{VEHICLES.length} Available</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {VEHICLES.map(v => (
                <motion.div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                    border: `1px solid ${selectedVehicle === v.id ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedVehicle === v.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                >
                  {v.popular && (
                    <div style={{
                      position: 'absolute', top: -1, right: 12,
                      background: '#3b82f6', color: 'white',
                      fontSize: 9, fontWeight: 700, padding: '2px 8px',
                      borderRadius: '0 0 6px 6px', letterSpacing: '0.06em',
                    }}>
                      POPULAR
                    </div>
                  )}

                  {/* Vehicle icon */}
                  <div style={{
                    width: 52, height: 40, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {v.img}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: selectedVehicle === v.id ? '#60a5fa' : '#f1f5f9' }}>
                      {v.name}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                      <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Users size={10} /> {v.seats}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={10} /> {v.eta}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: selectedVehicle === v.id ? '#60a5fa' : '#f1f5f9' }}>
                    {v.price}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Confirm button */}
          <motion.button
            id="confirm-dispatch"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none', borderRadius: 12, color: 'white',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 0 24px rgba(59,130,246,0.3)',
            }}
          >
            <CheckCircle size={15} />
            Confirm Dispatch Selection
          </motion.button>
        </div>

        {/* Right: Map + Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Telemetry panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card"
            style={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="section-label" style={{ color: '#94a3b8' }}>Live Telemetry</div>
                <span className="live-dot" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                🚗
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Estimated Arrival</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#f1f5f9' }}>14 Minutes</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Distance Remaining', value: '4.2 Miles', valueColor: '#f1f5f9' },
                { label: 'Traffic Intensity', value: 'High', valueColor: '#ef4444' },
                { label: 'Dispatcher ID', value: '#KH-0092', valueColor: '#94a3b8' },
              ].map(({ label, value, valueColor }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: valueColor }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              flex: 1, minHeight: 280,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #0d1221 0%, #111827 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Grid overlay for map-like appearance */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `
                linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }} />

            {/* "Roads" */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="rgba(59,130,246,0.15)" strokeWidth="2" />
              <line x1="35%" y1="0" x2="35%" y2="100%" stroke="rgba(59,130,246,0.15)" strokeWidth="2" />
              <line x1="70%" y1="30%" x2="100%" y2="70%" stroke="rgba(59,130,246,0.1)" strokeWidth="1.5" strokeDasharray="8,4" />
              <line x1="0" y1="30%" x2="60%" y2="80%" stroke="rgba(59,130,246,0.08)" strokeWidth="1" />
            </svg>

            {/* Route path */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <polyline
                points="15%,75% 35%,60% 55%,60% 70%,42%"
                stroke="#3b82f6" strokeWidth="2.5"
                fill="none" strokeDasharray="6,3"
                style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.6))' }}
              />
            </svg>

            {/* Map controls */}
            <div style={{
              position: 'absolute', right: 12, top: 12,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              {[Layers, LocateFixed, Plus, Minus].map((Icon, i) => (
                <button key={i} style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#94a3b8',
                }}>
                  <Icon size={13} />
                </button>
              ))}
            </div>

            {/* Cab marker */}
            <div style={{
              position: 'absolute', left: '54%', top: '58%',
              transform: 'translate(-50%, -50%)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(59,130,246,0.5)',
                fontSize: 16,
              }}>
                🚗
              </div>
              <div style={{
                position: 'absolute', top: '115%', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: 6, padding: '2px 8px',
                fontSize: 10, color: '#60a5fa', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                ID-442
              </div>
            </div>

            {/* Glow orb */}
            <div style={{
              position: 'absolute', top: '40%', left: '68%',
              width: 60, height: 60, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
              animation: 'livePulse 2s ease-in-out infinite',
            }} />
          </motion.div>

          {/* Route summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
            style={{
              padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Origin</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{pickup || 'Central Park South'}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #3b82f6, #10b981)' }} />
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: '#3b82f6', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'white' }} />
              </div>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #3b82f6, #10b981)' }} />
              <div style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981', flexShrink: 0 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Destination</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{destination || 'Wall Street Terminal'}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
