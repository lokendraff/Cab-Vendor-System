import API from './axios';

export const addDriver = (formData) =>
  API.post('/drivers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
