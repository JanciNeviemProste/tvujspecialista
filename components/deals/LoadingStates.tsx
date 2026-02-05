import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function DealCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-5 w-20 bg-muted rounded-full" />
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>

        {/* Message preview */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>

        {/* Date */}
        <div className="h-3 w-40 bg-muted rounded" />
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <div className="h-8 flex-1 bg-muted rounded" />
        <div className="h-8 flex-1 bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex-shrink-0 w-80 rounded-lg bg-muted/50 p-4 space-y-4">
          {/* Column header */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-5 w-8 bg-muted rounded-full" />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {[1, 2].map((j) => (
              <DealCardSkeleton key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommissionCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
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
