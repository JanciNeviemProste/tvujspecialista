export default function SpecialistLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border bg-white dark:bg-card p-8 animate-pulse">
              <div className="flex gap-6">
                <div className="h-44 w-44 rounded-full bg-gray-200 dark:bg-muted" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 w-48 bg-gray-200 dark:bg-muted rounded" />
                  <div className="h-4 w-32 bg-gray-100 dark:bg-muted/50 rounded" />
                  <div className="h-4 w-24 bg-gray-100 dark:bg-muted/50 rounded" />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white dark:bg-card p-6 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 dark:bg-muted rounded mb-4" />
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 dark:bg-muted/50 rounded" />
                <div className="h-10 bg-gray-100 dark:bg-muted/50 rounded" />
                <div className="h-10 bg-gray-100 dark:bg-muted/50 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
