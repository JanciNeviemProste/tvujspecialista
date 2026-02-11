import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useCourses,
  useCourse,
  useEnroll,
  useMyEnrollments,
} from '@/lib/hooks/useAcademy';
import { academyApi } from '@/lib/api/academy';
import {
  CourseLevel,
  CourseCategory,
  EnrollmentStatus,
} from '@/types/academy';
import type {
  Course,
  CourseListResponse,
  Enrollment,
  EnrollmentListResponse,
} from '@/types/academy';

// Mock the API module
jest.mock('@/lib/api/academy');

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock queryKeys
jest.mock('@/lib/queryKeys', () => ({
  queryKeys: {
    academy: {
      courses: ['courses'],
      course: (slug: string) => ['course', slug],
      enrollments: ['myEnrollments'],
      enrollment: (id: string) => ['enrollment', id],
      enrollmentByCourse: (courseId: string) => ['enrollmentByCourse', courseId],
      enrollmentProgress: (enrollmentId: string) => ['enrollmentProgress', enrollmentId],
      videoUrl: (videoId: string) => ['videoStreamUrl', videoId],
    },
  },
}));

const mockedAcademyApi = academyApi as jest.Mocked<typeof academyApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

// Mock course data
const mockCourse: Course = {
  id: 'course-1',
  slug: 'intro-to-real-estate',
  title: 'Introduction to Real Estate',
  description: 'A beginner course on real estate',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  level: CourseLevel.BEGINNER,
  category: CourseCategory.REAL_ESTATE,
  instructorName: 'Jan Novak',
  instructorBio: 'Expert in real estate',
  instructorPhoto: 'https://example.com/photo.jpg',
  duration: 3600,
  moduleCount: 5,
  lessonCount: 20,
  enrollmentCount: 150,
  rating: 4.5,
  reviewCount: 30,
  published: true,
  featured: true,
  position: 1,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

const mockCourse2: Course = {
  id: 'course-2',
  slug: 'advanced-financial',
  title: 'Advanced Financial Planning',
  description: 'An advanced course on financial planning',
  thumbnailUrl: 'https://example.com/thumb2.jpg',
  level: CourseLevel.ADVANCED,
  category: CourseCategory.FINANCIAL,
  instructorName: 'Maria Kovacova',
  instructorBio: 'Financial expert',
  instructorPhoto: 'https://example.com/photo2.jpg',
  duration: 7200,
  moduleCount: 8,
  lessonCount: 40,
  enrollmentCount: 75,
  rating: 4.8,
  reviewCount: 15,
  published: true,
  featured: false,
  position: 2,
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-02-10T00:00:00Z',
};

const mockCoursesResponse: CourseListResponse = {
  courses: [mockCourse, mockCourse2],
  total: 2,
  page: 1,
  limit: 10,
};

const mockEnrollment: Enrollment = {
  id: 'enrollment-1',
  userId: 'user-1',
  courseId: 'course-1',
  status: EnrollmentStatus.ACTIVE,
  progress: 45,
  startedAt: '2024-01-10T00:00:00Z',
  lastAccessedAt: '2024-02-01T00:00:00Z',
  certificateIssued: false,
  course: mockCourse,
  createdAt: '2024-01-10T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
};

const mockEnrollmentsResponse: EnrollmentListResponse = {
  enrollments: [mockEnrollment],
  total: 1,
};

describe('useAcademy hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== useCourses =====
  describe('useCourses', () => {
    it('fetches and returns course list', async () => {
      mockedAcademyApi.getCourses.mockResolvedValue({
        data: mockCoursesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCoursesResponse);
      expect(result.current.data?.courses).toHaveLength(2);
      expect(result.current.data?.total).toBe(2);
      expect(mockedAcademyApi.getCourses).toHaveBeenCalledWith({});
    });

    it('passes filters to the API', async () => {
      mockedAcademyApi.getCourses.mockResolvedValue({
        data: {
          courses: [mockCourse],
          total: 1,
          page: 1,
          limit: 10,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const filters = { category: CourseCategory.REAL_ESTATE, level: CourseLevel.BEGINNER };

      const { result } = renderHook(() => useCourses(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedAcademyApi.getCourses).toHaveBeenCalledWith(filters);
      expect(result.current.data?.courses).toHaveLength(1);
    });

    it('returns error when course list fetch fails', async () => {
      mockedAcademyApi.getCourses.mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  // ===== useCourse =====
  describe('useCourse', () => {
    it('fetches a single course by slug', async () => {
      mockedAcademyApi.getCourseBySlug.mockResolvedValue({
        data: mockCourse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useCourse('intro-to-real-estate'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCourse);
      expect(result.current.data?.slug).toBe('intro-to-real-estate');
      expect(result.current.data?.title).toBe('Introduction to Real Estate');
      expect(mockedAcademyApi.getCourseBySlug).toHaveBeenCalledWith(
        'intro-to-real-estate'
      );
    });

    it('does not fetch when slug is empty (enabled: false)', async () => {
      const { result } = renderHook(() => useCourse(''), {
        wrapper: createWrapper(),
      });

      // Should not be loading since the query is disabled
      await waitFor(() => {
        expect(result.current.fetchStatus).toBe('idle');
      });

      expect(mockedAcademyApi.getCourseBySlug).not.toHaveBeenCalled();
    });

    it('returns error when single course fetch fails', async () => {
      mockedAcademyApi.getCourseBySlug.mockRejectedValue(
        new Error('Course not found')
      );

      const { result } = renderHook(() => useCourse('nonexistent-slug'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  // ===== useEnroll =====
  describe('useEnroll', () => {
    it('enrolls in a course and calls API', async () => {
      mockedAcademyApi.enroll.mockResolvedValue({
        data: mockEnrollment,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useEnroll(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate('course-1');
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedAcademyApi.enroll).toHaveBeenCalledWith('course-1');
    });

    it('navigates to my-learning page on success', async () => {
      mockedAcademyApi.enroll.mockResolvedValue({
        data: mockEnrollment,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useEnroll(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate('course-1');
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPush).toHaveBeenCalledWith('/academy/my-learning');
    });

    it('handles enrollment error', async () => {
      mockedAcademyApi.enroll.mockRejectedValue(
        new Error('Already enrolled')
      );

      const { result } = renderHook(() => useEnroll(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate('course-1');
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  // ===== useMyEnrollments =====
  describe('useMyEnrollments', () => {
    it('fetches and returns enrollment list', async () => {
      mockedAcademyApi.getMyEnrollments.mockResolvedValue({
        data: mockEnrollmentsResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useMyEnrollments(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEnrollmentsResponse);
      expect(result.current.data?.enrollments).toHaveLength(1);
      expect(result.current.data?.enrollments[0].courseId).toBe('course-1');
      expect(result.current.data?.enrollments[0].progress).toBe(45);
      expect(mockedAcademyApi.getMyEnrollments).toHaveBeenCalledWith({});
    });

    it('passes status filter to the API', async () => {
      mockedAcademyApi.getMyEnrollments.mockResolvedValue({
        data: mockEnrollmentsResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const filters = { status: EnrollmentStatus.ACTIVE };

      const { result } = renderHook(() => useMyEnrollments(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedAcademyApi.getMyEnrollments).toHaveBeenCalledWith(filters);
    });

    it('returns error when enrollment fetch fails', async () => {
      mockedAcademyApi.getMyEnrollments.mockRejectedValue(
        new Error('Unauthorized')
      );

      const { result } = renderHook(() => useMyEnrollments(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});
