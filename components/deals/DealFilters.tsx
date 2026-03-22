'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Deal, DealStatus, DealFilters as DealFiltersType } from '@/types/deals';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
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
  className,
}: DealFiltersProps) {
  const t = useTranslations('dashboard.deals');
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const handleClearFilters = () => {
    onFiltersChange({ search: '', status: 'all' });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all';

  return (
    <div className={cn('flex flex-col sm:flex-row gap-4', className)} role="search" aria-label="Lead filters">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
        <Input
          type="text"
          placeholder={t('filters.searchPlaceholder')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10"
          aria-label="Search leads by name, email, or phone"
        />
      </div>

      {/* Status Filter — only NEW and CONTACTED */}
      <select
        value={filters.status}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            status: e.target.value as typeof filters.status,
          })
        }
        className="px-4 py-2 rounded-lg border bg-white dark:bg-card text-sm min-w-[180px]"
        aria-label="Filter by lead status"
      >
        <option value="all">{t('filters.allStatuses')}</option>
        <option value={DealStatus.NEW}>{t('status.new')}</option>
        <option value={DealStatus.CONTACTED}>{t('status.contacted')}</option>
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="gap-2"
          aria-label="Clear all filters"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {t('filters.clearFilters')}
        </Button>
      )}
    </div>
  );
}
