import { Card, CardContent } from '@/components/ui/card';

export function CommissionCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse" role="status" aria-label="Načítám provizi" aria-busy="true">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
          <div className="h-5 w-24 bg-muted rounded-full" />
        </div>

        {/* Financial details */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
          <div className="flex justify-between pt-2 border-t">
            <div className="h-5 w-20 bg-muted rounded" />
            <div className="h-6 w-24 bg-muted rounded" />
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 pt-3 border-t">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommissionStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-20 bg-muted rounded" />
              </div>
              <div className="h-12 w-12 bg-muted rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
