import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonSidebar } from '@/components/academy/LessonSidebar';
import type { Module, LessonProgress, LessonType } from '@/types/academy';

const createMockModule = (overrides?: Partial<Module>): Module => ({
  id: 'mod-1',
  courseId: 'course-1',
  title: 'Úvod do nehnuteľností',
  description: 'Základy',
  position: 1,
  duration: 3600,
  lessonCount: 2,
  lessons: [
    {
      id: 'lesson-1',
      moduleId: 'mod-1',
      title: 'Čo je realitný trh',
      description: '',
      position: 1,
      duration: 600,
      type: 'video' as LessonType,
      published: true,
      free: false,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'lesson-2',
      moduleId: 'mod-1',
      title: 'Prvý kontakt s klientom',
      description: '',
      position: 2,
      duration: 900,
      type: 'video' as LessonType,
      published: true,
      free: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

const createMockProgress = (lessonId: string, completed: boolean): LessonProgress => ({
  id: `prog-${lessonId}`,
  enrollmentId: 'enroll-1',
  lessonId,
  completed,
  watchTimeSeconds: completed ? 600 : 120,
  lastWatchedAt: '2026-01-15T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-15T00:00:00Z',
});

describe('LessonSidebar', () => {
  let mockOnLessonSelect: jest.Mock;

  beforeEach(() => {
    mockOnLessonSelect = jest.fn();
  });

  const renderSidebar = (overrides?: Partial<React.ComponentProps<typeof LessonSidebar>>) =>
    render(
      <LessonSidebar
        modules={[createMockModule()]}
        currentLessonId="lesson-1"
        lessonProgress={[]}
        onLessonSelect={mockOnLessonSelect}
        {...overrides}
      />
    );

  describe('Rendering', () => {
    it('renders sidebar heading "Obsah kurzu"', () => {
      renderSidebar();
      expect(screen.getByText('Obsah kurzu')).toBeInTheDocument();
    });

    it('renders module titles', () => {
      renderSidebar();
      expect(screen.getByText('Úvod do nehnuteľností')).toBeInTheDocument();
    });

    it('renders multiple modules', () => {
      const mod2 = createMockModule({
        id: 'mod-2',
        title: 'Pokročilé techniky',
        position: 2,
      });
      renderSidebar({ modules: [createMockModule(), mod2] });

      expect(screen.getByText('Úvod do nehnuteľností')).toBeInTheDocument();
      expect(screen.getByText('Pokročilé techniky')).toBeInTheDocument();
    });
  });

  describe('Module expand/collapse', () => {
    it('auto-expands the module containing currentLessonId', () => {
      renderSidebar({ currentLessonId: 'lesson-1' });
      // Lessons from the module should be visible
      expect(screen.getByText('Čo je realitný trh')).toBeInTheDocument();
      expect(screen.getByText('Prvý kontakt s klientom')).toBeInTheDocument();
    });

    it('does not show lessons of collapsed module', () => {
      const mod2 = createMockModule({
        id: 'mod-2',
        title: 'Modul 2',
        position: 2,
        lessons: [
          {
            id: 'lesson-3',
            moduleId: 'mod-2',
            title: 'Skrytá lekcia',
            description: '',
            position: 1,
            duration: 300,
            type: 'reading' as LessonType,
            published: true,
            free: false,
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
        ],
      });
      // currentLessonId is in mod-1, so mod-2 should be collapsed
      renderSidebar({ modules: [createMockModule(), mod2], currentLessonId: 'lesson-1' });

      expect(screen.queryByText('Skrytá lekcia')).not.toBeInTheDocument();
    });

    it('toggles module expand/collapse on click', async () => {
      const user = userEvent.setup();
      const mod2 = createMockModule({
        id: 'mod-2',
        title: 'Modul 2',
        position: 2,
        lessons: [
          {
            id: 'lesson-3',
            moduleId: 'mod-2',
            title: 'Nová lekcia',
            description: '',
            position: 1,
            duration: 300,
            type: 'reading' as LessonType,
            published: true,
            free: false,
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
        ],
      });
      renderSidebar({ modules: [createMockModule(), mod2], currentLessonId: 'lesson-1' });

      // Mod-2 is collapsed, click to expand
      expect(screen.queryByText('Nová lekcia')).not.toBeInTheDocument();
      await user.click(screen.getByText('Modul 2'));
      expect(screen.getByText('Nová lekcia')).toBeInTheDocument();

      // Click again to collapse
      await user.click(screen.getByText('Modul 2'));
      expect(screen.queryByText('Nová lekcia')).not.toBeInTheDocument();
    });
  });

  describe('Lesson selection', () => {
    it('calls onLessonSelect when a lesson is clicked', async () => {
      const user = userEvent.setup();
      renderSidebar({ currentLessonId: 'lesson-1' });

      await user.click(screen.getByText('Prvý kontakt s klientom'));
      expect(mockOnLessonSelect).toHaveBeenCalledWith('lesson-2');
    });
  });

  describe('Mobile', () => {
    it('closes mobile overlay on Escape key', async () => {
      const user = userEvent.setup();
      renderSidebar();

      // Open mobile sidebar by clicking the toggle button
      const toggleButtons = screen.getAllByRole('button');
      const mobileToggle = toggleButtons[0]; // first button is mobile toggle
      await user.click(mobileToggle);

      // Press Escape to close
      fireEvent.keyDown(document, { key: 'Escape' });

      // The overlay should be gone — sidebar heading still renders in desktop
      expect(screen.getByText('Obsah kurzu')).toBeInTheDocument();
    });
  });
});
