'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Deal } from '@/types/deals';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
  const t = useTranslations('deals');

  const dealValueSchema = z.object({
    dealValue: z
      .string()
      .min(1, t('valueModal.valueRequired'))
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: t('valueModal.valuePositive'),
      }),
    estimatedCloseDate: z.string().min(1, t('valueModal.dateRequired')),
  });

  type DealValueFormData = z.infer<typeof dealValueSchema>;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('valueModal.title')}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          {/* Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Customer info */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 border border-gray-100 dark:border-neutral-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lead: <strong className="text-gray-900 dark:text-white">{deal.customerName}</strong>
              </p>
            </div>

            {/* Deal Value */}
            <div>
              <label htmlFor="dealValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('valueModal.value')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  €
                </span>
                <input
                  id="dealValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  disabled={isLoading}
                  className={cn(
                    'w-full rounded-xl border bg-white dark:bg-neutral-800 pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors disabled:opacity-50',
                    errors.dealValue
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-300 dark:border-neutral-600'
                  )}
                  {...register('dealValue')}
                />
              </div>
              {errors.dealValue && (
                <p className="text-sm text-red-500 mt-1.5">{errors.dealValue.message}</p>
              )}
            </div>

            {/* Estimated Close Date */}
            <div>
              <label htmlFor="estimatedCloseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('valueModal.expectedClose')}
              </label>
              <input
                id="estimatedCloseDate"
                type="date"
                disabled={isLoading}
                className={cn(
                  'w-full rounded-xl border bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors disabled:opacity-50',
                  errors.estimatedCloseDate
                    ? 'border-red-400 dark:border-red-500'
                    : 'border-gray-300 dark:border-neutral-600'
                )}
                {...register('estimatedCloseDate')}
              />
              {errors.estimatedCloseDate && (
                <p className="text-sm text-red-500 mt-1.5">{errors.estimatedCloseDate.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
            >
              {t('valueModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? t('valueModal.submitting') : t('valueModal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
