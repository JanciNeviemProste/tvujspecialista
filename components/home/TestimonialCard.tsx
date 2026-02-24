'use client';

import { Star, Quote, BadgeCheck } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
  rating: string;
  verifiedLabel: string;
}

export function TestimonialCard({ quote, name, location, rating, verifiedLabel }: TestimonialCardProps) {
  const ratingNumber = parseFloat(rating);
  const fullStars = Math.floor(ratingNumber);
  const hasHalfStar = ratingNumber % 1 >= 0.5;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <Quote className="h-8 w-8 text-blue-200 dark:text-primary/30" />
      </div>

      <blockquote className="mb-6 flex-1 text-gray-700 dark:text-muted-foreground leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="mt-auto">
        <div className="mb-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < fullStars
                  ? 'fill-yellow-400 text-yellow-400'
                  : i === fullStars && hasHalfStar
                    ? 'fill-yellow-400/50 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
          <span className="ml-1 text-sm font-medium text-gray-600 dark:text-muted-foreground">
            {rating}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900 dark:text-foreground">{name}</p>
            <p className="text-sm text-gray-500 dark:text-muted-foreground">{location}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 px-3 py-1">
            <BadgeCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">{verifiedLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
