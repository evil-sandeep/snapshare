import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const fetchImages = () => api.get('/images');
export const uploadImage = (imageData) => api.post('/images', imageData);
export const likeImage = (id) => api.put(`/images/${id}/like`);

export default api;
