'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { RatingStars } from '@/components/shared/RatingStars';
import { useSpecialist } from '@/lib/hooks/useSpecialist';
import { useCreateLead } from '@/lib/hooks/useCreateLead';
import type { Review } from '@/types/review';

export default function SpecialistDetailPage({ params }: { params: { slug: string } }) {
  const { data: specialist, isLoading, error } = useSpecialist(params.slug);
  const createLead = useCreateLead();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        gdprConsent: true,
      });
      setSubmitSuccess(true);
      setFormData({ customerName: '', customerEmail: '', customerPhone: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <a href="/" className="text-2xl font-bold text-blue-600">
              tvujspecialista.cz
            </a>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-5xl">⏳</div>
            <p className="text-gray-600">Načítání specialisty...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !specialist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <a href="/" className="text-2xl font-bold text-blue-600">
              tvujspecialista.cz
            </a>
          </div>
        </header>
        <div className="container mx-auto px-4 py-20">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-900">Specialista nenalezen</h2>
            <p className="mb-4 text-red-600">
              Omlouváme se, ale tento specialista neexistuje nebo byl odstraněn.
            </p>
            <a
              href="/hledat"
              className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Zpět na vyhledávání
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-6">
            <a href="/hledat" className="text-sm font-medium hover:text-blue-600">
              Hledat
            </a>
            <a href="/ceny" className="text-sm font-medium hover:text-blue-600">
              Ceny
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Header */}
            <div className="rounded-lg border bg-white p-8">
              <div className="flex items-start gap-6">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src={specialist.photo || '/images/placeholder-avatar.png'}
                    alt={specialist.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">{specialist.name}</h1>
                    {specialist.verified && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        Ověřený
                      </span>
                    )}
                    {specialist.topSpecialist && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                        Top
                      </span>
                    )}
                  </div>

                  <p className="mb-3 text-lg text-gray-600">
                    {specialist.category} • {specialist.location}
                  </p>

                  <div className="mb-4">
                    <RatingStars
                      rating={specialist.rating}
                      count={specialist.reviewsCount}
                      size="md"
                    />
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">{specialist.yearsExperience}</span> let praxe
                    </div>
                    {specialist.hourlyRate > 0 && (
                      <div>
                        <span className="font-semibold">{specialist.hourlyRate} Kč</span>/hod
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="rounded-lg border bg-white p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">O mně</h2>
              <p className="leading-relaxed text-gray-700">{specialist.bio}</p>
            </div>

            {/* Services */}
            {specialist.services && specialist.services.length > 0 && (
              <div className="rounded-lg border bg-white p-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Služby</h2>
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
              <div className="rounded-lg border bg-white p-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Vzdělání a certifikace</h2>
                <div className="space-y-3">
                  {specialist.education && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Vzdělání</h3>
                      <p className="text-gray-700">{specialist.education}</p>
                    </div>
                  )}
                  {specialist.certifications && specialist.certifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Certifikace</h3>
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
              <div className="rounded-lg border bg-white p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Recenze ({specialist.reviews.length})
                </h2>
                <div className="space-y-6">
                  {specialist.reviews.map((review: Review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                          {review.verified && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              Ověřená recenze
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                        </span>
                      </div>
                      <div className="mb-2">
                        <RatingStars rating={review.rating} showCount={false} size="sm" />
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                      {review.response && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm font-semibold text-gray-900">Odpověď specialisty:</p>
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
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Kontaktovat specialistu</h3>

                {submitSuccess && (
                  <div className="mb-4 rounded-lg bg-green-50 p-4 text-center">
                    <div className="mb-2 text-3xl">✅</div>
                    <p className="text-sm font-semibold text-green-900">Poptávka odeslána!</p>
                    <p className="text-xs text-green-700">Specialista vás brzy kontaktuje.</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Vaše jméno *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Jan Novák"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="jan@example.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="+420 777 123 456"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Zpráva *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Popište, s čím potřebujete pomoci..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createLead.isPending}
                    className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {createLead.isPending ? 'Odesílání...' : 'Odeslat poptávku'}
                  </button>
                </form>
              </div>

              {/* Info Card */}
              <div className="rounded-lg border bg-gray-50 p-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">Další informace</h3>
                <div className="space-y-3 text-sm">
                  {specialist.availability && specialist.availability.length > 0 && (
                    <div>
                      <span className="text-gray-600">Dostupnost:</span>
                      <p className="font-medium text-gray-900">
                        {specialist.availability.join(', ')}
                      </p>
                    </div>
                  )}
                  {specialist.website && (
                    <div>
                      <span className="text-gray-600">Web:</span>
                      <a
                        href={specialist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-blue-600 hover:underline"
                      >
                        {specialist.website}
                      </a>
                    </div>
                  )}
                  {specialist.linkedin && (
                    <div>
                      <span className="text-gray-600">LinkedIn:</span>
                      <a
                        href={specialist.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-blue-600 hover:underline"
                      >
                        Profil na LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
