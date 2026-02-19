import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  timeout: 30_000,
});

// JWT Interceptor - add token to all requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Refresh Token Interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry on 429 (rate limited) or 503 (service unavailable)
    const status = error.response?.status;
    if ((status === 429 || status === 503) && !originalRequest._retryCount) {
      originalRequest._retryCount = 1;
      const delay = status === 429
        ? parseInt(error.response?.headers?.['retry-after'] || '2', 10) * 1000
        : 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
              { refreshToken }
            );

            localStorage.setItem('accessToken', data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, remove auth keys and redirect
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            if (typeof window !== 'undefined') {
              window.location.href = '/profi/prihlaseni';
            }
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
