import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your API URL
});

// Authentication
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.get('/auth/logout');
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);

// Listings
export const getListings = (params) => API.get('/list', { params });
export const getListingById = (id) => API.get(`/list/${id}`);
export const createListing = (data) => API.post('/list', data);
export const updateListing = (id, data) => API.put(`/list/${id}`, data);
export const deleteListing = (id) => API.delete(`/list/${id}`);

// AI Recommendations
export const getRecommendations = (data) => API.post('/recommendations', data);

// Images
export const uploadImage = (data) => API.post('/images/upload', data);
export const getImageById = (id) => API.get(`/images/${id}`);

// Reviews
export const getReviews = (listingId) => API.get(`/listings/${listingId}/reviews`);
export const createReview = (listingId, data) => API.post(`/listings/${listingId}/reviews`, data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

export default API;
