'use client';

import { useState } from 'react';
import { Deal } from '@/types/deals';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DealValueModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealId: string, data: { dealValue: number; estimatedCloseDate: string }) => void;
  isLoading?: boolean;
}

export function DealValueModal({ deal, isOpen, onClose, onSubmit, isLoading }: DealValueModalProps) {
  const [dealValue, setDealValue] = useState(deal?.dealValue?.toString() || '');
  const [estimatedCloseDate, setEstimatedCloseDate] = useState(
    deal?.estimatedCloseDate ? new Date(deal.estimatedCloseDate).toISOString().split('T')[0] : ''
  );
  const [errors, setErrors] = useState<{ dealValue?: string; estimatedCloseDate?: string }>({});

  if (!isOpen || !deal) return null;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!dealValue || parseFloat(dealValue) <= 0) {
      newErrors.dealValue = 'Zadajte platnú hodnotu dealu';
    }

    if (!estimatedCloseDate) {
      newErrors.estimatedCloseDate = 'Zadajte predpokladaný dátum uzavretia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(deal.id, {
        dealValue: parseFloat(dealValue),
        estimatedCloseDate,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Nastaviť hodnotu dealu</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deal: <strong>{deal.customerName}</strong>
            </p>

            <div className="space-y-2">
              <Label htmlFor="dealValue">Hodnota dealu (EUR)</Label>
              <Input
                id="dealValue"
                type="number"
                step="0.01"
                min="0"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                placeholder="napr. 1500"
                disabled={isLoading}
                className={cn(errors.dealValue && 'border-destructive')}
              />
              {errors.dealValue && (
                <p className="text-sm text-destructive">{errors.dealValue}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCloseDate">Predpokladané uzavretie</Label>
              <Input
                id="estimatedCloseDate"
                type="date"
                value={estimatedCloseDate}
                onChange={(e) => setEstimatedCloseDate(e.target.value)}
                disabled={isLoading}
                className={cn(errors.estimatedCloseDate && 'border-destructive')}
              />
              {errors.estimatedCloseDate && (
                <p className="text-sm text-destructive">{errors.estimatedCloseDate}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Zrušiť
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Ukladám...' : 'Uložiť'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
