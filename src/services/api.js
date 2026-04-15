import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Unit endpoints
export const unitAPI = {
  getUnitsByType: (type) => api.get(`/units?type=${type}`),
  getAllUnits: () => api.get('/units/all'),
};

// Conversion endpoints
export const conversionAPI = {
  convert: (data) => api.post('/conversions', data),
};

// Measurement endpoints
export const measurementAPI = {
  compare: (data) => api.post('/measurements/compare', data),
  arithmetic: (data) => api.post('/measurements/arithmetic', data),
};

// History endpoints
export const historyAPI = {
  getAll: () => api.get('/history'),
  getByType: (type) => api.get(`/history/by-type?type=${type}`),
  getByAction: (action) => api.get(`/history/by-action?action=${action}`),
  getRecent: (hours = 24) => api.get(`/history/recent?hours=${hours}`),
  save: (record) => api.post('/history', record),
  delete: (id) => api.delete(`/history/${id}`),
  clearAll: () => api.delete('/history'),
};

// Auth endpoints (local storage based for now)
export const authAPI = {
  signup: async (userData) => {
    // Simulate backend call - in production, call real auth endpoint
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, user: userData };
  },

  login: async (email, password) => {
    // Simulate backend call - in production, call real auth endpoint
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const token = btoa(`${email}:${password}`); // Simple token generation
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify({
      id: user.id || Math.random(),
      fullName: user.fullName,
      email: user.email,
    }));
    return { success: true, token, user };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api;
