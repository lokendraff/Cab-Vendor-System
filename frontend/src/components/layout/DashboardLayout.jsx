import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ConstellationField from './ConstellationField';

/**
 * DashboardLayout wraps all authenticated routes.
 * Features a fixed Sidebar on the left and a Topbar on the top. 
 * The Outlet renders the changing page content directly below the Topbar.
 * ConstellationField provides the interactive particle background.
 */
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-space-900 text-gray-200">
      
      {/* Sidebar fixed to the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Topbar */}
        <Topbar />

        {/* Dynamic Page Content (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-space-900 relative">
          {/* Interactive Constellation Particle Background */}
          <ConstellationField />
          {/* Subtle noise texture overlay for depth */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-[1]" 
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
          ></div>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
