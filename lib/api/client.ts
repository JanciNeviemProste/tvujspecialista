import axios from 'axios';

// Helper: read token from whichever storage it lives in
function getToken(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

// Helper: save token to the same storage where the current token lives
function setToken(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  // If existing token is in sessionStorage, keep using sessionStorage
  if (sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, value);
  }
}

// Helper: remove token from both storages
function removeToken(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  timeout: 30_000,
});

// JWT Interceptor - add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = getToken('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
        const refreshTokenValue = getToken('refreshToken');

        if (refreshTokenValue) {
          try {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
              { refreshToken: refreshTokenValue }
            );

            setToken('accessToken', data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, remove auth keys from both storages
            removeToken('accessToken');
            removeToken('refreshToken');
            // Only redirect if on a protected page
            if (window.location.pathname.startsWith('/profi/dashboard')) {
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
