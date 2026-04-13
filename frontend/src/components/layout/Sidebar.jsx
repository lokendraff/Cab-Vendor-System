import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CarFront, Users, ShieldAlert, Building2, Zap, FileCheck, CreditCard, UserCircle, Bell } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { isSuperVendor, role } = useAuth();

  // Navigation Links based on Roles
  const NAV_LINKS = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SuperVendor', 'CityVendor', 'RegionalVendor', 'LocalVendor'] },
    { name: 'My Fleet', path: '/cabs', icon: CarFront, roles: ['CityVendor', 'RegionalVendor', 'LocalVendor', 'SuperVendor'] },
    { name: 'Drivers', path: '/drivers', icon: Users, roles: ['CityVendor', 'RegionalVendor', 'LocalVendor', 'SuperVendor'] },
    { name: 'Documents', path: '/documents', icon: FileCheck, roles: ['CityVendor', 'RegionalVendor', 'LocalVendor', 'SuperVendor'] },
    { name: 'Payments', path: '/payments', icon: CreditCard, roles: ['CityVendor', 'RegionalVendor', 'LocalVendor', 'SuperVendor'] },
    { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'] },
    { name: 'Profile', path: '/profile', icon: UserCircle, roles: ['SuperVendor', 'RegionalVendor', 'CityVendor', 'LocalVendor'] },
    { name: 'Sub-Vendors', path: '/admin/vendors', icon: Building2, roles: ['SuperVendor'] },
    { name: 'Audit Logs', path: '/admin/audit', icon: ShieldAlert, roles: ['SuperVendor'] }
  ];

  const filteredLinks = NAV_LINKS.filter(
    (link) => role && link.roles.includes(role)
  );

  return (
    <aside className="w-[260px] bg-space-950 border-r border-white/[0.06] h-screen sticky top-0 flex flex-col z-20">
      
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mr-3 shadow-golden">
          <Zap className="text-space-900" size={18} strokeWidth={3} />
        </div>
        <div>
          <h1 className="text-base font-display font-bold tracking-[0.2em] text-white leading-none">
            FLEET
          </h1>
          <span className="text-[10px] font-display font-medium tracking-[0.3em] text-gold-500 leading-none">
            MASTER
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">Navigation</p>
        
        <div className="space-y-1">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20 golden-glow' 
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent'
                }
              `}
            >
              <link.icon size={18} className="shrink-0" />
              <span className="tracking-wide">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Role Badge */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSuperVendor ? 'bg-gold-400 shadow-[0_0_8px_rgba(212,168,83,0.5)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {isSuperVendor ? 'Admin Access' : 'Vendor Access'}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
