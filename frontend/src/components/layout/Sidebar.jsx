import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CarFront, Users, ShieldAlert, Building2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { isSuperVendor } = useAuth();

  // Navigation Links based on Roles
  const NAV_LINKS = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SuperVendor', 'CityVendor', 'RegionalVendor', 'LocalVendor'] },
    // Vendor Specific
    { name: 'My Fleet', path: '/cabs', icon: CarFront, roles: ['CityVendor', 'RegionalVendor', 'LocalVendor', 'SuperVendor'] }, // All vendors can have fleets theoretically, or maybe separate
    { name: 'Drivers', path: '/drivers', icon: Users, roles: ['CityVendor', 'RegionalVendor', 'LocalVendor', 'SuperVendor'] },
    // Admin Specific
    { name: 'Sub-Vendors', path: '/admin/vendors', icon: Building2, roles: ['SuperVendor'] },
    { name: 'Audit Logs', path: '/admin/audit', icon: ShieldAlert, roles: ['SuperVendor'] }
  ];

  // In a real scenario, useAuth would give us exact role. Let's just use isSuperVendor for filtering.
  const filteredLinks = NAV_LINKS.filter(link => 
    isSuperVendor ? link.roles.includes('SuperVendor') : link.roles.includes('CityVendor')
  );

  return (
    <aside className="w-64 bg-space-950 border-r border-white/10 h-screen sticky top-0 flex flex-col z-20">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="w-8 h-8 rounded bg-gold-gradient flex items-center justify-center mr-3 shadow-golden">
          <span className="text-space-900 font-bold font-display">F</span>
        </div>
        <h1 className="text-xl font-display font-bold tracking-widest text-white">
          MASTER
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Main Menu</p>
        
        {filteredLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
              ${isActive 
                ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20 shadow-[inset_0_0_20px_rgba(212,168,83,0.05)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <link.icon size={20} className="shrink-0" />
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Role Badge pinned to bottom */}
      <div className="p-6 border-t border-white/5">
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            {isSuperVendor ? 'Admin Level' : 'Vendor Level'}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
