import apiClient from './client';
import type {
  ForumCategory,
  ForumTopic,
  ForumTopicsResponse,
  ForumPost,
} from '@/types/forum';

export const forumApi = {
  // Categories
  getCategories: () =>
    apiClient.get<ForumCategory[]>('/forum/categories'),

  // Topics
  getTopics: (categorySlug: string, params: { search?: string; page?: number; limit?: number } = {}) =>
    apiClient.get<ForumTopicsResponse>(`/forum/categories/${categorySlug}/topics`, { params }),

  getTopic: (id: string) =>
    apiClient.get<ForumTopic>(`/forum/topics/${id}`),

  createTopic: (data: { categoryId: string; title: string; content: string }) =>
    apiClient.post<ForumTopic>('/forum/topics', data),

  pinTopic: (id: string) =>
    apiClient.patch<ForumTopic>(`/forum/topics/${id}/pin`),

  lockTopic: (id: string) =>
    apiClient.patch<ForumTopic>(`/forum/topics/${id}/lock`),

  // Posts
  createPost: (topicId: string, data: { content: string }) =>
    apiClient.post<ForumPost>(`/forum/topics/${topicId}/posts`, data),

  deletePost: (id: string) =>
    apiClient.delete(`/forum/posts/${id}`),

  toggleLike: (postId: string) =>
    apiClient.post<{ liked: boolean; likesCount: number }>(`/forum/posts/${postId}/like`),
};
