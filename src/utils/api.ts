import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🧠 Don't handle /user/refresh inside itself
    if (originalRequest.url.includes('/user/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/user/refresh', {});
        processQueue(null);
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        processQueue(refreshError, null);

        // 🚫 Don't reload the app — just mark user as logged out
        console.error('Refresh token failed, logging out...');
        localStorage.removeItem('user'); // optional
        sessionStorage.removeItem('user'); // optional
        // You could also emit a custom event to notify AuthProvider
        document.dispatchEvent(new Event('logout'));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
