import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft, Upload, Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AddDriverPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Text & Date Fields
  const [form, setForm] = useState({
    name: '',
    contactNumber: '',
    dlExpiry: '',
    rcExpiry: '',
    permitExpiry: ''
  });

  // File Fields
  const [files, setFiles] = useState({
    drivingLicense: null,
    registrationCertificate: null,
    permitAndPollution: null
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      setFiles({ ...files, [name]: fileList[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.contactNumber || !form.dlExpiry || !form.rcExpiry || !form.permitExpiry) {
      toast.error('Please fill all text and date fields');
      return;
    }

    if (!files.drivingLicense || !files.registrationCertificate || !files.permitAndPollution) {
      toast.error('Please upload all 3 required documents');
      return;
    }

    try {
      setLoading(true);
      
      // Construct FormData for multipart/form-data payload
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('contactNumber', form.contactNumber);
      formData.append('dlExpiry', form.dlExpiry);
      formData.append('rcExpiry', form.rcExpiry);
      formData.append('permitExpiry', form.permitExpiry);
      
      formData.append('drivingLicense', files.drivingLicense);
      formData.append('registrationCertificate', files.registrationCertificate);
      formData.append('permitAndPollution', files.permitAndPollution);

      // We explicitly override Content-Type so Axios sets the correct boundary
      const response = await API.post(ENDPOINTS.DRIVERS.ADD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.message || 'Driver onboarded & documents uploaded!');
        navigate('/drivers');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to onboard driver';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper config for drawing our 3 file upload sections
  const docConfigs = [
    { label: "Driving License (DL)", name: "drivingLicense", expiryName: "dlExpiry" },
    { label: "Registration Certificate (RC)", name: "registrationCertificate", expiryName: "rcExpiry" },
    { label: "Permit & Pollution", name: "permitAndPollution", expiryName: "permitExpiry" }
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link to="/drivers" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors mb-4 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Drivers
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-gold-400" /> Onboard New Driver
        </h1>
        <p className="text-gray-400 text-sm mt-1">Enter details and upload required compliance documents.</p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Personal Details Section */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border-t-4 border-t-gold-500">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g., Ramesh Kumar"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Contact Number"
              name="contactNumber"
              type="tel"
              placeholder="e.g., 9876543210"
              value={form.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Documents Upload Section */}
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-200">
            <FileText size={18} className="text-gold-400" /> Compliance Documents
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {docConfigs.map((doc, idx) => (
              <div key={idx} className="bg-space-800 border border-white/5 p-5 rounded-2xl">
                <label className="block text-sm font-medium text-gray-300 mb-3">{doc.label} <span className="text-gold-400">*</span></label>
                
                {/* Custom File Upload Box */}
                <div className="relative border-2 border-dashed border-white/20 hover:border-gold-400/50 rounded-xl p-4 text-center cursor-pointer transition-colors group mb-4">
                  <input 
                    type="file" 
                    name={doc.name} 
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <Upload className="mx-auto text-gray-500 group-hover:text-gold-400 mb-2 transition-colors" size={24} />
                  {files[doc.name] ? (
                    <p className="text-xs text-emerald-400 font-medium truncate">{files[doc.name].name}</p>
                  ) : (
                    <p className="text-xs text-gray-400">Click to upload or drag & drop</p>
                  )}
                </div>

                <Input
                  label="Valid Until (Expiry)"
                  name={doc.expiryName}
                  type="date"
                  value={form[doc.expiryName]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="ghost" onClick={() => navigate('/drivers')} type="button">
            Cancel
          </Button>
          <Button variant="gold" type="submit" loading={loading}>
            <Save size={18} /> Upload & Onboard Driver
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddDriverPage;
