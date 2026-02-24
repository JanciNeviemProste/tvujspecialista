'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Deal, DealStatus } from '@/types/deals';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CloseDealModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    dealId: string,
    data: { status: DealStatus.CLOSED_WON | DealStatus.CLOSED_LOST; actualDealValue?: number },
  ) => void;
  isLoading?: boolean;
}

export function CloseDealModal({
  deal,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CloseDealModalProps) {
  const t = useTranslations('dashboard.deals');

  const closeDealSchema = z
    .object({
      status: z.enum([DealStatus.CLOSED_WON, DealStatus.CLOSED_LOST]),
      actualDealValue: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.status === DealStatus.CLOSED_WON) {
          return data.actualDealValue && parseFloat(data.actualDealValue) > 0;
        }
        return true;
      },
      {
        message: t('closeDeal.actualValueRequired'),
        path: ['actualDealValue'],
      },
    );

  type CloseDealFormData = z.infer<typeof closeDealSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CloseDealFormData>({
    resolver: zodResolver(closeDealSchema),
    defaultValues: {
      status: DealStatus.CLOSED_WON,
      actualDealValue: deal?.dealValue?.toString() || '',
    },
  });

  const status = watch('status');

  useEffect(() => {
    if (deal) {
      setValue('actualDealValue', deal.dealValue?.toString() || '');
    }
  }, [deal, setValue]);

  if (!isOpen || !deal) return null;

  const onFormSubmit = (data: CloseDealFormData) => {
    onSubmit(deal.id, {
      status: data.status,
      actualDealValue:
        data.status === DealStatus.CLOSED_WON && data.actualDealValue
          ? parseFloat(data.actualDealValue)
          : undefined,
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
            {t('closeDeal.title')}
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

            {/* Won/Lost Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('closeDeal.result')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('status', DealStatus.CLOSED_WON)}
                  disabled={isLoading}
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 disabled:opacity-50',
                    status === DealStatus.CLOSED_WON
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                      : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-700'
                  )}
                >
                  <CheckCircle className="h-4 w-4" />
                  {t('closeDeal.won')}
                </button>
                <button
                  type="button"
                  onClick={() => setValue('status', DealStatus.CLOSED_LOST)}
                  disabled={isLoading}
                  className={cn(
                    'flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 disabled:opacity-50',
                    status === DealStatus.CLOSED_LOST
                      ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25'
                      : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-600 text-gray-600 dark:text-gray-400 hover:border-red-300 dark:hover:border-red-700'
                  )}
                >
                  <XCircle className="h-4 w-4" />
                  {t('closeDeal.lost')}
                </button>
              </div>
            </div>

            {/* Actual Value (when Won) */}
            {status === DealStatus.CLOSED_WON && (
              <div>
                <label htmlFor="actualDealValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('closeDeal.actualValue')} (EUR) *
                </label>
                <input
                  id="actualDealValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="napr. 1500"
                  disabled={isLoading}
                  className={cn(
                    'w-full rounded-xl border bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors disabled:opacity-50',
                    errors.actualDealValue
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-300 dark:border-neutral-600'
                  )}
                  {...register('actualDealValue')}
                />
                {errors.actualDealValue && (
                  <p className="text-sm text-red-500 mt-1.5">{errors.actualDealValue.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Táto hodnota bude použitá na výpočet provízií
                </p>
              </div>
            )}

            {/* Info box (when Lost) */}
            {status === DealStatus.CLOSED_LOST && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  Lead bude označený ako stratený. Nebudú vytvorené žiadne provízie.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-200 dark:border-neutral-700 disabled:opacity-50"
            >
              {t('closeDeal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={cn(
                'flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors text-white disabled:opacity-50',
                status === DealStatus.CLOSED_WON
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-red-500 hover:bg-red-600'
              )}
            >
              {isLoading ? t('closeDeal.submitting') : t('closeDeal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
