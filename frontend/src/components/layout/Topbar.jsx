import React from 'react';
import { LogOut, Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Topbar = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-20 bg-space-950/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-10 flex items-center justify-between px-6 md:px-10">
      
      {/* Optional Search / Left side elements for mobile (could be hamburger menu) */}
      <div className="flex items-center gap-4">
        {/* Placeholder for future mobile menu toggle */}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gold-400 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-space-950"></span>
        </button>

        <div className="w-px h-8 bg-white/10 hidden md:block"></div>

        {/* User Profile Area */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-white">Vendor Portal</span>
            <span className="text-xs text-gold-400">{role}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-space-800 border-2 border-gold-500/30 flex items-center justify-center">
            <User className="text-gray-300" size={18} />
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="p-2 md:px-4 md:py-2 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/30 bg-transparent hover:bg-red-500/10 rounded-xl flex items-center gap-2 transition-all duration-300"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden md:inline text-sm font-medium">Log out</span>
        </button>
      </div>
      
    </header>
  );
};

export default Topbar;
