'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeft, BookOpen, Eye, EyeOff } from 'lucide-react';
import type { Course } from '@/types/academy';

interface CourseHeaderProps {
  course: Course | undefined;
  modulesCount: number;
  lessonsCount: number;
  onPublishToggle: () => void;
  isLoading: boolean;
}

export default function CourseHeader({
  course,
  modulesCount,
  lessonsCount,
  onPublishToggle,
  isLoading,
}: CourseHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href="/academy/admin" className="text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            {course?.title || 'Načítavam...'}
          </h1>
          <p className="text-gray-500 mt-1">
            {modulesCount} {modulesCount === 1 ? 'modul' : modulesCount < 5 ? 'moduly' : 'modulov'}
            {' · '}
            {lessonsCount} lekcií
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPublishToggle}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            course?.published
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {course?.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {course?.published ? 'Skryť' : 'Publikovať'}
        </button>
      </div>
    </div>
  );
}
