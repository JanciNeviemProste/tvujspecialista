import apiClient from './client';

export interface ReviewSubmission {
  token: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
}

export const reviewsApi = {
  getBySpecialist: (specialistId: string) =>
    apiClient.get(`/reviews/${specialistId}`),

  submit: (data: ReviewSubmission) =>
    apiClient.post('/reviews', data),

  getMyReviews: () =>
    apiClient.get('/reviews/my/all'),

  respond: (id: string, response: string) =>
    apiClient.post(`/reviews/${id}/respond`, { response }),
};
