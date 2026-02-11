import apiClient from './client';
import { authResponseSchema, userSchema, validateResponse } from './schemas';

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

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  register: (data: RegistrationData) => apiClient.post('/auth/register', data),
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    response.data = validateResponse(authResponseSchema, response.data);
    return response;
  },
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (token: string) => apiClient.post('/auth/refresh', { refreshToken: token }),
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    response.data = validateResponse(userSchema, response.data);
    return response;
  },
  changePassword: (data: ChangePasswordData) => apiClient.post('/auth/change-password', data),
};
