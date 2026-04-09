'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsApi } from '@/lib/api/reviews';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Review } from '@/types/review';
import { useTranslations, useLocale } from 'next-intl';
import { EditableText } from '@/components/editor/EditableText';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const t = useTranslations('dashboard.reviews');
  const tCommon = useTranslations('common.status');
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestEmail, setRequestEmail] = useState('');
  const [requestSending, setRequestSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'manage' | 'request'>('manage');

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data } = await reviewsApi.getMyReviews();
        setReviews(data as Review[]);
      } catch {
        toast.error(t('loadError'));
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadReviews();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.reviews.loading">{t('loading')}</EditableText></p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/profi/prihlaseni');
    return null;
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
        : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white"><EditableText tKey="dashboard.reviews.title">{t('title')}</EditableText></h1>
          <p className="text-gray-600 dark:text-gray-400"><EditableText tKey="dashboard.reviews.subtitle">{t('subtitle')}</EditableText></p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-0">
            <button
              className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('manage')}
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <EditableText tKey="dashboard.reviews.tabManage">{t('tabManage')}</EditableText>
              </span>
              {activeTab === 'manage' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'request'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('request')}
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <EditableText tKey="dashboard.reviews.tabRequest">{t('tabRequest')}</EditableText>
              </span>
              {activeTab === 'request' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: Správa recenzí */}
        {activeTab === 'manage' && (
          <>
            {/* Souhrn hodnoceni */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white">
                      {averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={Math.round(averageRating)} />
                    <p className="mt-2 text-sm text-gray-500">
                      {t('count', { count: reviews.length })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <span className="w-8 text-right text-sm text-gray-600 dark:text-gray-400">
                          {item.stars} &#9733;
                        </span>
                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-yellow-400"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-8 text-right text-sm text-gray-500">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seznam recenzi */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {review.customerName}
                            </h3>
                            {review.verified && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                <EditableText tKey="common.status.verified">{tCommon('verified')}</EditableText>
                              </span>
                            )}
                          </div>
                          <StarRating rating={review.rating} />
                          <p className="mt-3 text-gray-700 dark:text-gray-300">{review.text}</p>
                          {review.response ? (
                            <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                              <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                                <EditableText tKey="dashboard.reviews.yourResponse">{t('yourResponse')}</EditableText>
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{review.response.text}</p>
                            </div>
                          ) : respondingTo === review.id ? (
                            <div className="mt-4 space-y-3">
                              <textarea
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={3}
                                placeholder={t('responsePlaceholder')}
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <button
                                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                                  disabled={!responseText.trim() || submitting}
                                  onClick={async () => {
                                    setSubmitting(true);
                                    try {
                                      await reviewsApi.respond(review.id, responseText.trim());
                                      setReviews((prev) =>
                                        prev.map((r) =>
                                          r.id === review.id
                                            ? { ...r, response: { text: responseText.trim(), createdAt: new Date() } }
                                            : r
                                        )
                                      );
                                      setRespondingTo(null);
                                      setResponseText('');
                                      toast.success(t('responseSuccess'));
                                    } catch {
                                      toast.error(t('responseError'));
                                    } finally {
                                      setSubmitting(false);
                                    }
                                  }}
                                >
                                  {submitting ? t('sending') : t('sendResponse')}
                                </button>
                                <button
                                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-800 transition-colors"
                                  onClick={() => { setRespondingTo(null); setResponseText(''); }}
                                >
                                  <EditableText tKey="dashboard.reviews.cancel">{t('cancel')}</EditableText>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                              onClick={() => setRespondingTo(review.id)}
                            >
                              <EditableText tKey="dashboard.reviews.writeResponse">{t('writeResponse')}</EditableText>
                            </button>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(locale === 'sk' ? 'sk-SK' : locale === 'en' ? 'en-US' : locale === 'pl' ? 'pl-PL' : 'cs-CZ')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <EditableText tKey="dashboard.reviews.empty.title">{t('empty.title')}</EditableText>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    <EditableText tKey="dashboard.reviews.empty.description">{t('empty.description')}</EditableText>
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* TAB 2: Získat recenzi */}
        {activeTab === 'request' && (
          <div className="max-w-2xl mx-auto">
            {/* Email form card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <EditableText tKey="dashboard.reviews.requestReview.title">{t('requestReview.title')}</EditableText>
                </CardTitle>
                <CardDescription><EditableText tKey="dashboard.reviews.requestReview.description">{t('requestReview.description')}</EditableText></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <EditableText tKey="dashboard.reviews.requestReview.emailLabel">{t('requestReview.emailLabel')}</EditableText>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={t('requestReview.emailPlaceholder')}
                        value={requestEmail}
                        onChange={(e) => setRequestEmail(e.target.value)}
                      />
                      <button
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                        disabled={!requestEmail.trim() || requestSending}
                        onClick={async () => {
                          setRequestSending(true);
                          try {
                            await reviewsApi.requestReviewToken(requestEmail.trim());
                            setRequestEmail('');
                            toast.success(t('requestReview.success'));
                          } catch {
                            toast.error(t('requestReview.error'));
                          } finally {
                            setRequestSending(false);
                          }
                        }}
                      >
                        {requestSending ? t('requestReview.sending') : t('requestReview.sendButton')}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg"><EditableText tKey="dashboard.reviews.requestReview.howItWorks">{t('requestReview.howItWorks')}</EditableText></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white"><EditableText tKey="dashboard.reviews.requestReview.step1">{t('requestReview.step1')}</EditableText></h4>
                      <p className="mt-0.5 text-sm text-gray-500"><EditableText tKey="dashboard.reviews.requestReview.step1desc">{t('requestReview.step1desc')}</EditableText></p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white"><EditableText tKey="dashboard.reviews.requestReview.step2">{t('requestReview.step2')}</EditableText></h4>
                      <p className="mt-0.5 text-sm text-gray-500"><EditableText tKey="dashboard.reviews.requestReview.step2desc">{t('requestReview.step2desc')}</EditableText></p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white"><EditableText tKey="dashboard.reviews.requestReview.step3">{t('requestReview.step3')}</EditableText></h4>
                      <p className="mt-0.5 text-sm text-gray-500"><EditableText tKey="dashboard.reviews.requestReview.step3desc">{t('requestReview.step3desc')}</EditableText></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
