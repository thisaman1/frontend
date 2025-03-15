
import axios from 'axios';
import { toast } from "sonner";

export const API_URL = 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (!response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }
    
    if (response.status === 401) {
      // If the token is invalid or expired
      localStorage.removeItem('token');
      
      // Don't show toast on initial page load auth check
      const isAuthCheck = response.config.url.includes('/auth/me');
      if (!isAuthCheck) {
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
