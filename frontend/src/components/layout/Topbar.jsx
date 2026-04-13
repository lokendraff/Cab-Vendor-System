import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Topbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-space-950/60 backdrop-blur-xl border-b border-white/[0.04] sticky top-0 z-10 flex items-center justify-between px-6 md:px-8">
      
      {/* Left — Breadcrumb area (future use) */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 font-medium tracking-wider uppercase hidden md:block">Command Center</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        
        {/* Notifications */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="w-px h-7 bg-white/[0.06] hidden md:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-300 tracking-wide">Vendor Portal</span>
            <span className="text-[10px] font-bold text-gold-500 tracking-wider uppercase">{role}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-space-800 border border-gold-500/20 flex items-center justify-center">
            <User className="text-gold-400/60" size={16} />
          </div>
        </div>

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
