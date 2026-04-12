import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Plus, Search, AlertCircle, FileCheck, FileX } from 'lucide-react';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';

const DriverListPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(ENDPOINTS.DRIVERS.GET_MY);
      if (data.success) {
        setDrivers(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.contactNumber.includes(search)
  );

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-gold-400" /> Driver Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage your drivers and their compliance documents</p>
        </div>
        
        <Link to="/drivers/add" className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-space-900 bg-gold-gradient shadow-golden hover:scale-105 transition-transform">
          <Plus size={18} /> Onboard Driver
        </Link>
      </div>

      {/* Controls */}
      <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Driver Name or Contact No..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-space-800 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-gold-400 transition-colors"
          />
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader /></div>
      ) : error ? (
        <div className="glass-panel p-8 rounded-2xl text-center">
          <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
          <p className="text-red-400">{error}</p>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center border-dashed">
          <Users className="mx-auto text-gray-500 mb-4 opacity-50" size={48} />
          <h3 className="text-lg font-medium text-gray-300">No drivers found</h3>
          <p className="text-sm text-gray-500 mt-1">Onboard your first driver to start assigning trips.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="p-4 font-medium text-gray-400">Driver Name</th>
                  <th className="p-4 font-medium text-gray-400">Contact Number</th>
                  <th className="p-4 font-medium text-gray-400">DL Verification</th>
                  <th className="p-4 font-medium text-gray-400">DL Expiry</th>
                  <th className="p-4 font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDrivers.map((driver, index) => (
                  <motion.tr 
                    key={driver._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-semibold text-white">{driver.name}</td>
                    <td className="p-4 text-gray-300">{driver.contactNumber}</td>
                    
                    <td className="p-4">
                      {driver.isVerified ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                          <FileCheck size={16} /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                          <FileX size={16} /> Pending
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-300">
                      {formatDate(driver.documents?.drivingLicense?.expiryDate)}
                    </td>

                    <td className="p-4">
                      {driver.isActive ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Inactive</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverListPage;
