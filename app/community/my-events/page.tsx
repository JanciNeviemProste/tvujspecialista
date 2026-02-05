'use client'

import { useEffect, useState } from 'react'
import { useMyRSVPs, useCancelRSVP, useConfirmRSVP } from '@/lib/hooks/useCommunity'
import { RSVPCard } from '@/components/community/RSVPCard'
import { RSVPsGridSkeleton } from '@/components/community/LoadingStates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { RSVPStatus } from '@/types/community'

export default function MyEventsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: myRSVPs, isLoading, error } = useMyRSVPs()
  const cancelMutation = useCancelRSVP()
  const confirmMutation = useConfirmRSVP()

  const [activeTab, setActiveTab] = useState('registered')

  useEffect(() => {
    document.title = 'Moje eventy | Komunita | tvujspecialista.cz'
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/profi/prihlaseni')
    }
  }, [isAuthenticated, authLoading, router])

  const handleConfirm = async (rsvpId: string) => {
    try {
      await confirmMutation.mutateAsync(rsvpId)
    } catch (error) {
      console.error('Failed to confirm RSVP:', error)
    }
  }

  const handleCancel = async (rsvpId: string) => {
    if (!confirm('Naozaj chcete zrušiť svoju registráciu?')) {
      return
    }

    try {
      await cancelMutation.mutateAsync(rsvpId)
    } catch (error) {
      console.error('Failed to cancel RSVP:', error)
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Filter RSVPs
  const activeRSVPs = myRSVPs?.filter(
    rsvp => rsvp.status === RSVPStatus.PENDING || rsvp.status === RSVPStatus.CONFIRMED
  ) || []

  const pastRSVPs = myRSVPs?.filter(
    rsvp => rsvp.status === RSVPStatus.ATTENDED || rsvp.status === RSVPStatus.CANCELLED
  ) || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Moje eventy</h1>
          <p className="text-lg text-muted-foreground">
            Spravujte svoje registrácie na eventy
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="registered">
              Prihlásené eventy ({activeRSVPs.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Minulé eventy ({pastRSVPs.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Active RSVPs */}
          <TabsContent value="registered">
            {isLoading && <RSVPsGridSkeleton count={3} />}

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center">
                <p className="text-destructive">
                  Chyba pri načítaní registrácií. Skúste to prosím znova.
                </p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                {activeRSVPs.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="mb-4 text-5xl">📅</div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Žiadne aktívne registrácie
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Zatiaľ ste sa neregistrovali na žiadny event.
                      </p>
                      <a
                        href="/community/events"
                        className="text-primary hover:underline"
                      >
                        Preskúmať eventy
                      </a>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeRSVPs.map((rsvp) => (
                      <RSVPCard
                        key={rsvp.id}
                        rsvp={rsvp}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Tab 2: Past RSVPs */}
          <TabsContent value="past">
            {isLoading && <RSVPsGridSkeleton count={3} />}

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center">
                <p className="text-destructive">
                  Chyba pri načítaní registrácií. Skúste to prosím znova.
                </p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                {pastRSVPs.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="mb-4 text-5xl">🕒</div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Žiadne minulé eventy
                      </h3>
                      <p className="text-muted-foreground">
                        Tu sa zobrazia eventy, ktorých ste sa zúčastnili alebo zrušili.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pastRSVPs.map((rsvp) => (
                      <RSVPCard
                        key={rsvp.id}
                        rsvp={rsvp}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
