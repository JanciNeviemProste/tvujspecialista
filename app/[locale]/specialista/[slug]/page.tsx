'use client';

import { use, useState, useEffect, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PublicHeader } from '@/components/layout/PublicHeader';
import Image from 'next/image';
import { RatingStars } from '@/components/shared/RatingStars';
import { ShieldCheck, X } from 'lucide-react';
import { useSpecialist } from '@/lib/hooks/useSpecialist';
import { useCreateLead } from '@/lib/hooks/useCreateLead';
import { SpecialistJsonLd } from '@/components/seo/JsonLd';
import type { Review } from '@/types/review';

function getVideoEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?modestbranding=1&rel=0&showinfo=0&color=white`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`;
  }
  return url;
}

export default function SpecialistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: specialist, isLoading, error } = useSpecialist(slug);
  const createLead = useCreateLead();
  const t = useTranslations('specialist');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: '',
  });
  const [gdprConsent, setGdprConsent] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => setSubmitSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!specialist) return;

    try {
      await createLead.mutateAsync({
        specialistId: specialist.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        message: formData.message,
        gdprConsent,
      });
      setSubmitSuccess(true);
      setFormData({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-5xl">⏳</div>
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !specialist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-900">{t('notFound')}</h2>
            <p className="mb-4 text-red-600">
              {t('notFoundDesc')}
            </p>
            <Link
              href="/hledat"
              className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {tCommon('actions.backToSearch')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SpecialistJsonLd specialist={specialist} />
      <PublicHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Header */}
            <div className="rounded-lg border bg-white dark:bg-card p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  {/* Rating summary above avatar */}
                  <div className="flex items-center gap-1.5">
                    <RatingStars
                      rating={specialist.rating}
                      count={specialist.reviewsCount}
                      countLabel={t('reviewsLabel')}
                      showRatingNumber
                      size="md"
                    />
                  </div>

                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-44 lg:w-44 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src={specialist.photo || '/images/placeholder-avatar.png'}
                      alt={specialist.name}
                      fill
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 176px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{specialist.name}</h1>
                    {specialist.verified && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        {tCommon('status.verified')}
                      </span>
                    )}
                    {specialist.topSpecialist && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                        {tCommon('status.top')}
                      </span>
                    )}
                  </div>

                  <p className="mb-3 text-lg text-gray-600">
                    {specialist.category} • {specialist.location}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                      {t('experience', { years: specialist.yearsExperience })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="rounded-lg border bg-white dark:bg-card p-4 sm:p-6 lg:p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('aboutMe')}</h2>
              <p className="leading-relaxed text-gray-700">{specialist.bio}</p>
            </div>

            {/* Trust Signals */}
            <div className="rounded-lg border bg-white dark:bg-card p-4 sm:p-6 lg:p-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-foreground">{t('trustSignals')}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{specialist.yearsExperience}+</div>
                  <div className="text-xs text-gray-600 dark:text-muted-foreground">{t('yearsExp')}</div>
                </div>
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{specialist.reviewsCount}</div>
                  <div className="text-xs text-gray-600 dark:text-muted-foreground">{t('reviewsLabel')}</div>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{specialist.rating}</div>
                  <div className="text-xs text-gray-600 dark:text-muted-foreground">{t('avgRating')}</div>
                </div>
                {specialist.verified && (
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center">
                    <ShieldCheck className="mx-auto mb-1 h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t('verifiedSpecialist')}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Media Gallery */}
            {specialist.mediaGallery && specialist.mediaGallery.length > 0 && (() => {
              const photos = specialist.mediaGallery.filter((item: { type: string }) => item.type === 'image');
              const videos = specialist.mediaGallery.filter((item: { type: string }) => item.type === 'video');
              return (
                <div className="rounded-lg border bg-white dark:bg-card p-4 sm:p-6 lg:p-8">
                  <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-foreground">{t('gallery')}</h2>

                  {/* Photos grid — 3 columns */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {photos.map((item: { url: string; caption?: string }, index: number) => (
                        <div key={`photo-${index}`} className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-pointer" onClick={() => setLightboxImage(item.url)}>
                          <Image
                            src={item.url}
                            alt={item.caption || `Photo ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {item.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                              <p className="text-sm text-white">{item.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Videos — full width, stacked */}
                  {videos.length > 0 && (
                    <div className="space-y-4">
                      {videos.map((item: { url: string; caption?: string }, index: number) => (
                        <div key={`video-${index}`} className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
                          <iframe
                            src={getVideoEmbedUrl(item.url)}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={item.caption || 'Video'}
                          />
                          {item.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <p className="text-sm font-medium text-white">{item.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Services */}
            {specialist.services && specialist.services.length > 0 && (
              <div className="rounded-lg border bg-white dark:bg-card p-4 sm:p-6 lg:p-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('services')}</h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {specialist.services.map((service: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credentials */}
            {(specialist.education || (specialist.certifications && specialist.certifications.length > 0)) && (
              <div className="rounded-lg border bg-white dark:bg-card p-4 sm:p-6 lg:p-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('credentials')}</h2>
                <div className="space-y-3">
                  {specialist.education && (
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('education')}</h3>
                      <p className="text-gray-700">{specialist.education}</p>
                    </div>
                  )}
                  {specialist.certifications && specialist.certifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('certifications')}</h3>
                      <ul className="list-inside list-disc text-gray-700">
                        {specialist.certifications.map((cert: string, index: number) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            {specialist.reviews && specialist.reviews.length > 0 && (
              <div className="rounded-lg border bg-white dark:bg-card p-4 sm:p-6 lg:p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  {t('reviews', { count: specialist.reviews.length })}
                </h2>
                <div className="space-y-6">
                  {specialist.reviews.map((review: Review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                          {review.verified && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              {tCommon('status.verifiedReview')}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(locale === 'sk' ? 'sk-SK' : locale === 'en' ? 'en-US' : locale === 'pl' ? 'pl-PL' : 'cs-CZ')}
                        </span>
                      </div>
                      <div className="mb-2">
                        <RatingStars rating={review.rating} showCount={false} size="sm" />
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                      {review.response && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm font-semibold text-gray-900">{t('specialistResponse')}</p>
                          <p className="text-sm text-gray-700">{review.response.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Contact Card */}
              <div className="rounded-lg border bg-white dark:bg-card p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">{t('contactSpecialist')}</h3>

                {submitSuccess && (
                  <div className="mb-4 rounded-lg bg-green-50 p-4 text-center">
                    <div className="mb-2 text-3xl">✅</div>
                    <p className="text-sm font-semibold text-green-900">{t('contactForm.success')}</p>
                    <p className="text-xs text-green-700">{t('contactForm.successDesc')}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('contactForm.name')}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('contactForm.namePlaceholder')}
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">{t('contactForm.email')}</label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('contactForm.emailPlaceholder')}
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('contactForm.phone')}
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('contactForm.phonePlaceholder')}
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      {t('contactForm.message')}
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={t('contactForm.messagePlaceholder')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      required
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-600 dark:text-muted-foreground">
                      {t('contactForm.gdprConsent')}
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={createLead.isPending || !gdprConsent}
                    className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {createLead.isPending ? t('contactForm.submitting') : t('contactForm.submit')}
                  </button>
                </form>
              </div>

              {/* Info Card */}
              <div className="rounded-lg border bg-gray-50 p-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">{t('moreInfo')}</h3>
                <div className="space-y-3 text-sm">
                  {specialist.availability && specialist.availability.length > 0 && (
                    <div>
                      <span className="text-gray-600">{t('availability')}</span>
                      <div className="mt-1 space-y-1">
                        {specialist.availability.map((slot: string, i: number) => (
                          <p key={i} className="font-medium text-gray-900 dark:text-foreground text-xs">
                            {slot}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxImage(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImage}
              alt="Gallery photo"
              width={1200}
              height={800}
              className="rounded-lg object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
