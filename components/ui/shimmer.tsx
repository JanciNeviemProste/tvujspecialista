import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: 'default' | 'circle' | 'text';
}

/**
 * Shimmer Component - Loading placeholder with animated shimmer effect
 *
 * @example
 * <Shimmer className="w-full h-8" />
 * <Shimmer variant="circle" className="w-12 h-12" />
 * <Shimmer variant="text" className="w-3/4" />
 */
export const Shimmer: React.FC<ShimmerProps> = ({
  className,
  width,
  height,
  variant = 'default',
}) => {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800';

  const variantClasses = {
    default: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
    backgroundSize: '1000px 100%',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * Shimmer Group - Container for multiple shimmer elements
 */
interface ShimmerGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ShimmerGroup: React.FC<ShimmerGroupProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)} aria-busy="true" aria-live="polite">
      {children}
    </div>
  );
};

/**
 * Pre-built shimmer patterns for common use cases
 */
export const ShimmerCard: React.FC<{ className?: string }> = ({ className }) => (
  <ShimmerGroup className={cn('p-4', className)}>
    <Shimmer className="w-1/4 h-6" />
    <Shimmer className="w-full h-4" />
    <Shimmer className="w-3/4 h-4" />
    <div className="flex gap-2 mt-4">
      <Shimmer variant="circle" className="w-8 h-8" />
      <Shimmer variant="circle" className="w-8 h-8" />
    </div>
  </ShimmerGroup>
);

export const ShimmerTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className,
}) => (
  <ShimmerGroup className={className}>
    <Shimmer className="w-full h-10" /> {/* Header */}
    {Array.from({ length: rows }).map((_, i) => (
      <Shimmer key={i} className="w-full h-16" />
    ))}
  </ShimmerGroup>
);

export const ShimmerText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <ShimmerGroup className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <Shimmer
        key={i}
        variant="text"
        className={cn(
          'w-full',
          i === lines - 1 && 'w-3/4' // Last line is shorter
        )}
      />
    ))}
  </ShimmerGroup>
);
