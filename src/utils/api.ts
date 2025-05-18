import axios from 'axios';
import { deleteCookie } from 'cookies-next';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for handling httpOnly cookies
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only redirect to login if the error is specifically about token expiration
    // or if the token is invalid
    if (error.response?.status === 401 && 
        (error.response.data?.error === 'Invalid token' || 
         error.response.data?.error === 'Token expired')) {
      // Redirect to login
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 