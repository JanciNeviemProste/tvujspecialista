export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border bg-white dark:bg-card overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 dark:bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-32 bg-gray-200 dark:bg-muted rounded" />
                <div className="h-4 w-24 bg-gray-100 dark:bg-muted/50 rounded" />
                <div className="h-4 w-full bg-gray-100 dark:bg-muted/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
