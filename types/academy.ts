export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseCategory {
  REAL_ESTATE = 'real_estate',
  FINANCIAL = 'financial',
  BOTH = 'both',
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export enum LessonType {
  VIDEO = 'video',
  QUIZ = 'quiz',
  READING = 'reading',
  ASSIGNMENT = 'assignment',
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: CourseLevel;
  category: CourseCategory;
  instructorName: string;
  instructorBio: string;
  instructorPhoto: string;
  duration: number;
  moduleCount: number;
  lessonCount: number;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  published: boolean;
  featured: boolean;
  position: number;
  modules?: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  position: number;
  duration: number;
  lessonCount: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  position: number;
  videoId?: string;
  duration: number;
  type: LessonType;
  content?: any;
  published: boolean;
  free: boolean;
  video?: Video;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  lessonId: string;
  title: string;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  duration: number;
  thumbnailUrl: string;
  transcriptUrl?: string;
  resolution: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  certificateIssued: boolean;
  certificateIssuedAt?: string;
  course?: Course;
  lessonProgress?: LessonProgress[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  completed: boolean;
  watchTimeSeconds: number;
  lastWatchedAt: string;
  notes?: string;
  lesson?: Lesson;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilters {
  category?: CourseCategory;
  level?: CourseLevel;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}

export interface EnrollmentFilters {
  status?: EnrollmentStatus;
}

export interface EnrollmentListResponse {
  enrollments: Enrollment[];
  total: number;
}

export interface UpdateProgressDto {
  enrollmentId: string;
  lessonId: string;
  watchTimeSeconds: number;
  completed: boolean;
  notes?: string;
}
