import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, Car, BookOpen, CreditCard,
  Settings, Zap, LogOut, ChevronRight, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendors',   label: 'Vendors',   icon: Users },
  { path: '/drivers',   label: 'Drivers',   icon: UserCheck },
  { path: '/vehicles',  label: 'Vehicles',  icon: Car },
  { path: '/bookings',  label: 'Bookings',  icon: BookOpen },
  { path: '/billing',   label: 'Billing',   icon: CreditCard },
  { path: '/settings',  label: 'Settings',  icon: Settings },
];

const roleColors = {
  SuperVendor:    { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  RegionalVendor: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  CityVendor:     { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  LocalVendor:    { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roleStyle = roleColors[user?.role] || roleColors.CityVendor;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        width: 220,
        minWidth: 220,
        height: '100vh',
        background: 'rgba(10,14,26,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59,130,246,0.4)',
          }}>
            <Zap size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              CAR VENDOR
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#3b82f6', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              SYSTEM
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 8 }}>
          <div className="section-label" style={{ padding: '4px 8px 8px' }}>Main</div>
          {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {({ isActive }) => isActive && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </NavLink>
          ))}
        </div>

        <div>
          <div className="section-label" style={{ padding: '12px 8px 8px' }}>Account</div>
          {navItems.slice(5).map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* New Dispatch Button */}
      <div style={{ padding: '12px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/bookings')}
          style={{
            width: '100%', padding: '10px 16px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            color: 'white', fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 0 20px rgba(59,130,246,0.3)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <Zap size={14} />
          New Dispatch
        </motion.button>
      </div>

      {/* User Profile */}
      <div style={{
        margin: '0 12px 12px',
        padding: '12px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Vendor'}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
              color: roleStyle.color,
              textTransform: 'uppercase',
            }}>
              {user?.role || 'Vendor'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', padding: 4, borderRadius: 4,
              display: 'flex', alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
