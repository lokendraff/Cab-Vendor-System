import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'rbac', label: 'My Permissions', icon: Shield },
];

const roleLabels = {
  SuperVendor: { label: 'Super Vendor', color: '#3b82f6', desc: 'Full system administrator access' },
  RegionalVendor: { label: 'Regional Vendor', color: '#10b981', desc: 'Regional operations management' },
  CityVendor: { label: 'City Vendor', color: '#f59e0b', desc: 'City-level fleet management' },
  LocalVendor: { label: 'Local Vendor', color: '#8b5cf6', desc: 'Local fleet management' },
};

const permissionsByRole = {
  SuperVendor: [
    { name: 'Full Vendor Management', granted: true },
    { name: 'Onboard Sub-Vendors', granted: true },
    { name: 'Delegate Permissions', granted: true },
    { name: 'Onboard Cabs', granted: true },
    { name: 'Onboard Drivers', granted: true },
    { name: 'View Dashboard Analytics', granted: true },
    { name: 'Process Payments', granted: true },
    { name: 'Override Sub-Vendor Actions', granted: true },
  ],
  RegionalVendor: [
    { name: 'View Regional Vendors', granted: true },
    { name: 'Onboard Sub-Vendors', granted: true },
    { name: 'Onboard Cabs', granted: true },
    { name: 'Onboard Drivers', granted: true },
    { name: 'View Dashboard Analytics', granted: true },
    { name: 'Delegate Permissions', granted: false },
    { name: 'Process Payments', granted: false },
    { name: 'Override Sub-Vendor Actions', granted: false },
  ],
  CityVendor: [
    { name: 'Onboard Cabs', granted: true },
    { name: 'Onboard Drivers', granted: true },
    { name: 'View My Fleet', granted: true },
    { name: 'View Sub-Vendors', granted: false },
    { name: 'Delegate Permissions', granted: false },
    { name: 'Process Payments', granted: false },
    { name: 'Dashboard Analytics', granted: false },
    { name: 'Override Actions', granted: false },
  ],
  LocalVendor: [
    { name: 'View My Fleet', granted: true },
    { name: 'Onboard Cabs', granted: false },
    { name: 'Onboard Drivers', granted: false },
    { name: 'View Sub-Vendors', granted: false },
    { name: 'Delegate Permissions', granted: false },
    { name: 'Process Payments', granted: false },
    { name: 'Dashboard Analytics', granted: false },
    { name: 'Override Actions', granted: false },
  ],
};

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPw, setShowPw] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    expiryWarnings: true,
    newDispatches: false,
    vendorActivity: true,
  });

  const roleInfo = roleLabels[user?.role] || roleLabels.CityVendor;
  const permissions = permissionsByRole[user?.role] || permissionsByRole.CityVendor;

  return (
    <AppLayout pageTitle="Settings">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences and security</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
        {/* Tab sidebar */}
        <div className="glass-card" style={{ padding: '12px', height: 'fit-content' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`settings-tab-${id}`}
              onClick={() => setActiveTab(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, border: 'none',
                background: activeTab === id ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: activeTab === id ? '#3b82f6' : '#94a3b8',
                fontSize: 13, fontWeight: activeTab === id ? 600 : 400,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                borderLeft: `2px solid ${activeTab === id ? '#3b82f6' : 'transparent'}`,
                marginBottom: 2, transition: 'all 0.15s', textAlign: 'left',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-card"
          style={{ padding: '28px' }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Profile Information</div>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: 'white',
                  flexShrink: 0,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{user?.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{user?.email}</div>
                  <span style={{ display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: roleInfo.color + '20', color: roleInfo.color }}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Full Name', value: user?.name, placeholder: 'Your name' },
                  { label: 'Email Address', value: user?.email, placeholder: 'email@example.com', disabled: true },
                  { label: 'Role', value: roleInfo.label, disabled: true },
                  { label: 'Vendor ID', value: user?._id?.slice(-8)?.toUpperCase() || '—', disabled: true },
                ].map(({ label, value, placeholder, disabled }, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <input
                      type="text"
                      defaultValue={value}
                      placeholder={placeholder}
                      disabled={disabled}
                      className="input-field"
                      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'text' }}
                    />
                  </div>
                ))}
              </div>

              <button onClick={() => toast.success('Profile updated!')} className="btn-primary" style={{ marginTop: 24, fontSize: 13 }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Security Settings</div>

              <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Current Password', id: 'sec-current' },
                  { label: 'New Password', id: 'sec-new' },
                  { label: 'Confirm New Password', id: 'sec-confirm' },
                ].map(({ label, id }) => (
                  <div key={id}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <input id={id} type={showPw ? 'text' : 'password'} placeholder="••••••••" className="input-field" style={{ paddingRight: 40 }} />
                      <button
                        type="button"
                        onClick={() => setShowPw(p => !p)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}

                <button onClick={() => toast.success('Password updated!')} className="btn-primary" style={{ fontSize: 13, marginTop: 8 }}>
                  <Lock size={14} /> Update Password
                </button>
              </div>

              <div style={{ marginTop: 36, padding: '16px', background: 'rgba(239,68,68,0.06)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.15)', maxWidth: 400 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>Danger Zone</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Once you deactivate your account, it cannot be undone.</div>
                <button onClick={() => toast.error('Contact support to deactivate')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Deactivate Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Notification Preferences</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important updates via email' },
                  { key: 'expiryWarnings', label: 'Document Expiry Warnings', desc: 'Get notified 30 days before document expiry' },
                  { key: 'newDispatches', label: 'New Dispatch Notifications', desc: 'Alert when new dispatches are created' },
                  { key: 'vendorActivity', label: 'Vendor Activity Updates', desc: 'Updates when sub-vendors take actions' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: 10,
                    background: notifications[key] ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${notifications[key] ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.15s', cursor: 'pointer',
                  }}
                    onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{label}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{desc}</div>
                    </div>
                    <div style={{
                      width: 40, height: 22, borderRadius: 100,
                      background: notifications[key] ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                    }}>
                      <div style={{
                        position: 'absolute', top: 3, left: notifications[key] ? 21 : 3,
                        width: 16, height: 16, borderRadius: '50%', background: 'white',
                        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => toast.success('Notification preferences saved!')} className="btn-primary" style={{ marginTop: 24, fontSize: 13 }}>
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {/* RBAC Tab */}
          {activeTab === 'rbac' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>My Permissions</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
                These are the permissions granted to your <strong style={{ color: roleInfo.color }}>{roleInfo.label}</strong> role. {roleInfo.desc}.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 600 }}>
                {permissions.map(({ name, granted }) => (
                  <div key={name} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 10,
                    background: granted ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${granted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <CheckCircle size={14} color={granted ? '#10b981' : '#64748b'} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: granted ? '#cbd5e1' : '#64748b' }}>{name}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, padding: '14px 16px', borderRadius: 10, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', maxWidth: 600 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                  🔐 Your permissions are managed by your Super Vendor. Contact your administrator to request additional access rights.
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
