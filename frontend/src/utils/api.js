import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export const vendorApi = {
  login: (credentials) => api.post('/vendors/login', credentials),
  register: (data) => api.post('/vendors/register', data),
}

export const cabApi = {
  getMyCabs: () => api.get('/cabs'),
  addCab: (formData) => api.post('/cabs', formData),
}

export default api

