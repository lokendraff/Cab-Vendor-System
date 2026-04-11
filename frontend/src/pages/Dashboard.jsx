import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Car, Users, UserCheck, AlertTriangle, TrendingUp,
  Activity, ChevronRight, ArrowUpRight, Shield, Zap, Clock
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { getSuperVendorDashboard } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockVehicleActivity = [
  { day: 'Mon', active: 32, idle: 8 },
  { day: 'Tue', active: 38, idle: 5 },
  { day: 'Wed', active: 41, idle: 6 },
  { day: 'Thu', active: 36, idle: 9 },
  { day: 'Fri', active: 45, idle: 4 },
  { day: 'Sat', active: 29, idle: 12 },
  { day: 'Sun', active: 22, idle: 15 },
];

const mockHistoryItems = [
  { vendor: 'Apex Fleet Sol.', driver: 'Rohan Sharma', from: 'Airport', to: 'Sector 62', cap: '4/4', time: '12:45 PM', rev: '₹242' },
  { vendor: 'Luxe Logistics', driver: 'Priya Singh', from: 'Station', to: 'Connaught Pl.', cap: '2/4', time: '12:30 PM', rev: '₹185' },
  { vendor: 'City Cabs Co.', driver: 'Karan Mehta', from: 'Mall', to: 'DLF Phase 3', cap: '1/2', time: '12:15 PM', rev: '₹89' },
];

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card"
      style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: `rgba(${color},0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid rgba(${color},0.25)`,
        }}>
          <Icon size={18} color={`rgb(${color})`} />
        </div>
      </div>
      {/* Bottom accent bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `rgba(${color},0.4)` }} />
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'SuperVendor') {
      getSuperVendorDashboard()
        .then(({ data }) => setDashData(data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const totalVehicles = dashData?.fleetStatus?.totalVehicles ?? '—';
  const activeVehicles = dashData?.fleetStatus?.activeVehicles ?? '—';
  const subVendors = dashData?.vendorHierarchy?.totalSubVendors ?? '—';
  const pendingDocs = dashData?.compliance?.pendingVerificationCount ?? '—';
  const efficiency = dashData 
    ? dashData.fleetStatus.totalVehicles > 0 
      ? ((dashData.fleetStatus.activeVehicles / dashData.fleetStatus.totalVehicles) * 100).toFixed(1) 
      : '—'
    : '—';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#1a2236', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
          <div style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout pageTitle="Manager">
      {/* Hero System Pulse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          padding: '32px 36px', marginBottom: 24,
          background: 'linear-gradient(135deg, rgba(13,18,33,0.9) 60%, rgba(59,130,246,0.08) 100%)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: -40, right: 80,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 10, color: '#3b82f6' }}>↑ System Status</div>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.1 }}>
              System Pulse:{' '}
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa, #34d399)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {loading ? '...' : `${efficiency}%`}
              </span>
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 380, lineHeight: 1.6 }}>
              {loading
                ? 'Loading your metrics...'
                : dashData
                  ? `Your system is operating at peak efficiency. ${activeVehicles} active vehicles deployed across your network.`
                  : 'Connect as SuperVendor to see full metrics.'}
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn-primary" style={{ fontSize: 13 }}>
                <Activity size={14} />
                Live Telemetry
              </button>
              <button className="btn-ghost" style={{ fontSize: 13 }}>
                <Car size={14} />
                Review Capacity
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{
              padding: '20px 24px',
              background: 'rgba(59,130,246,0.1)',
              borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)',
              minWidth: 120,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className="live-dot" />
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>ACTIVE CABS</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9' }}>{loading ? '...' : activeVehicles}</div>
              <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 4 }}>↑ Live now</div>
            </div>
            <div style={{
              padding: '20px 24px',
              background: 'rgba(16,185,129,0.1)',
              borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)',
              minWidth: 120,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <TrendingUp size={12} color="#10b981" />
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>REVENUE FLOW</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9' }}>₹—</div>
              <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>Peak pricing active</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Car} label="Total Vehicles" value={loading ? '...' : totalVehicles} sub="In your system" color="59,130,246" delay={0.1} />
        <StatCard icon={Users} label="Sub Vendors" value={loading ? '...' : subVendors} sub="Reporting to you" color="16,185,129" delay={0.15} />
        <StatCard icon={AlertTriangle} label="Pending Docs" value={loading ? '...' : pendingDocs} sub="Need verification" color="245,158,11" delay={0.2} />
        <StatCard icon={Shield} label="Compliance" value={loading ? '...' : (pendingDocs === 0 ? '✓ All Clear' : 'Review Needed')} sub="Document status" color="139,92,246" delay={0.25} />
      </div>

      {/* Chart + Recent History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, marginBottom: 24 }}>
        {/* Vehicle Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{ padding: '22px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Vehicle Activity</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Active vs Idle — last 7 days</div>
            </div>
            <span className="badge badge-info">Weekly</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={mockVehicleActivity} barSize={12} barGap={4}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Active" />
              <Bar dataKey="idle" fill="rgba(148,163,184,0.2)" radius={[4, 4, 0, 0]} name="Idle" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sub Vendor List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card"
          style={{ padding: '22px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Live Status</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Direct sub-vendors</div>
            </div>
            <button style={{ fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>View All →</button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => (
                <div key={i} className="shimmer" style={{ height: 52, borderRadius: 8 }} />
              ))}
            </div>
          ) : dashData?.vendorHierarchy?.subVendorsList?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {dashData.vendorHierarchy.subVendorsList.slice(0, 5).map((sv, i) => (
                <div key={sv._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 8,
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#60a5fa',
                    }}>
                      {sv.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{sv.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{sv.email}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${sv.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {sv.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>{sv.role?.replace('Vendor', ' Vendor')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b', fontSize: 13 }}>
              No sub-vendors found under your account.
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Dispatch History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
        style={{ padding: '22px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Recent Dispatch History</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Last 24 hours of activity</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
              <Activity size={12} /> Filter
            </button>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
              Export CSV
            </button>
          </div>
        </div>

        <table className="fc-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Capacity</th>
              <th>Time</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {mockHistoryItems.map((item, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {item.vendor.charAt(0)}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.vendor}</span>
                  </div>
                </td>
                <td style={{ color: '#94a3b8' }}>{item.driver}</td>
                <td>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{item.from}</span>
                  <span style={{ color: '#64748b', fontSize: 12, margin: '0 6px' }}>→</span>
                  <span style={{ color: '#94a3b8', fontSize: 12 }}>{item.to}</span>
                </td>
                <td>
                  <span className="badge badge-info">{item.cap}</span>
                </td>
                <td style={{ color: '#64748b', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} />
                    {item.time}
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>{item.rev}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="btn-ghost" style={{ fontSize: 12 }}>Load Full History</button>
        </div>
      </motion.div>
    </AppLayout>
  );
}
