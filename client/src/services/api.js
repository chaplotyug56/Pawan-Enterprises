import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Custom retry logic for 500 errors (database wake-up) or network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Only retry if no retries have been done or retries < 3
    if (!config || !config.retry) {
      config.retry = 0;
    }

    const shouldRetry =
      !error.response || (error.response && error.response.status >= 500);

    if (shouldRetry && config.retry < 3) {
      config.retry += 1;
      // Exponential backoff delay
      const delay = Math.pow(2, config.retry) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    return Promise.reject(error);
  }
);

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
