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
    <div className="p-6 md:p-10 relative">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-500/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10"
      >
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3 text-white">
            <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
              <Users className="text-gold-400" size={22} />
            </div>
            Driver Management
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Manage your drivers and their compliance documents</p>
        </div>
        
        <Link to="/drivers/add">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            <Plus size={18} /> Onboard Driver
          </motion.div>
        </Link>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-3 rounded-2xl mb-6 flex gap-3 relative z-10"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search by Driver Name or Contact No..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-space rounded-xl py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Fetching drivers..." /></div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-2xl text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="glass-panel p-20 rounded-2xl text-center border border-dashed border-white/10">
            <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 inline-block mb-4">
              <Users className="text-gold-500/40" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">No drivers onboarded</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">Onboard your first driver to start managing trips and compliance.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Driver Name</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Contact</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">DL Status</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">DL Expiry</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver, index) => (
                    <motion.tr 
                      key={driver._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="border-b border-white/[0.03] hover:bg-gold-500/[0.02] transition-colors duration-200"
                    >
                      <td className="px-5 py-4 font-semibold text-white">{driver.name}</td>
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs">{driver.contactNumber}</td>
                      
                      <td className="px-5 py-4">
                        {driver.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                            <FileCheck size={13} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/15">
                            <FileX size={13} className="text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {formatDate(driver.documents?.drivingLicense?.expiryDate)}
                      </td>

                      <td className="px-5 py-4">
                        {driver.isActive ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 uppercase tracking-wider">Active</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/15 uppercase tracking-wider">Inactive</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DriverListPage;
