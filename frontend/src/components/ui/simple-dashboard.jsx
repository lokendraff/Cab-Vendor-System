import React, { useState, useEffect } from 'react';
import { Car, Users, MapPin, DollarSign } from 'lucide-react';
import { Button } from './Button';
import StatsCard from '../Dashboard/StatsCard';

function SimpleDashboard() {
  const [stats, setStats] = useState({
    totalCabs: 12,
    activeRides: 3,
    totalBookings: 45,
    revenue: 12500
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Vendor Dashboard
          </h1>
          <p className="text-xl text-gray-600">Welcome to your cab fleet management panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Cabs" 
            value={stats.totalCabs} 
            change={12}
            icon={Car}
            color="blue"
          />
          <StatsCard 
            title="Active Rides" 
            value={stats.activeRides} 
            change={25}
            icon={MapPin}
            color="green"
          />
          <StatsCard 
            title="Today's Bookings" 
            value={stats.totalBookings} 
            change={8}
            icon={Users}
            color="orange"
          />
          <StatsCard 
            title="Revenue" 
            value={`₹${stats.revenue}`}
            change={18}
            icon={DollarSign}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Cab MH04-AB1234 assigned</p>
                  <p className="text-sm text-gray-500">Driver: John Doe • 2 min ago</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">New booking confirmed</p>
                  <p className="text-sm text-gray-500">Bandra → Andheri • 5 min ago</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg">
                ➕ Add New Cab
              </Button>
              <Button variant="outline" className="w-full">
                📱 Assign Driver
              </Button>
              <Button variant="outline" className="w-full">
                ⚙️ Fleet Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleDashboard;

