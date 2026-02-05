'use client';

import { useState } from 'react';
import { Deal, DealStatus, DealFilters as DealFiltersType } from '@/types/deals';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DealFiltersProps {
  filters: DealFiltersType;
  onFiltersChange: (filters: DealFiltersType) => void;
  deals: Deal[];
  className?: string;
}

export function DealFilters({
  filters,
  onFiltersChange,
  deals,
  className,
}: DealFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate max deal value for slider
  const maxDealValue = Math.max(
    ...deals.filter((d) => d.dealValue).map((d) => d.dealValue!),
    10000
  );

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      valueRange: [0, maxDealValue],
      dateRange: { from: null, to: null },
      dateType: 'created',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.valueRange[0] > 0 ||
    filters.valueRange[1] < maxDealValue ||
    filters.dateRange.from ||
    filters.dateRange.to;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Status (Always Visible) */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Hľadať dealy..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as typeof filters.status,
            })
          }
          className="px-4 py-2 rounded-lg border bg-card text-sm min-w-[180px]"
        >
          <option value="all">Všetky statusy</option>
          <option value={DealStatus.NEW}>Nový</option>
          <option value={DealStatus.CONTACTED}>Kontaktovaný</option>
          <option value={DealStatus.QUALIFIED}>Kvalifikovaný</option>
          <option value={DealStatus.IN_PROGRESS}>V procese</option>
          <option value={DealStatus.CLOSED_WON}>Získaný</option>
          <option value={DealStatus.CLOSED_LOST}>Stratený</option>
        </select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {isExpanded ? 'Menej' : 'Viac filtrov'}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Vymazať
          </Button>
        )}
      </div>

      {/* Advanced Filters (Collapsible) */}
      {isExpanded && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Value Range Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Hodnota dealu</Label>
                <span className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('sk-SK', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(filters.valueRange[0])}
                  {' - '}
                  {new Intl.NumberFormat('sk-SK', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  }).format(filters.valueRange[1])}
                </span>
              </div>
              <Slider
                min={0}
                max={maxDealValue}
                step={100}
                value={filters.valueRange}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    valueRange: value as [number, number],
                  })
                }
                className="py-4"
              />
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Filtrovať podľa dátumu</Label>

              {/* Date Type Selector */}
              <div className="flex gap-2">
                <Button
                  variant={filters.dateType === 'created' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    onFiltersChange({ ...filters, dateType: 'created' })
                  }
                >
                  Dátum vytvorenia
                </Button>
                <Button
                  variant={
                    filters.dateType === 'estimatedClose' ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    onFiltersChange({ ...filters, dateType: 'estimatedClose' })
                  }
                >
                  Predpokladané uzavretie
                </Button>
              </div>

              {/* Date Range Picker */}
              <DateRangePicker
                from={filters.dateRange.from}
                to={filters.dateRange.to}
                onRangeChange={(from, to) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: { from, to },
                  })
                }
                label=""
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
