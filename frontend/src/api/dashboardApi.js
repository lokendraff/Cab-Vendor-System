import API from './axios';

export const getSuperVendorDashboard = () => API.get('/dashboard/super-vendor');
