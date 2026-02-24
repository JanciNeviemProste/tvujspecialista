'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { useMyRSVPs, useCancelRSVP, useConfirmRSVP } from '@/lib/hooks/useCommunity'
import { getErrorMessage } from '@/lib/utils/error'
import { RSVPCard } from '@/components/community/RSVPCard'
import { RSVPsGridSkeleton } from '@/components/community/LoadingStates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { RSVPStatus } from '@/types/community'

export default function MyEventsPage() {
  const t = useTranslations('community.myEvents')
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: myRSVPs, isLoading, error } = useMyRSVPs()
  const cancelMutation = useCancelRSVP()
  const confirmMutation = useConfirmRSVP()

  const [activeTab, setActiveTab] = useState('registered')
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    document.title = `${t('title')} | Komunita | tvujspecialista.cz`
  }, [t])

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

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
      setToastMessage({ type: 'error', message: getErrorMessage(error) })
    }
  }

  const handleCancel = async (rsvpId: string) => {
    if (!window.confirm(t('cancelConfirm'))) {
      return
    }

    try {
      await cancelMutation.mutateAsync(rsvpId)
    } catch (error) {
      console.error('Failed to cancel RSVP:', error)
      setToastMessage({ type: 'error', message: getErrorMessage(error) })
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded" />
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
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className={`rounded-lg border p-4 shadow-lg ${
            toastMessage.type === 'success'
              ? 'border-green-300 bg-green-50 text-green-600'
              : 'border-red-300 bg-red-50 text-red-600'
          }`}>
            <p className="font-medium">{toastMessage.message}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-gray-500">
            {t('subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="registered">
              {t('tabs.registered', { count: activeRSVPs.length })}
            </TabsTrigger>
            <TabsTrigger value="past">
              {t('tabs.past', { count: pastRSVPs.length })}
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Active RSVPs */}
          <TabsContent value="registered">
            {isLoading && <RSVPsGridSkeleton count={3} />}

            {error && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-12 text-center">
                <p className="text-red-600">
                  {t('loadError')}
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
                        {t('emptyActive.title')}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {t('emptyActive.description')}
                      </p>
                      <Link
                        href="/community/events"
                        className="text-blue-600 hover:underline"
                      >
                        {t('emptyActive.exploreLink')}
                      </Link>
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
              <div className="rounded-lg border border-red-300 bg-red-50 p-12 text-center">
                <p className="text-red-600">
                  {t('loadError')}
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
                        {t('emptyPast.title')}
                      </h3>
                      <p className="text-gray-500">
                        {t('emptyPast.description')}
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
