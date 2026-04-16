import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import NotificationDropdown from '../notifications/NotificationDropdown';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import { getInitials } from '../../utils/helpers';

const Topbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  // Fetch real name from /api/vendors/me on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await API.get(ENDPOINTS.VENDORS.ME);
        if (!cancelled && data.success && data.data?.name) {
          setUserName(data.data.name);
        }
      } catch {
        // Silently fail — Topbar shouldn't crash on network error
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const displayName = userName || 'Vendor';
  const initials = getInitials(displayName);

  return (
    // FIX: z-40 instead of z-10 — prevents the stacking context from
    // clipping the NotificationDropdown panel (which is z-[9999]).
    // overflow-visible is also critical — z-10 + overflow:hidden would trap children.
    <header className="h-16 bg-space-950/60 backdrop-blur-xl border-b border-white/[0.04] sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 overflow-visible">

      {/* Left — portal label */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 font-medium tracking-wider uppercase hidden md:block">
          Command Center
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">

        {/* Notifications — its dropdown is z-[9999], safely above z-40 header */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="w-px h-7 bg-white/[0.06] hidden md:block" />

        {/* User Profile — clickable, navigates to /profile */}
        <Link
          to="/profile"
          className="flex items-center gap-3 group"
          title="Go to Profile"
        >
          {/* Name + Role text */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-300 tracking-wide group-hover:text-white transition-colors duration-200">
              {displayName}
            </span>
            <span className="text-[10px] font-bold text-gold-500 tracking-wider uppercase">
              {role}
            </span>
          </div>

          {/* Avatar with initials */}
          <div className="w-9 h-9 rounded-xl bg-space-800 border border-gold-500/20 flex items-center justify-center
                          group-hover:border-gold-500/50 group-hover:shadow-[0_0_14px_rgba(212,168,83,0.15)]
                          transition-all duration-300 shrink-0">
            {userName ? (
              <span className="text-xs font-bold text-gold-400">{initials}</span>
            ) : (
              <User className="text-gold-400/60" size={16} />
            )}
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-1 p-2.5 md:px-4 md:py-2 rounded-xl text-gray-500 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/[0.05] flex items-center gap-2 transition-all duration-300"
          title="Logout"
        >
          <LogOut size={16} />
          <span className="hidden md:inline text-xs font-semibold tracking-wide">Logout</span>
        </button>
      </div>

    </header>
  );
};

export default Topbar;
