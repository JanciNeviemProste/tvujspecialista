import apiClient from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  category: 'Finanční poradce' | 'Realitní makléř';
  location: string;
  yearsExperience: number;
  bio?: string;
  hourlyRate?: number;
  services?: string[];
  certifications?: string[];
  education?: string;
  website?: string;
  linkedin?: string;
  availability?: string[];
}

export const authApi = {
  register: (data: RegistrationData) => apiClient.post('/auth/register', data),
  login: (credentials: LoginCredentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (token: string) => apiClient.post('/auth/refresh', { refreshToken: token }),
  getMe: () => apiClient.get('/auth/me'),
};
