import API from './axios';

export const addCab = (data) => API.post('/cabs', data);
export const getMyCabs = () => API.get('/cabs');
