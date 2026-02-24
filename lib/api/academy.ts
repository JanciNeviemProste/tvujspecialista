import apiClient from './client';
import type {
  Course,
  Module,
  Lesson,
  Video,
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

  // Modules (admin)
  getModules: (courseId: string) =>
    apiClient.get<Module[]>(`/academy/courses/${courseId}/modules`),

  createModule: (courseId: string, data: { title: string; description: string }) =>
    apiClient.post<Module>(`/academy/courses/${courseId}/modules`, data),

  updateModule: (moduleId: string, data: { title?: string; description?: string }) =>
    apiClient.patch<Module>(`/academy/modules/${moduleId}`, data),

  deleteModule: (moduleId: string) =>
    apiClient.delete(`/academy/modules/${moduleId}`),

  reorderModule: (moduleId: string, position: number) =>
    apiClient.patch(`/academy/modules/${moduleId}/reorder`, { position }),

  // Lessons (admin)
  getLessons: (moduleId: string) =>
    apiClient.get<Lesson[]>(`/academy/modules/${moduleId}/lessons`),

  createLesson: (moduleId: string, data: { title: string; description: string; type: string; duration?: number; free?: boolean }) =>
    apiClient.post<Lesson>(`/academy/modules/${moduleId}/lessons`, data),

  updateLesson: (lessonId: string, data: { title?: string; description?: string; type?: string; duration?: number; free?: boolean; published?: boolean }) =>
    apiClient.patch<Lesson>(`/academy/lessons/${lessonId}`, data),

  deleteLesson: (lessonId: string) =>
    apiClient.delete(`/academy/lessons/${lessonId}`),

  reorderLesson: (lessonId: string, position: number) =>
    apiClient.patch(`/academy/lessons/${lessonId}/reorder`, { position }),

  // Videos (admin)
  uploadVideo: (file: File, lessonId: string, title: string) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('lessonId', lessonId);
    formData.append('title', title);
    return apiClient.post<Video>('/academy/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000, // 10 min for large files
    });
  },

  deleteVideo: (videoId: string) =>
    apiClient.delete(`/academy/videos/${videoId}`),

  getVideo: (videoId: string) =>
    apiClient.get<Video>(`/academy/videos/${videoId}`),
};
