import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleLabels = {
  SuperVendor: 'Admin',
  RegionalVendor: 'Regional Manager',
  CityVendor: 'City Vendor',
  LocalVendor: 'Local Vendor',
};

export default function Header({ pageTitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  return (
    <header style={{
      height: 60,
      background: 'rgba(10,14,26,0.9)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Page title */}
      {pageTitle && (
        <div style={{
          fontSize: 14, fontWeight: 600, color: '#3b82f6',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          paddingRight: 16, marginRight: 4,
          whiteSpace: 'nowrap',
        }}>
          {pageTitle}
        </div>
      )}

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
        <Search size={14} style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: '#64748b',
        }} />
        <input
          type="text"
          placeholder="Search vendors, drivers, vehicles..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px 8px 34px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            color: '#f1f5f9',
            fontSize: 13,
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#3b82f6'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#94a3b8', position: 'relative',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f1f5f9'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: '#ef4444',
            border: '1px solid #0a0e1a',
          }} />
        </button>

        <button
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#94a3b8',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f1f5f9'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <HelpCircle size={16} />
        </button>

        {/* User pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '6px 12px',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2 }}>
              {user?.name || 'Vendor'}
            </div>
            <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 500 }}>
              {roleLabels[user?.role] || 'Manager'}
            </div>
          </div>
          <ChevronDown size={12} color="#64748b" />
        </div>
      </div>
    </header>
  );
}
