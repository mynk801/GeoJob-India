import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchJobs = async (filters = {}) => {
  try {
    const params = {};
    if (filters.tech && filters.tech.length > 0) {
      params.tech = filters.tech.join(',');
    }
    if (filters.roles && filters.roles.length > 0) {
      // Assuming backend supports roles, though currently our backend searches tech/tags.
      // We can map roles to tags or create a specific role filter in backend.
      // For now we'll pass it, and the backend would need update to support 'role'.
      params.role = filters.roles.join(','); 
    }
    if (filters.experience !== undefined && filters.experience !== '') {
      params.experience = filters.experience.toString();
    }
    
    if (filters.sort) {
      params.sort = filters.sort;
    }
    if (filters.lat && filters.lng && filters.radius) {
      params.lat = filters.lat;
      params.lng = filters.lng;
      params.radius = filters.radius;
    }

    const response = await api.get('/jobs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export default api;
