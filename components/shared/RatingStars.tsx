interface RatingStarsProps {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  showRatingNumber?: boolean
  countLabel?: string
}

export function RatingStars({
  rating,
  count,
  size = 'md',
  showCount = true,
  showRatingNumber = false,
  countLabel,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const ratingFontSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating
  const safeRating = isNaN(numericRating) ? 0 : numericRating

  const stars = []
  const fullStars = Math.floor(safeRating)
  const hasHalfStar = safeRating % 1 >= 0.5

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg
          key={i}
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg
          key={i}
          className={`${sizeClasses[size]} text-yellow-400`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="rgb(229 231 235)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-${i})`}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      )
    } else {
      stars.push(
        <svg
          key={i}
          className={`${sizeClasses[size]} fill-gray-200 text-gray-200`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    }
  }

  return (
    <div className="flex items-center gap-1">
      {showRatingNumber && (
        <span className={`${ratingFontSize[size]} font-bold text-gray-900 dark:text-white mr-0.5`}>
          {safeRating.toFixed(1)}
        </span>
      )}
      {stars}
      {showCount && count !== undefined && (
        <span className="ml-1 text-sm text-gray-500">
          {count} {countLabel || ''}
        </span>
      )}
    </div>
  )
}
