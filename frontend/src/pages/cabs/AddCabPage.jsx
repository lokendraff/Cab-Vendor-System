import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { CarFront, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { FUEL_TYPES } from '../../utils/constants';

const AddCabPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    registrationNumber: '',
    model: '',
    seatingCapacity: '',
    fuelType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-uppercase registration number
    const finalValue = name === 'registrationNumber' ? value.toUpperCase() : value;
    setForm({ ...form, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.registrationNumber || !form.model || !form.seatingCapacity || !form.fuelType) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post(ENDPOINTS.CABS.ADD, {
        ...form,
        seatingCapacity: Number(form.seatingCapacity)
      });
      
      if (data.success) {
        toast.success(data.message || 'Cab successfully onboarded');
        navigate('/cabs');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add cab';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto relative">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-gold-500/[0.03] rounded-full blur-[150px] pointer-events-none"></div>

      <div className="mb-8 relative z-10">
        <Link to="/cabs" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-400 transition-colors mb-5 text-xs font-semibold uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to Fleet
        </Link>
        <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3 text-white">
          <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
            <CarFront className="text-gold-400" size={22} />
          </div>
          Onboard New Vehicle
        </h1>
        <p className="text-gray-500 text-sm mt-2 ml-12">Enter the vehicle details to add it to your active fleet.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel-strong rounded-2xl p-6 md:p-10 border-t-2 border-t-gold-500/50 golden-glow relative z-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Input
              label="Registration Number"
              name="registrationNumber"
              placeholder="e.g., UP14 BT 0001"
              value={form.registrationNumber}
              onChange={handleChange}
              required
            />

            <Input
              label="Vehicle Model"
              name="model"
              placeholder="e.g., Toyota Innova Crysta"
              value={form.model}
              onChange={handleChange}
              required
            />

            <Input
              label="Seating Capacity"
              name="seatingCapacity"
              type="number"
              placeholder="e.g., 4, 7, etc."
              value={form.seatingCapacity}
              onChange={handleChange}
              min="2"
              max="60"
              required
            />

            <Input
              label="Fuel Type"
              name="fuelType"
              options={FUEL_TYPES.map(fuel => ({ label: fuel, value: fuel }))}
              value={form.fuelType}
              onChange={handleChange}
              required
            />

          </div>

          <div className="pt-6 mt-6 border-t border-white/[0.06] flex justify-end gap-3">
            <Button variant="ghost" onClick={() => navigate('/cabs')} type="button">
              Cancel
            </Button>
            <Button variant="gold" type="submit" loading={loading}>
              <Save size={16} /> Save Vehicle
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCabPage;
