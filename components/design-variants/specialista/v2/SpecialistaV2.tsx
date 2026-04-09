'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import {
  Terminal,
  Star,
  MessageSquare,
  Phone,
  Video,
  Calendar,
  ChevronRight,
} from 'lucide-react';

import { useCreateLead } from '@/lib/hooks/useCreateLead';
import type { SpecialistDetail } from '@/lib/hooks/useSpecialist';
import { toast } from 'sonner';

const MONO = 'var(--font-v2-mono), ui-monospace, monospace';
const SANS = 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif';
const EMERALD = '#10b981';

const contactSchema = z.object({
  name: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(9, 'Neplatné telefónne číslo'),
  message: z.string().min(10, 'Správa musí mať aspoň 10 znakov'),
  gdprAccepted: z.boolean().refine((v) => v, 'Musíte súhlasiť s GDPR'),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface SpecialistaV2Props {
  specialist: SpecialistDetail;
}

const SERVICE_MENU = [
  { name: 'intro_consultation', duration: '30min', price: 'FREE' },
  { name: 'mortgage_advisory', duration: '60min', price: '1,500 CZK' },
  { name: 'financial_planning', duration: '90min', price: '2,900 CZK' },
  { name: 'mortgage_refinance', duration: '60min', price: '1,900 CZK' },
  { name: 'portfolio_review', duration: '60min', price: '2,400 CZK' },
];

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const HOURS = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

// deterministic availability pattern
function isAvailable(day: number, hour: number): boolean {
  if (day >= 5) return hour % 3 === 0; // weekends sparse
  if (hour === 12) return false; // lunch
  return (day * 7 + hour * 3) % 5 !== 0;
}

export function SpecialistaV2({ specialist }: SpecialistaV2Props) {
  const createLead = useCreateLead();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', phone: '', message: '', gdprAccepted: false, website: '' },
  });

  const onSubmit = (data: ContactFormData) => {
    if (data.website) return;
    createLead.mutate(
      {
        specialistId: specialist.id,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        message: data.message,
        gdprConsent: data.gdprAccepted,
      },
      {
        onSuccess: () => {
          toast.success('Správa odoslaná! Špecialista sa vám ozve do 24 hodín.');
          reset();
        },
        onError: () => {
          toast.error('Nastala chyba. Skúste to znova.');
        },
      }
    );
  };

  const slugPath = specialist.slug || specialist.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      data-theme="v2"
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: SANS }}
    >
      {/* Sticky terminal top bar */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/90 px-4 py-2 text-xs backdrop-blur"
        style={{ fontFamily: MONO }}
      >
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">~/specialist/</span>
          <span className="font-semibold text-foreground">{slugPath}</span>
        </div>
        <div
          className="flex items-center gap-2 rounded-md border border-border px-2 py-1"
          style={{ color: EMERALD }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full opacity-75" style={{ background: EMERALD }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: EMERALD }} />
          </span>
          <span>online · response_time: ~2h</span>
        </div>
      </div>

      {/* Hero — dense profile header */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="flex items-start gap-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border">
                <Image
                  src={specialist.photo}
                  alt={specialist.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {specialist.name}
                </h1>
                <div
                  className="mt-2 text-xs text-muted-foreground"
                  style={{ fontFamily: MONO }}
                >
                  {specialist.category} · {specialist.location} · {specialist.yearsExperience}y exp
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        style={{
                          fill: i <= Math.round(specialist.rating) ? EMERALD : 'transparent',
                          color: i <= Math.round(specialist.rating) ? EMERALD : 'hsl(var(--muted-foreground))',
                        }}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {specialist.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground" style={{ fontFamily: MONO }}>
                    ({specialist.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: metric tiles */}
            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              style={{ fontFamily: MONO }}
            >
              {[
                { k: 'Reviews', v: specialist.reviewsCount },
                { k: 'Rating', v: specialist.rating.toFixed(1) },
                { k: 'Years', v: specialist.yearsExperience },
                { k: 'Response', v: '<24h' },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-md border border-border bg-card px-3 py-2 text-xs"
                >
                  <span className="text-muted-foreground">[{m.k}: </span>
                  <span className="font-semibold text-foreground">{m.v}</span>
                  <span className="text-muted-foreground">]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {specialist.bio}
          </p>

          {/* Inline action bar */}
          <div
            className="mt-6 flex flex-wrap gap-2"
            style={{ fontFamily: MONO }}
          >
            {[
              { icon: MessageSquare, label: 'message', href: '#booking-form' },
              { icon: Phone, label: 'call', href: `tel:${specialist.phone}` },
              { icon: Video, label: 'video', href: '#booking-form' },
              { icon: Calendar, label: 'calendar', href: '#availability' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#10b981] hover:text-[#10b981]"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}()
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Service catalog — data table */}
      <section className="border-b border-border py-12">
        <div className="container mx-auto px-6">
          <div
            className="mb-4 text-xs uppercase tracking-wider text-muted-foreground"
            style={{ fontFamily: MONO }}
          >
            // service_catalog.tsv
          </div>
          <div
            className="overflow-hidden rounded-md border border-border"
            style={{ fontFamily: MONO }}
          >
            <div className="grid grid-cols-[1fr_120px_140px] gap-2 border-b border-border bg-secondary/60 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <div>service_name</div>
              <div>duration</div>
              <div className="text-right">price</div>
            </div>
            {SERVICE_MENU.map((svc, i) => (
              <div
                key={svc.name}
                className={`grid grid-cols-[1fr_120px_140px] gap-2 px-4 py-3 text-xs text-foreground ${
                  i % 2 === 0 ? 'bg-card' : 'bg-background'
                }`}
              >
                <div className="font-semibold">{svc.name}</div>
                <div className="text-muted-foreground">{svc.duration}</div>
                <div
                  className="text-right font-semibold"
                  style={{ color: svc.price === 'FREE' ? EMERALD : undefined }}
                >
                  {svc.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Availability heatmap */}
      <section id="availability" className="border-b border-border py-12">
        <div className="container mx-auto px-6">
          <div
            className="mb-4 text-xs uppercase tracking-wider text-muted-foreground"
            style={{ fontFamily: MONO }}
          >
            // availability_matrix [click to select]
          </div>
          <div
            className="inline-block overflow-hidden rounded-md border border-border bg-card p-3"
            style={{ fontFamily: MONO }}
          >
            <div className="grid grid-cols-[40px_repeat(7,minmax(32px,1fr))] gap-1">
              <div />
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-semibold text-muted-foreground"
                >
                  {d}
                </div>
              ))}
              {HOURS.map((h, hIdx) => (
                <>
                  <div
                    key={`h-${h}`}
                    className="flex items-center justify-end pr-1 text-[10px] text-muted-foreground"
                  >
                    {h}:00
                  </div>
                  {DAYS.map((d, dIdx) => {
                    const key = `${d}-${h}`;
                    const available = isAvailable(dIdx, hIdx);
                    const selected = selectedCell === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={!available}
                        onClick={() => setSelectedCell(key)}
                        className="h-6 rounded-sm border border-border transition-all disabled:cursor-not-allowed"
                        style={{
                          background: selected
                            ? EMERALD
                            : available
                            ? 'rgba(16,185,129,0.25)'
                            : 'hsl(var(--secondary))',
                          outline: selected ? `2px solid ${EMERALD}` : 'none',
                        }}
                        aria-label={`${d} ${h}:00 ${available ? 'available' : 'booked'}`}
                      />
                    );
                  })}
                </>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: 'rgba(16,185,129,0.25)' }} />
                available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-secondary" />
                booked
              </span>
              {selectedCell && (
                <span style={{ color: EMERALD }}>
                  selected: {selectedCell}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews timeline */}
      <section className="border-b border-border py-12">
        <div className="container mx-auto px-6">
          <div
            className="mb-6 text-xs uppercase tracking-wider text-muted-foreground"
            style={{ fontFamily: MONO }}
          >
            // reviews.log ({specialist.reviews.length} entries)
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {specialist.reviews.map((review) => {
              const dateStr = new Date(review.createdAt).toISOString().slice(0, 10);
              const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
              return (
                <div
                  key={review.id}
                  className="rounded-md border border-border bg-card p-5"
                >
                  <div
                    className="flex flex-wrap items-center gap-3 text-xs"
                    style={{ fontFamily: MONO }}
                  >
                    <span className="text-muted-foreground">[{dateStr}]</span>
                    <span className="font-semibold text-foreground">
                      {review.customerName}
                    </span>
                    <span style={{ color: EMERALD }}>
                      {stars} {review.rating.toFixed(1)}
                    </span>
                    {review.verified && (
                      <span className="rounded-sm border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        verified
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    {review.text}
                  </p>
                  {review.response?.text && (
                    <div
                      className="mt-3 border-l-2 pl-4 text-xs leading-relaxed text-muted-foreground"
                      style={{ borderColor: EMERALD, fontFamily: MONO }}
                    >
                      <span style={{ color: EMERALD }}>&gt; </span>
                      {review.response.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credentials code block */}
      {(specialist.certifications?.length || specialist.education) && (
        <section className="border-b border-border py-12">
          <div className="container mx-auto px-6">
            <div
              className="mb-4 text-xs uppercase tracking-wider text-muted-foreground"
              style={{ fontFamily: MONO }}
            >
              // credentials.json
            </div>
            <pre
              className="overflow-x-auto rounded-md border border-border bg-card p-5 text-xs leading-relaxed text-foreground"
              style={{ fontFamily: MONO }}
            >
{`{
  "education": ${JSON.stringify(specialist.education || '')},
  "certifications": [`}
              {specialist.certifications?.map((c, i) => (
                <span key={c}>
                  {'\n    '}
                  <span style={{ color: EMERALD }}>{JSON.stringify(c)}</span>
                  {i < (specialist.certifications?.length || 0) - 1 ? ',' : ''}
                </span>
              ))}
              {`\n  ]\n}`}
            </pre>
          </div>
        </section>
      )}

      {/* Booking form — code-editor card */}
      <section id="booking-form" className="py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl">
            <div
              className="overflow-hidden rounded-md border border-border bg-card"
              style={{ fontFamily: MONO }}
            >
              <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>contact.ts</span>
                <span>— specialist_inquiry</span>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
                <div className="text-xs text-muted-foreground">
                  // Contact specialist — response within 24h
                </div>

                <input
                  type="text"
                  {...register('website')}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs text-muted-foreground">
                      name:
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                      style={{ fontFamily: SANS }}
                      placeholder="Vaše meno"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-muted-foreground">
                      phone:
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                      style={{ fontFamily: SANS }}
                      placeholder="+421 900 123 456"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">
                    email:
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                    style={{ fontFamily: SANS }}
                    placeholder="vas@email.sk"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-muted-foreground">
                    message:
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                    style={{ fontFamily: SANS }}
                    placeholder="S čím vám môžem pomôcť?"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <label
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                  style={{ fontFamily: SANS }}
                >
                  <input
                    type="checkbox"
                    {...register('gdprAccepted')}
                    className="mt-0.5 h-4 w-4 rounded border-border"
                    style={{ accentColor: EMERALD }}
                  />
                  <span>
                    Súhlasím so spracovaním{' '}
                    <a href="/ochrana-osobnich-udaju" className="underline" style={{ color: EMERALD }}>
                      osobných údajov
                    </a>
                  </span>
                </label>
                {errors.gdprAccepted && (
                  <p className="text-xs text-destructive">{errors.gdprAccepted.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || createLead.isPending}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{
                    background: EMERALD,
                    boxShadow: `0 0 0 1px ${EMERALD}, 0 10px 30px -10px ${EMERALD}`,
                  }}
                >
                  {isSubmitting || createLead.isPending ? (
                    '$ sending...'
                  ) : (
                    <>
                      $ send_message
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
