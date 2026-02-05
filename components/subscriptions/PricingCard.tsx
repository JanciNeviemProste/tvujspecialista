'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PricingPlan } from '@/types/subscriptions';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: PricingPlan;
  isRecommended?: boolean;
  currentPlan?: boolean;
  onSelectPlan: () => void;
  isLoading?: boolean;
}

export function PricingCard({
  plan,
  isRecommended = false,
  currentPlan = false,
  onSelectPlan,
  isLoading = false,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col',
        isRecommended && 'border-primary shadow-lg scale-105'
      )}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1">
            Odporúčame
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{plan.monthlyPrice} Kč</span>
          <span className="text-muted-foreground ml-2">/mesiac</span>
        </div>
        {plan.yearlyPrice && (
          <p className="text-sm text-muted-foreground mt-1">
            alebo {plan.yearlyPrice} Kč/rok (ušetríte {plan.monthlyPrice * 12 - plan.yearlyPrice} Kč)
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={onSelectPlan}
          disabled={currentPlan || isLoading}
          className="w-full"
          variant={isRecommended ? 'default' : 'outline'}
          size="lg"
        >
          {currentPlan ? 'Aktuálny plán' : isLoading ? 'Načítavam...' : plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );
}
