'use client';

// DealAnalytics has been removed as part of the 2-stage lead pipeline simplification.
// This stub is kept for backward compatibility with existing test files.

interface DealAnalyticsProps {
  analytics: unknown;
  isLoading?: boolean;
  className?: string;
}

export function DealAnalytics({ className }: DealAnalyticsProps) {
  return (
    <div className={className}>
      <p>Analytics has been removed.</p>
    </div>
  );
}
