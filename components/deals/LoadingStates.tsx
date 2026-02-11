import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Shimmer, ShimmerGroup } from '@/components/ui/shimmer';

export function DealCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-5 w-20 rounded-full" />
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-4" />
            <Shimmer className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-4" />
            <Shimmer className="h-4 w-32" />
          </div>
        </div>

        {/* Message preview */}
        <div className="space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
        </div>

        {/* Date */}
        <Shimmer className="h-3 w-40" />
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Shimmer className="h-8 flex-1" />
        <Shimmer className="h-8 flex-1" />
      </CardFooter>
    </Card>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4" role="status" aria-label="Načítám obchody" aria-busy="true">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex-shrink-0 w-80 rounded-lg bg-muted/50 p-4 space-y-4">
          {/* Column header */}
          <div className="flex items-center justify-between">
            <Shimmer className="h-6 w-24" />
            <Shimmer className="h-5 w-8 rounded-full" />
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
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Shimmer className="h-6 w-32" />
            <Shimmer className="h-4 w-24" />
          </div>
          <Shimmer className="h-5 w-24 rounded-full" />
        </div>

        {/* Financial details */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-4 w-16" />
          </div>
          <div className="flex justify-between pt-2 border-t">
            <Shimmer className="h-5 w-20" />
            <Shimmer className="h-6 w-24" />
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 pt-3 border-t">
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-4" />
            <Shimmer className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DealFiltersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Shimmer className="h-6 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        <ShimmerGroup>
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
        </ShimmerGroup>
        <div className="flex gap-2">
          <Shimmer className="h-9 flex-1" />
          <Shimmer className="h-9 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DealAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <ShimmerGroup>
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-8 w-32" />
                <Shimmer className="h-3 w-20" />
              </ShimmerGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Shimmer className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Shimmer className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Shimmer className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Shimmer className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
