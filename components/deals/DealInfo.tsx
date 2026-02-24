'use client';

import { Deal } from '@/types/deals';
import { Mail, Phone, Calendar, DollarSign } from 'lucide-react';

interface DealInfoProps {
  deal: Deal;
}

export function DealInfo({ deal }: DealInfoProps) {
  return (
    <>
      {/* Customer Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Informacie o zakaznikovi
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">{deal.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${deal.customerEmail}`} className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
              {deal.customerEmail}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Phone className="h-4 w-4" />
            <a href={`tel:${deal.customerPhone}`} className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
              {deal.customerPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Initial Message */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Povodna sprava</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg">{deal.message}</p>
      </div>

      {/* Deal Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Informacie o leade</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hodnota leadu</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                {deal.dealValue
                  ? new Intl.NumberFormat('sk-SK', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(deal.dealValue)
                  : 'Nenastavene'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Predpokladane uzavretie</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                {deal.estimatedCloseDate
                  ? new Date(deal.estimatedCloseDate).toLocaleDateString('sk-SK')
                  : 'Nenastavene'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
