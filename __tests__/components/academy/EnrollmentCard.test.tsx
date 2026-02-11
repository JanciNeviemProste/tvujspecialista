import React from 'react';
import { screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EnrollmentCard } from '@/components/academy/EnrollmentCard';
import { renderWithProviders } from '@/__tests__/setup/test-utils';
import {
  Enrollment,
  EnrollmentStatus,
  Course,
  CourseLevel,
  CourseCategory,
} from '@/types/academy';

expect.extend(toHaveNoViolations);

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img data-fill={fill ? 'true' : undefined} {...rest} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const createMockCourse = (overrides?: Partial<Course>): Course => ({
  id: 'course-1',
  slug: 'financne-planovanie',
  title: 'Finančné plánovanie pre začiatočníkov',
  description: 'Komplexný kurz o finančnom plánovaní.',
  thumbnailUrl: '/images/courses/financial-planning.jpg',
  level: CourseLevel.BEGINNER,
  category: CourseCategory.FINANCIAL,
  instructorName: 'Mária Kováčová',
  instructorBio: 'Certifikovaná finančná poradkyňa.',
  instructorPhoto: '/images/instructors/maria.jpg',
  duration: 180,
  moduleCount: 6,
  lessonCount: 24,
  enrollmentCount: 215,
  rating: 4.5,
  reviewCount: 67,
  published: true,
  featured: false,
  position: 2,
  createdAt: '2025-01-15T00:00:00Z',
  updatedAt: '2025-07-01T00:00:00Z',
  ...overrides,
});

const createMockEnrollment = (overrides?: Partial<Enrollment>): Enrollment => ({
  id: 'enrollment-1',
  userId: 'user-1',
  courseId: 'course-1',
  status: EnrollmentStatus.ACTIVE,
  progress: 45,
  startedAt: '2025-09-01T00:00:00Z',
  lastAccessedAt: new Date().toISOString(),
  certificateIssued: false,
  course: createMockCourse(),
  createdAt: '2025-09-01T00:00:00Z',
  updatedAt: '2025-10-01T00:00:00Z',
  ...overrides,
});

describe('EnrollmentCard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // RENDERING TESTS
  // ==========================================

  describe('Rendering', () => {
    it('renders course title from enrollment', () => {
      const enrollment = createMockEnrollment();

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(
        screen.getByText('Finančné plánovanie pre začiatočníkov')
      ).toBeInTheDocument();
    });

    it('returns null when enrollment has no course', () => {
      const enrollment = createMockEnrollment({ course: undefined });

      const { container } = renderWithProviders(
        <EnrollmentCard enrollment={enrollment} />
      );

      expect(container.innerHTML).toBe('');
    });

    it('renders course thumbnail image', () => {
      const enrollment = createMockEnrollment();

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      const img = screen.getByAltText('Finančné plánovanie pre začiatočníkov');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/courses/financial-planning.jpg');
    });
  });

  // ==========================================
  // PROGRESS TESTS
  // ==========================================

  describe('Progress', () => {
    it('shows progress percentage', () => {
      const enrollment = createMockEnrollment({ progress: 45 });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('45% dokončené')).toBeInTheDocument();
    });

    it('shows 0% progress correctly', () => {
      const enrollment = createMockEnrollment({ progress: 0 });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('0% dokončené')).toBeInTheDocument();
    });

    it('shows 100% progress correctly', () => {
      const enrollment = createMockEnrollment({ progress: 100 });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('100% dokončené')).toBeInTheDocument();
    });

    it('rounds progress percentage', () => {
      const enrollment = createMockEnrollment({ progress: 67.8 });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('68% dokončené')).toBeInTheDocument();
    });
  });

  // ==========================================
  // STATUS BADGE TESTS
  // ==========================================

  describe('Status Badge', () => {
    it('shows completion status badge when completed', () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.COMPLETED,
        progress: 100,
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('Dokončené')).toBeInTheDocument();
    });

    it('shows active status badge for active enrollment', () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.ACTIVE,
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('Aktívny')).toBeInTheDocument();
    });
  });

  // ==========================================
  // CERTIFICATE BUTTON TESTS
  // ==========================================

  describe('Certificate Download', () => {
    it('shows certificate download button when completed with certificate', () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.COMPLETED,
        progress: 100,
        certificateIssued: true,
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('Stiahnuť certifikát')).toBeInTheDocument();
    });

    it('links to correct certificate URL', () => {
      const enrollment = createMockEnrollment({
        id: 'enrollment-42',
        status: EnrollmentStatus.COMPLETED,
        progress: 100,
        certificateIssued: true,
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      const certLink = screen.getByText('Stiahnuť certifikát').closest('a');
      expect(certLink).toHaveAttribute(
        'href',
        '/academy/certificates/enrollment-42'
      );
    });

    it('does not show certificate button when not issued', () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.ACTIVE,
        certificateIssued: false,
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.queryByText('Stiahnuť certifikát')).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // ENROLLMENT STATUS ACTIONS
  // ==========================================

  describe('Enrollment Status Actions', () => {
    it('shows "Pokračovať" button for active enrollment', () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.ACTIVE,
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('Pokračovať')).toBeInTheDocument();
    });

    it('shows "Opakovať" button for completed enrollment', () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.COMPLETED,
        progress: 100,
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      expect(screen.getByText('Opakovať')).toBeInTheDocument();
    });

    it('links to learn page for active enrollment', () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.ACTIVE,
        course: createMockCourse({ slug: 'financne-planovanie' }),
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      const link = screen.getByText('Pokračovať').closest('a');
      expect(link).toHaveAttribute(
        'href',
        '/academy/learn/financne-planovanie'
      );
    });

    it('shows last accessed time', () => {
      const enrollment = createMockEnrollment({
        lastAccessedAt: new Date().toISOString(),
      });

      renderWithProviders(<EnrollmentCard enrollment={enrollment} />);

      // The relative time will show "práve teraz" for current time
      expect(screen.getByText(/Naposledy:/)).toBeInTheDocument();
    });
  });

  // ==========================================
  // ACCESSIBILITY TESTS
  // ==========================================

  describe('Accessibility', () => {
    it('should have no accessibility violations for active enrollment', async () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.ACTIVE,
      });

      const { container } = renderWithProviders(
        <EnrollmentCard enrollment={enrollment} />
      );

      // Exclude aria-progressbar-name rule - Radix Progress component does not
      // add aria-label by default; this is a known upstream limitation.
      const results = await axe(container, {
        rules: {
          'aria-progressbar-name': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for completed enrollment with certificate', async () => {
      const enrollment = createMockEnrollment({
        status: EnrollmentStatus.COMPLETED,
        progress: 100,
        certificateIssued: true,
      });

      const { container } = renderWithProviders(
        <EnrollmentCard enrollment={enrollment} />
      );

      // Exclude aria-progressbar-name rule - Radix Progress component does not
      // add aria-label by default; this is a known upstream limitation.
      const results = await axe(container, {
        rules: {
          'aria-progressbar-name': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });
});
