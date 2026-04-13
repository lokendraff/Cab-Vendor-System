import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CarFront, Plus, Search, Filter, AlertCircle } from 'lucide-react';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Loader from '../../components/ui/Loader';

const CabListPage = () => {
  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCabs();
  }, []);

  const fetchCabs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(ENDPOINTS.CABS.GET_MY);
      if (data.success) {
        setCabs(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cabs');
    } finally {
      setLoading(false);
    }
  };

  const filteredCabs = cabs.filter(cab => 
    cab.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
    cab.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 relative">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-500/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10"
      >
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3 text-white">
            <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
              <CarFront className="text-gold-400" size={22} />
            </div>
            My Fleet
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Manage your active and inactive vehicles</p>
        </div>
        
        <Link to="/cabs/add">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            <Plus size={18} /> Add Vehicle
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
            placeholder="Search by Registration No. or Model..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-space rounded-xl py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <button className="px-4 glass-panel rounded-xl flex items-center gap-2 text-gray-400 text-sm font-medium hover:text-gold-400 hover:border-gold-500/20 transition-all">
          <Filter size={16} /> Filter
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Fetching fleet..." /></div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-2xl text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={36} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : filteredCabs.length === 0 ? (
          <div className="glass-panel p-20 rounded-2xl text-center border border-dashed border-white/10">
            <div className="p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 inline-block mb-4">
              <CarFront className="text-gold-500/40" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">No vehicles in your fleet</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto">Add your first vehicle to start building your fleet and managing trips.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Registration No.</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Model</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Capacity</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Fuel</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCabs.map((cab, index) => (
                    <motion.tr 
                      key={cab._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="border-b border-white/[0.03] hover:bg-gold-500/[0.02] transition-colors duration-200"
                    >
                      <td className="px-5 py-4 font-bold text-gold-400 font-display text-xs tracking-widest uppercase">{cab.registrationNumber}</td>
                      <td className="px-5 py-4 text-gray-300 font-medium">{cab.model}</td>
                      <td className="px-5 py-4 text-gray-400">{cab.seatingCapacity} Seats</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-space-800 border border-white/[0.06] text-gray-400 uppercase tracking-wider">
                          {cab.fuelType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {cab.isActive ? (
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

export default CabListPage;
