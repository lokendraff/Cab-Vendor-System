import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * DashboardLayout wraps all authenticated routes.
 * Features a fixed Sidebar on the left and a Topbar on the top. 
 * The Outlet renders the changing page content directly below the Topbar.
 */
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-space-900 overflow-hidden text-gray-200">
      
      {/* Sidebar fixed to the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar fixed to the top of main content area, spans remaining width */}
        <Topbar />

        {/* Dynamic Page Content (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Outlet is where React Router injects the actual page (Dashboard, Cabs, etc) */}
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
