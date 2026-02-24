'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Niečo sa pokazilo</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Pri načítaní dashboardu došlo k chybe. Skúste to prosím znovu.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Skúsiť znovu
        </button>
      </div>
    </div>
  )
}
