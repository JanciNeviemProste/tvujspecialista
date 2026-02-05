import { Badge } from '@/components/ui/badge';
import { SubscriptionType, SubscriptionStatus } from '@/types/subscriptions';
import { cn } from '@/lib/utils/cn';

interface SubscriptionBadgeProps {
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  className?: string;
}

export function SubscriptionBadge({ type, status, className }: SubscriptionBadgeProps) {
  if (type) {
    const typeConfig = {
      [SubscriptionType.EDUCATION]: {
        label: 'Education',
        variant: 'secondary' as const,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      [SubscriptionType.MARKETPLACE]: {
        label: 'Marketplace',
        variant: 'secondary' as const,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      [SubscriptionType.PREMIUM]: {
        label: 'Premium',
        variant: 'default' as const,
        className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      },
    };

    const config = typeConfig[type];

    return (
      <Badge variant={config.variant} className={cn(config.className, className)}>
        {config.label}
      </Badge>
    );
  }

  if (status) {
    const statusConfig = {
      [SubscriptionStatus.ACTIVE]: {
        label: 'Aktívne',
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      [SubscriptionStatus.CANCELED]: {
        label: 'Zrušené',
        variant: 'secondary' as const,
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      },
      [SubscriptionStatus.PAST_DUE]: {
        label: 'Po splatnosti',
        variant: 'secondary' as const,
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      },
      [SubscriptionStatus.TRIALING]: {
        label: 'Skúšobné',
        variant: 'secondary' as const,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      [SubscriptionStatus.UNPAID]: {
        label: 'Neplatené',
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      },
    };

    const config = statusConfig[status];

    return (
      <Badge variant={config.variant} className={cn(config.className, className)}>
        {config.label}
      </Badge>
    );
  }

  return null;
}
