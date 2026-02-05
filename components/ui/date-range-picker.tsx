'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

interface DateRangePickerProps {
  from: string | null;
  to: string | null;
  onRangeChange: (from: string | null, to: string | null) => void;
  label?: string;
  className?: string;
}

export function DateRangePicker({
  from,
  to,
  onRangeChange,
  label = 'Dátumový rozsah',
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="from-date" className="text-xs text-muted-foreground">
            Od
          </Label>
          <Input
            id="from-date"
            type="date"
            value={from || ''}
            onChange={(e) => onRangeChange(e.target.value || null, to)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="to-date" className="text-xs text-muted-foreground">
            Do
          </Label>
          <Input
            id="to-date"
            type="date"
            value={to || ''}
            onChange={(e) => onRangeChange(from, e.target.value || null)}
            min={from || undefined}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
