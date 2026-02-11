'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Deal } from '@/types/deals';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const dealValueSchema = z.object({
  dealValue: z
    .string()
    .min(1, 'Zadajte platnú hodnotu dealu')
    .refine((val) => parseFloat(val) > 0, {
      message: 'Zadajte platnú hodnotu dealu',
    }),
  estimatedCloseDate: z.string().min(1, 'Zadajte predpokladaný dátum uzavretia'),
});

type DealValueFormData = z.infer<typeof dealValueSchema>;

interface DealValueModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealId: string, data: { dealValue: number; estimatedCloseDate: string }) => void;
  isLoading?: boolean;
}

export function DealValueModal({
  deal,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: DealValueModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DealValueFormData>({
    resolver: zodResolver(dealValueSchema),
    defaultValues: {
      dealValue: deal?.dealValue?.toString() || '',
      estimatedCloseDate: deal?.estimatedCloseDate
        ? new Date(deal.estimatedCloseDate).toISOString().split('T')[0]
        : '',
    },
  });

  useEffect(() => {
    if (deal) {
      setValue('dealValue', deal.dealValue?.toString() || '');
      setValue(
        'estimatedCloseDate',
        deal.estimatedCloseDate
          ? new Date(deal.estimatedCloseDate).toISOString().split('T')[0]
          : '',
      );
    }
  }, [deal, setValue]);

  if (!isOpen || !deal) return null;

  const onFormSubmit = (data: DealValueFormData) => {
    onSubmit(deal.id, {
      dealValue: parseFloat(data.dealValue),
      estimatedCloseDate: data.estimatedCloseDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Nastaviť hodnotu dealu</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
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
                placeholder="napr. 1500"
                disabled={isLoading}
                className={cn(errors.dealValue && 'border-destructive')}
                {...register('dealValue')}
              />
              {errors.dealValue && (
                <p className="text-sm text-destructive">{errors.dealValue.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCloseDate">Predpokladané uzavretie</Label>
              <Input
                id="estimatedCloseDate"
                type="date"
                disabled={isLoading}
                className={cn(errors.estimatedCloseDate && 'border-destructive')}
                {...register('estimatedCloseDate')}
              />
              {errors.estimatedCloseDate && (
                <p className="text-sm text-destructive">{errors.estimatedCloseDate.message}</p>
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
            <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1">
              {isLoading ? 'Ukladám...' : 'Uložiť'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
