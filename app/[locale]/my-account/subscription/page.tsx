'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Calendar, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SubscriptionBadge } from '@/components/subscriptions/SubscriptionBadge';
import {
  useMyActiveSubscription,
  useUpgradeSubscription,
  useDowngradeSubscription,
  useCancelSubscription,
  useResumeSubscription,
  useCustomerPortal,
} from '@/lib/hooks/useSubscriptions';
import { SubscriptionType } from '@/types/subscriptions';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

const upgradeOptions = {
  [SubscriptionType.EDUCATION]: [
    { type: SubscriptionType.PREMIUM, name: 'Premium', price: 2499 },
  ],
  [SubscriptionType.MARKETPLACE]: [
    { type: SubscriptionType.PREMIUM, name: 'Premium', price: 2499 },
  ],
  [SubscriptionType.PREMIUM]: [],
};

const downgradeOptions = {
  [SubscriptionType.EDUCATION]: [],
  [SubscriptionType.MARKETPLACE]: [],
  [SubscriptionType.PREMIUM]: [
    { type: SubscriptionType.EDUCATION, name: 'Education', price: 799 },
    { type: SubscriptionType.MARKETPLACE, name: 'Marketplace', price: 1999 },
  ],
};

export default function SubscriptionManagementPage() {
  const { data: subscription, isLoading } = useMyActiveSubscription();
  const upgradeMutation = useUpgradeSubscription();
  const downgradeMutation = useDowngradeSubscription();
  const cancelMutation = useCancelSubscription();
  const resumeMutation = useResumeSubscription();
  const customerPortalMutation = useCustomerPortal();

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedNewType, setSelectedNewType] = useState<SubscriptionType | null>(null);

  const handleUpgrade = () => {
    if (subscription && selectedNewType) {
      upgradeMutation.mutate(
        { id: subscription.id, newType: selectedNewType },
        {
          onSuccess: () => {
            setUpgradeDialogOpen(false);
            setSelectedNewType(null);
          },
        }
      );
    }
  };

  const handleDowngrade = () => {
    if (subscription && selectedNewType) {
      downgradeMutation.mutate(
        { id: subscription.id, newType: selectedNewType },
        {
          onSuccess: () => {
            setDowngradeDialogOpen(false);
            setSelectedNewType(null);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    if (subscription) {
      cancelMutation.mutate(subscription.id, {
        onSuccess: () => {
          setCancelDialogOpen(false);
        },
      });
    }
  };

  const handleResume = () => {
    if (subscription) {
      resumeMutation.mutate(subscription.id);
    }
  };

  const handleManageBilling = () => {
    customerPortalMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p>Načítavam predplatné...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Žiadne aktívne predplatné</CardTitle>
            <CardDescription>Momentálne nemáte žiadne aktívne predplatné</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/ceny">
              <Button>Pozrieť cenové plány</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentPeriodEnd = subscription.currentPeriodEnd
    ? format(new Date(subscription.currentPeriodEnd), 'd. MMMM yyyy', { locale: sk })
    : 'N/A';

  const upgrades = upgradeOptions[subscription.subscriptionType] || [];
  const downgrades = downgradeOptions[subscription.subscriptionType] || [];
  const isCanceled = !!subscription.canceledAt;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Moje predplatné</h1>
        <p className="text-muted-foreground">Spravujte svoje predplatné a fakturačné údaje</p>
      </div>

      <div className="grid gap-6">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aktuálne predplatné</CardTitle>
                <CardDescription>Vaša súčasná subscription</CardDescription>
              </div>
              <div className="flex gap-2">
                <SubscriptionBadge type={subscription.subscriptionType} />
                <SubscriptionBadge status={subscription.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCanceled && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vaše predplatné bolo zrušené a skončí sa {currentPeriodEnd}. Máte prístup do
                  konca plateného obdobia.
                </AlertDescription>
              </Alert>
            )}

            {subscription.scheduledDowngradeTo && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Váš plán bude zmenený na{' '}
                  <SubscriptionBadge type={subscription.scheduledDowngradeTo} className="mx-1" />{' '}
                  na konci aktuálneho obdobia ({currentPeriodEnd}).
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Platný do</p>
                  <p className="text-sm text-muted-foreground">{currentPeriodEnd}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fakturácia</p>
                  <p className="text-sm text-muted-foreground">Mesačne</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              {!isCanceled && upgrades.length > 0 && (
                <Button variant="default" onClick={() => setUpgradeDialogOpen(true)}>
                  Upgradovať plán
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {!isCanceled && downgrades.length > 0 && (
                <Button variant="outline" onClick={() => setDowngradeDialogOpen(true)}>
                  Zmeniť plán
                </Button>
              )}

              {isCanceled ? (
                <Button variant="default" onClick={handleResume} disabled={resumeMutation.isPending}>
                  Obnoviť predplatné
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={cancelMutation.isPending}
                >
                  Zrušiť predplatné
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={customerPortalMutation.isPending}
              >
                Spravovať fakturáciu
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Funkcie vášho plánu</CardTitle>
            <CardDescription>Čo je zahrnuté vo vašom predplatnom</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subscription.subscriptionType === SubscriptionType.EDUCATION && (
                <>
                  <p className="text-sm">✓ Prístup ku všetkým kurzom v Academy</p>
                  <p className="text-sm">✓ Certifikáty po absolvovaní</p>
                  <p className="text-sm">✓ Študijné materiály</p>
                  <p className="text-sm">✓ Komunitný prístup</p>
                </>
              )}
              {subscription.subscriptionType === SubscriptionType.MARKETPLACE && (
                <>
                  <p className="text-sm">✓ Deals pipeline management</p>
                  <p className="text-sm">✓ Commission tracking</p>
                  <p className="text-sm">✓ Premium listing v marketplace</p>
                  <p className="text-sm">✓ CRM integrácie</p>
                </>
              )}
              {subscription.subscriptionType === SubscriptionType.PREMIUM && (
                <>
                  <p className="text-sm">✓ Všetko z Education plánu</p>
                  <p className="text-sm">✓ Všetko z Marketplace plánu</p>
                  <p className="text-sm">✓ Exkluzívne webináre</p>
                  <p className="text-sm">✓ Osobný account manager</p>
                  <p className="text-sm">✓ VIP podpora 24/7</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgradovať predplatné</DialogTitle>
            <DialogDescription>
              Vyberte nový plán. Rozdiel v cene bude prepočítaný proporcionálne.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {upgrades.map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedNewType(option.type)}
                className={`w-full rounded-lg border p-4 text-left transition-colors hover:border-primary ${
                  selectedNewType === option.type ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{option.name}</p>
                    <p className="text-sm text-muted-foreground">{option.price} Kč/mesiac</p>
                  </div>
                  {selectedNewType === option.type && (
                    <Badge variant="default">Vybraté</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={!selectedNewType || upgradeMutation.isPending}
            >
              Potvrdiť upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downgrade Dialog */}
      <Dialog open={downgradeDialogOpen} onOpenChange={setDowngradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zmeniť plán</DialogTitle>
            <DialogDescription>
              Zmena sa vykoná na konci aktuálneho billing obdobia.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {downgrades.map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedNewType(option.type)}
                className={`w-full rounded-lg border p-4 text-left transition-colors hover:border-primary ${
                  selectedNewType === option.type ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{option.name}</p>
                    <p className="text-sm text-muted-foreground">{option.price} Kč/mesiac</p>
                  </div>
                  {selectedNewType === option.type && (
                    <Badge variant="default">Vybraté</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDowngradeDialogOpen(false)}>
              Zrušiť
            </Button>
            <Button
              onClick={handleDowngrade}
              disabled={!selectedNewType || downgradeMutation.isPending}
            >
              Potvrdiť zmenu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zrušiť predplatné</DialogTitle>
            <DialogDescription>
              Ste si istí, že chcete zrušiť predplatné? Budete mať prístup do konca plateného
              obdobia ({currentPeriodEnd}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Ponechať predplatné
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              Áno, zrušiť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
