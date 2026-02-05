import apiClient from './client';
import type { SpecialistCategory } from '@/types/specialist';

export interface SpecialistFilters {
  category?: SpecialistCategory;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  verified?: boolean;
  sortBy?: 'rating' | 'price-asc' | 'price-desc' | 'newest';
  page?: number;
  limit?: number;
}

export const specialistsApi = {
  getAll: (filters: SpecialistFilters = {}) =>
    apiClient.get('/specialists', { params: filters }),

  getBySlug: (slug: string) =>
    apiClient.get(`/specialists/${slug}`),

  getMyProfile: () =>
    apiClient.get('/specialists/me/profile'),

  updateProfile: (data: Partial<any>) =>
    apiClient.patch('/specialists/me', data),

  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return apiClient.post('/upload/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
