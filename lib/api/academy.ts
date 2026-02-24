import apiClient from './client';
import type {
  Course,
  CourseFilters,
  CourseListResponse,
  Enrollment,
  EnrollmentFilters,
  EnrollmentListResponse,
  LessonProgress,
  UpdateProgressDto,
} from '@/types/academy';

export const academyApi = {
  // Courses
  getCourses: (filters: CourseFilters = {}) =>
    apiClient.get<CourseListResponse>('/academy/courses', { params: filters }),

  getCourseBySlug: (slug: string) =>
    apiClient.get<Course>(`/academy/courses/${slug}`),

  // Enrollments
  enroll: (courseId: string) =>
    apiClient.post<Enrollment>('/academy/enrollments', { courseId }),

  getMyEnrollments: (filters: EnrollmentFilters = {}) =>
    apiClient.get<EnrollmentListResponse>('/academy/enrollments', { params: filters }),

  getEnrollmentById: (id: string) =>
    apiClient.get<Enrollment>(`/academy/enrollments/${id}`),

  getEnrollmentByCourse: (courseId: string) =>
    apiClient.get<Enrollment>(`/academy/enrollments/course/${courseId}`),

  dropCourse: (id: string) =>
    apiClient.patch(`/academy/enrollments/${id}/drop`),

  // Progress
  updateProgress: (data: UpdateProgressDto) =>
    apiClient.post<LessonProgress>('/academy/progress', data),

  getEnrollmentProgress: (enrollmentId: string) =>
    apiClient.get<LessonProgress[]>(`/academy/progress/enrollment/${enrollmentId}`),

  // Admin
  publishCourse: (courseId: string, published: boolean) =>
    apiClient.patch(`/academy/courses/${courseId}/publish`, { published }),

  deleteCourse: (courseId: string) =>
    apiClient.delete(`/academy/courses/${courseId}`),

  createCourse: (data: {
    title: string;
    description: string;
    thumbnailUrl: string;
    level: string;
    category: string;
    instructorName: string;
    instructorBio: string;
    instructorPhoto: string;
  }) => apiClient.post('/academy/courses', data),

  updateCourse: (courseId: string, data: Partial<{
    title: string;
    description: string;
    thumbnailUrl: string;
    level: string;
    category: string;
    instructorName: string;
    instructorBio: string;
    instructorPhoto: string;
  }>) => apiClient.patch(`/academy/courses/${courseId}`, data),

  // Video streaming
  getVideoStreamUrl: (videoId: string) =>
    apiClient.get<{ streamUrl: string; duration: number }>(`/academy/videos/${videoId}/stream`),
};
