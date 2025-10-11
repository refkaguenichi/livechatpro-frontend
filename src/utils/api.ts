import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1000', // Replace with your backend URL
  withCredentials: true, // Include cookies in requests
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post('/user/refresh', {}, { withCredentials: true });
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;