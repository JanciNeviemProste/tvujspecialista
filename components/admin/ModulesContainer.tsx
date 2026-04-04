'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import type { Module } from '@/types/academy';

interface ModulesContainerProps {
  modules: Module[];
  isLoading: boolean;
  addingModule: boolean;
  onToggleAddModule: () => void;
  onSaveModule: (data: { title: string; description: string }) => void;
  moduleLoading: boolean;
  onRefresh: () => void;
  courseId: string;
  renderModuleForm: (props: {
    onSave: (data: { title: string; description: string }) => void;
    onCancel: () => void;
    loading: boolean;
  }) => React.ReactNode;
  renderModuleSection: (props: {
    module: Module;
    index: number;
    total: number;
    onRefresh: () => void;
  }) => React.ReactNode;
}

export default function ModulesContainer({
  modules,
  isLoading,
  addingModule,
  onToggleAddModule,
  onSaveModule,
  moduleLoading,
  onRefresh,
  courseId,
  renderModuleForm,
  renderModuleSection,
}: ModulesContainerProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card p-6 animate-pulse">
            <div className="h-5 w-48 bg-gray-200 dark:bg-muted rounded mb-3" />
            <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((mod, i) =>
        renderModuleSection({
          module: mod,
          index: i,
          total: modules.length,
          onRefresh,
        })
      )}

      {/* Add Module */}
      {addingModule ? (
        renderModuleForm({
          onSave: onSaveModule,
          onCancel: onToggleAddModule,
          loading: moduleLoading,
        })
      ) : (
        <button
          onClick={onToggleAddModule}
          className="flex items-center gap-2 w-full px-5 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Pridať modul
        </button>
      )}
    </div>
  );
}
