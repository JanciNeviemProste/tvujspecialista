import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyApi } from '@/lib/api/academy';
import type { CourseFilters, EnrollmentFilters, UpdateProgressDto } from '@/types/academy';
import { queryKeys } from '@/lib/queryKeys';
import { useRouter } from 'next/navigation';

// Courses
export function useCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.academy.courses, filters],
    queryFn: () => academyApi.getCourses(filters).then((res) => res.data),
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: queryKeys.academy.course(slug),
    queryFn: () => academyApi.getCourseBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

// Enrollments
export function useMyEnrollments(filters: EnrollmentFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.academy.enrollments, filters],
    queryFn: () => academyApi.getMyEnrollments(filters).then((res) => res.data),
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: queryKeys.academy.enrollment(id),
    queryFn: () => academyApi.getEnrollmentById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useEnrollmentByCourse(courseId: string) {
  return useQuery({
    queryKey: queryKeys.academy.enrollmentByCourse(courseId),
    queryFn: () => academyApi.getEnrollmentByCourse(courseId).then((res) => res.data),
    enabled: !!courseId,
    retry: false, // Don't retry if not enrolled
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (courseId: string) => academyApi.enroll(courseId).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academy.enrollments });
      queryClient.invalidateQueries({ queryKey: queryKeys.academy.courses });
      router.push(`/academy/my-learning`);
    },
  });
}

export function useDropCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => academyApi.dropCourse(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academy.enrollments });
    },
  });
}

// Progress
export function useEnrollmentProgress(enrollmentId: string) {
  return useQuery({
    queryKey: queryKeys.academy.enrollmentProgress(enrollmentId),
    queryFn: () => academyApi.getEnrollmentProgress(enrollmentId).then((res) => res.data),
    enabled: !!enrollmentId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProgressDto) => academyApi.updateProgress(data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academy.enrollmentProgress(variables.enrollmentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.academy.enrollment(variables.enrollmentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.academy.enrollments });
    },
  });
}

// Video streaming
export function useVideoStreamUrl(videoId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.academy.videoUrl(videoId!),
    queryFn: () => academyApi.getVideoStreamUrl(videoId!).then((res) => res.data),
    enabled: !!videoId,
    staleTime: 30 * 60 * 1000, // 30 minutes (URL expires in 1h)
  });
}
