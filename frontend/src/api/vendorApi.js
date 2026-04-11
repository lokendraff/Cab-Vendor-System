import API from './axios';

export const loginVendor = (data) => API.post('/vendors/login', data);
export const registerVendor = (data) => API.post('/vendors/register', data);
export const delegateAccess = (subVendorId, rights) =>
  API.put(`/vendors/delegate/${subVendorId}`, rights);
export const getSubVendors = () => API.get('/vendors/sub-vendors');
export const getMe = () => API.get('/vendors/me');

