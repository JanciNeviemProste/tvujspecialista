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
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Informácie o zákazníkovi
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{deal.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${deal.customerEmail}`} className="hover:underline">
              {deal.customerEmail}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a href={`tel:${deal.customerPhone}`} className="hover:underline">
              {deal.customerPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Initial Message */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pôvodná správa</h3>
        <p className="text-sm bg-muted p-3 rounded-lg">{deal.message}</p>
      </div>

      {/* Deal Information */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Informácie o deale</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Hodnota dealu</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {deal.dealValue
                  ? new Intl.NumberFormat('sk-SK', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(deal.dealValue)
                  : 'Nenastavené'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Predpokladané uzavretie</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {deal.estimatedCloseDate
                  ? new Date(deal.estimatedCloseDate).toLocaleDateString('sk-SK')
                  : 'Nenastavené'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
