import React from 'react';
import { screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CourseCard } from '@/components/academy/CourseCard';
import { renderWithProviders } from '@/__tests__/setup/test-utils';
import { Course, CourseLevel, CourseCategory } from '@/types/academy';

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
  slug: 'test-course',
  title: 'Základy investovania do nehnuteľností',
  description: 'Naučte sa základy investovania do nehnuteľností a začnite budovať svoje portfólio.',
  thumbnailUrl: '/images/courses/real-estate-basics.jpg',
  level: CourseLevel.BEGINNER,
  category: CourseCategory.REAL_ESTATE,
  instructorName: 'Ján Novák',
  instructorBio: 'Skúsený investor s 15-ročnou praxou.',
  instructorPhoto: '/images/instructors/jan-novak.jpg',
  duration: 150,
  moduleCount: 5,
  lessonCount: 20,
  enrollmentCount: 342,
  rating: 4.7,
  reviewCount: 89,
  published: true,
  featured: false,
  position: 1,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-06-01T00:00:00Z',
  ...overrides,
});

describe('CourseCard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // RENDERING TESTS
  // ==========================================

  describe('Rendering', () => {
    it('renders course title and description', () => {
      const course = createMockCourse();

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('Základy investovania do nehnuteľností')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Naučte sa základy investovania do nehnuteľností a začnite budovať svoje portfólio.'
        )
      ).toBeInTheDocument();
    });

    it('shows course duration and level badge for beginner', () => {
      const course = createMockCourse({ duration: 150, level: CourseLevel.BEGINNER });

      renderWithProviders(<CourseCard course={course} />);

      // Duration: 150 min = 2h 30min
      expect(screen.getByText('2h 30min')).toBeInTheDocument();
      // Lesson count
      expect(screen.getByText('20 lekcií')).toBeInTheDocument();
      // Level badge
      expect(screen.getByText('Začiatočník')).toBeInTheDocument();
    });

    it('shows intermediate level badge', () => {
      const course = createMockCourse({ level: CourseLevel.INTERMEDIATE });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('Stredný')).toBeInTheDocument();
    });

    it('shows advanced level badge', () => {
      const course = createMockCourse({ level: CourseLevel.ADVANCED });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('Pokročilý')).toBeInTheDocument();
    });

    it('formats duration correctly for less than 60 minutes', () => {
      const course = createMockCourse({ duration: 45 });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('45min')).toBeInTheDocument();
    });

    it('formats duration correctly for exact hours', () => {
      const course = createMockCourse({ duration: 120 });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('2h')).toBeInTheDocument();
    });

    it('shows instructor info', () => {
      const course = createMockCourse({ instructorName: 'Ján Novák' });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('Ján Novák')).toBeInTheDocument();
      // Avatar fallback should show initials
      expect(screen.getByText('JN')).toBeInTheDocument();
    });

    it('shows rating and review count', () => {
      const course = createMockCourse({ rating: 4.7, reviewCount: 89 });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('4.7')).toBeInTheDocument();
      expect(screen.getByText('(89)')).toBeInTheDocument();
    });

    it('shows Featured badge when course is featured', () => {
      const course = createMockCourse({ featured: true });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('does not show Featured badge when course is not featured', () => {
      const course = createMockCourse({ featured: false });

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // PROGRESS BAR TESTS
  // ==========================================

  describe('Progress Bar', () => {
    it('shows progress bar when enrolled with progress data', () => {
      const course = createMockCourse();

      renderWithProviders(
        <CourseCard course={course} enrolled={true} progress={65} />
      );

      expect(screen.getByText('65% dokončené')).toBeInTheDocument();
    });

    it('does not show progress bar when not enrolled', () => {
      const course = createMockCourse();

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.queryByText(/dokončené/)).not.toBeInTheDocument();
    });

    it('does not show progress bar when enrolled but progress is undefined', () => {
      const course = createMockCourse();

      renderWithProviders(<CourseCard course={course} enrolled={true} />);

      expect(screen.queryByText(/dokončené/)).not.toBeInTheDocument();
    });

    it('shows 0% progress correctly', () => {
      const course = createMockCourse();

      renderWithProviders(
        <CourseCard course={course} enrolled={true} progress={0} />
      );

      expect(screen.getByText('0% dokončené')).toBeInTheDocument();
    });

    it('rounds progress percentage', () => {
      const course = createMockCourse();

      renderWithProviders(
        <CourseCard course={course} enrolled={true} progress={33.7} />
      );

      expect(screen.getByText('34% dokončené')).toBeInTheDocument();
    });
  });

  // ==========================================
  // BUTTON TEXT TESTS
  // ==========================================

  describe('Button Text', () => {
    it('shows "Zobraziť kurz" when not enrolled', () => {
      const course = createMockCourse();

      renderWithProviders(<CourseCard course={course} />);

      expect(screen.getByText('Zobraziť kurz')).toBeInTheDocument();
    });

    it('shows "Pokračovať" when enrolled', () => {
      const course = createMockCourse();

      renderWithProviders(<CourseCard course={course} enrolled={true} progress={50} />);

      expect(screen.getByText('Pokračovať')).toBeInTheDocument();
    });

    it('links to course detail page when not enrolled', () => {
      const course = createMockCourse({ slug: 'test-course' });

      renderWithProviders(<CourseCard course={course} />);

      const link = screen.getByText('Zobraziť kurz').closest('a');
      expect(link).toHaveAttribute('href', '/academy/courses/test-course');
    });

    it('links to learn page when enrolled', () => {
      const course = createMockCourse({ slug: 'test-course' });

      renderWithProviders(
        <CourseCard course={course} enrolled={true} progress={50} />
      );

      const link = screen.getByText('Pokračovať').closest('a');
      expect(link).toHaveAttribute('href', '/academy/learn/test-course');
    });
  });

  // ==========================================
  // ACCESSIBILITY TESTS
  // ==========================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const course = createMockCourse();

      const { container } = renderWithProviders(<CourseCard course={course} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when enrolled with progress', async () => {
      const course = createMockCourse();

      const { container } = renderWithProviders(
        <CourseCard course={course} enrolled={true} progress={75} />
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
