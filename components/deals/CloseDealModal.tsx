'use client';

import { useState } from 'react';
import { Deal, DealStatus } from '@/types/deals';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CloseDealModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealId: string, data: { status: DealStatus.CLOSED_WON | DealStatus.CLOSED_LOST; actualDealValue?: number }) => void;
  isLoading?: boolean;
}

export function CloseDealModal({ deal, isOpen, onClose, onSubmit, isLoading }: CloseDealModalProps) {
  const [status, setStatus] = useState<DealStatus.CLOSED_WON | DealStatus.CLOSED_LOST>(DealStatus.CLOSED_WON);
  const [actualDealValue, setActualDealValue] = useState(deal?.dealValue?.toString() || '');
  const [errors, setErrors] = useState<{ actualDealValue?: string }>({});

  if (!isOpen || !deal) return null;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (status === DealStatus.CLOSED_WON) {
      if (!actualDealValue || parseFloat(actualDealValue) <= 0) {
        newErrors.actualDealValue = 'Zadajte skutočnú hodnotu dealu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(deal.id, {
        status,
        actualDealValue: status === DealStatus.CLOSED_WON ? parseFloat(actualDealValue) : undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Uzavrieť deal</CardTitle>
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
              <Label>Výsledok</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={status === DealStatus.CLOSED_WON ? 'default' : 'outline'}
                  className={cn(
                    'justify-start',
                    status === DealStatus.CLOSED_WON && 'bg-success hover:bg-success/90'
                  )}
                  onClick={() => setStatus(DealStatus.CLOSED_WON)}
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Získaný
                </Button>
                <Button
                  type="button"
                  variant={status === DealStatus.CLOSED_LOST ? 'default' : 'outline'}
                  className={cn(
                    'justify-start',
                    status === DealStatus.CLOSED_LOST && 'bg-destructive hover:bg-destructive/90'
                  )}
                  onClick={() => setStatus(DealStatus.CLOSED_LOST)}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Stratený
                </Button>
              </div>
            </div>

            {status === DealStatus.CLOSED_WON && (
              <div className="space-y-2">
                <Label htmlFor="actualDealValue">Skutočná hodnota dealu (EUR) *</Label>
                <Input
                  id="actualDealValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={actualDealValue}
                  onChange={(e) => setActualDealValue(e.target.value)}
                  placeholder="napr. 1500"
                  disabled={isLoading}
                  className={cn(errors.actualDealValue && 'border-destructive')}
                />
                {errors.actualDealValue && (
                  <p className="text-sm text-destructive">{errors.actualDealValue}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Táto hodnota bude použitá na výpočet provízií
                </p>
              </div>
            )}

            {status === DealStatus.CLOSED_LOST && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  Deal bude označený ako stratený. Nebudú vytvorené žiadne provízne.
                </p>
              </div>
            )}
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
              className={cn(
                'flex-1',
                status === DealStatus.CLOSED_WON && 'bg-success hover:bg-success/90',
                status === DealStatus.CLOSED_LOST && 'bg-destructive hover:bg-destructive/90'
              )}
            >
              {isLoading ? 'Ukladám...' : 'Uzavrieť deal'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
