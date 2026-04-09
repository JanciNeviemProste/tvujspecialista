'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Star, Zap, Shield, Clock, Award, CheckCircle2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

import { useCreateLead } from '@/lib/hooks/useCreateLead';
import type { SpecialistDetail } from '@/lib/hooks/useSpecialist';

const V4_SANS = 'var(--font-v4-sans), ui-sans-serif, system-ui, sans-serif';
const V4_MONO = 'var(--font-v4-mono), ui-monospace, monospace';
const SHADOW_CHUNKY = 'shadow-[6px_6px_0_hsl(var(--foreground))]';
const SHADOW_CHUNKY_LG = 'shadow-[8px_8px_0_hsl(var(--foreground))]';

const contactSchema = z.object({
  name: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(9, 'Neplatné telefónne číslo'),
  message: z.string().min(10, 'Správa musí mať aspoň 10 znakov'),
  gdprAccepted: z.boolean().refine((v) => v, 'Musíte súhlasiť s GDPR'),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface SpecialistaV4Props {
  specialist: SpecialistDetail;
}

// Expertise blocks — no pricing (lead-gen model)
const EXPERTISE_BLOCKS = [
  'HYPOTÉKY',
  'POISTENIE',
  'INVESTÍCIE',
  'REFINANC',
  'PENZIJNÉ',
  'PLÁNOVANIE',
];

export function SpecialistaV4({ specialist }: SpecialistaV4Props) {
  const createLead = useCreateLead();

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

  const scrollToForm = () => {
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div data-theme="v4" className="min-h-screen bg-background text-foreground" style={{ fontFamily: V4_SANS }}>
      {/* 1. TOP DIAGONAL MARQUEE */}
      <div className="relative overflow-hidden pt-8">
        <div className="pointer-events-none -rotate-2 overflow-hidden whitespace-nowrap">
          <div className="bg-accent py-4 border-y-4 border-foreground">
            <div
              className="flex items-center gap-12 px-6 text-sm font-black uppercase tracking-widest text-accent-foreground animate-marquee-slow"
              style={{ fontFamily: V4_MONO }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                  ★ TOP RATED · ONLINE NOW · RESPONSE ~2H ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERSIZED HERO */}
      <section className="relative px-6 pt-16 pb-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Status pill */}
          <div
            className={`mb-8 inline-flex items-center gap-3 rounded-full border-4 border-foreground bg-card px-5 py-2 text-xs font-black uppercase tracking-widest ${SHADOW_CHUNKY}`}
            style={{ fontFamily: V4_MONO }}
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
            </span>
            ● ONLINE NOW · ANSWERS IN ~2H
          </div>

          {/* Name h1 */}
          <h1
            className="font-black leading-[0.85] tracking-[-0.05em] text-foreground"
            style={{ fontSize: 'clamp(3rem, 9vw, 9rem)' }}
          >
            {specialist.name.split(' ')[0]}
            <br />
            <span className={`inline-block rounded-3xl border-4 border-foreground bg-primary px-6 py-2 text-primary-foreground ${SHADOW_CHUNKY_LG}`}>
              {specialist.name.split(' ').slice(1).join(' ') || specialist.name}
            </span>
          </h1>

          {/* Rating badge + meta */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div
              className={`inline-flex items-center gap-3 rounded-3xl border-4 border-foreground bg-accent px-6 py-4 text-accent-foreground ${SHADOW_CHUNKY}`}
            >
              <Star className="h-8 w-8 fill-foreground text-foreground" strokeWidth={3} />
              <div className="text-3xl font-black leading-none">
                {specialist.rating.toFixed(1)}★
              </div>
              <div className="h-8 w-1 bg-foreground" />
              <div className="text-sm font-black uppercase tracking-wider" style={{ fontFamily: V4_MONO }}>
                {specialist.reviewsCount} REVIEWS
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-3xl border-4 border-foreground bg-card px-5 py-4 text-sm font-black uppercase tracking-wider ${SHADOW_CHUNKY}`}
              style={{ fontFamily: V4_MONO }}
            >
              {specialist.category} · {specialist.location}
            </div>
          </div>

          {/* Bio */}
          <p className="mt-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            {specialist.bio}
          </p>

          {/* 3. GIANT FORM CTA — lead-gen model, form is the only contact path */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={scrollToForm}
              className={`group inline-flex h-20 items-center gap-4 rounded-full border-4 border-foreground bg-primary px-12 text-2xl font-black uppercase tracking-wider text-primary-foreground ${SHADOW_CHUNKY_LG} transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_hsl(var(--foreground))] lg:h-24 lg:text-3xl lg:px-16`}
              style={{ fontFamily: V4_SANS }}
            >
              → POŽIADAŤ O KONZULTÁCIU
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-primary-foreground bg-accent text-accent-foreground transition-transform group-hover:rotate-[-45deg]">
                <ArrowRight className="h-6 w-6" strokeWidth={4} />
              </div>
            </button>
          </div>

          <div
            className="mt-6 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: V4_MONO }}
          >
            <Zap className="h-4 w-4 text-accent" strokeWidth={3} />
            ONLINE · ODPOVEĎ DO ~2H · PLATFORMA-MEDIATED
          </div>
        </div>
      </section>

      {/* 4. STAT BLOCKS ROW */}
      <section className="px-6 pb-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[
              { value: `${specialist.yearsExperience}`, suffix: '+', label: 'ROKOV PRAXE', icon: Award },
              { value: `${specialist.reviewsCount}`, suffix: '', label: 'RECENZIÍ', icon: Shield },
              { value: specialist.rating.toFixed(1), suffix: '★', label: 'HODNOTENIE', icon: Star },
              { value: '~2', suffix: 'H', label: 'ODPOVEĎ', icon: Zap },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-3xl border-4 border-foreground p-6 ${SHADOW_CHUNKY} ${
                  i % 2 === 0 ? 'bg-card' : 'bg-primary text-primary-foreground'
                }`}
              >
                <stat.icon
                  className={`h-8 w-8 ${i % 2 === 0 ? 'text-primary' : 'text-accent'}`}
                  strokeWidth={3}
                />
                <div className="mt-4 text-5xl font-black leading-none tracking-tight lg:text-6xl">
                  {stat.value}
                  <span className="text-accent">{stat.suffix}</span>
                </div>
                <div
                  className="mt-3 text-xs font-black uppercase tracking-widest"
                  style={{ fontFamily: V4_MONO }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EXPERTISE BLOCKS — no pricing, no calendar (lead-gen model) */}
      <section className="border-y-4 border-foreground bg-secondary/30 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-12 text-5xl font-black uppercase tracking-tight lg:text-7xl"
            style={{ fontFamily: V4_SANS }}
          >
            EXPERTÍZA +<br />
            <span className={`inline-block rounded-3xl border-4 border-foreground bg-accent px-6 py-2 text-accent-foreground ${SHADOW_CHUNKY}`}>
              SKÚSENOSTI
            </span>
          </h2>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {EXPERTISE_BLOCKS.map((area, i) => (
              <div
                key={area}
                className={`flex items-center justify-center rounded-3xl border-4 border-foreground p-8 text-center ${SHADOW_CHUNKY} ${
                  i % 2 === 0 ? 'bg-card' : 'bg-primary text-primary-foreground'
                }`}
              >
                <h3 className="text-2xl font-black uppercase tracking-wider lg:text-3xl">{area}</h3>
              </div>
            ))}
          </div>

          <p
            className="mx-auto mt-16 max-w-2xl text-center text-lg font-black uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: V4_MONO }}
          >
            // KONKRÉTNE PODMIENKY INDIVIDUÁLNE
            <br />
            // PO ODOSLANÍ ŽIADOSTI
          </p>
        </div>
      </section>

      {/* 7. TESTIMONIAL BLOCKS */}
      <section className="border-y-4 border-foreground bg-secondary/30 px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-12 text-5xl font-black uppercase tracking-tight lg:text-7xl"
            style={{ fontFamily: V4_SANS }}
          >
            REÁLNE<br />
            <span className={`inline-block rounded-3xl border-4 border-foreground bg-accent px-6 py-2 text-accent-foreground ${SHADOW_CHUNKY}`}>
              RECENZIE
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {specialist.reviews.slice(0, 3).map((review, i) => (
              <div
                key={review.id}
                className={`relative rounded-3xl border-4 border-foreground p-8 ${SHADOW_CHUNKY} ${
                  i % 2 === 0 ? 'bg-card' : 'bg-primary text-primary-foreground'
                }`}
              >
                <div
                  className={`absolute -top-4 -left-2 text-8xl font-black leading-none ${
                    i % 2 === 0 ? 'text-primary' : 'text-accent'
                  }`}
                  style={{ fontFamily: V4_SANS }}
                >
                  "
                </div>
                <div
                  className="mb-4 text-2xl font-black"
                  style={{ fontFamily: V4_MONO }}
                >
                  {review.rating}.0★
                </div>
                <p className="mb-6 text-base leading-relaxed">{review.text}</p>
                {review.response?.text && (
                  <div className="mb-4 rounded-2xl border-4 border-foreground bg-background p-3 text-xs text-foreground">
                    <div
                      className="mb-1 font-black uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: V4_MONO }}
                    >
                      ODPOVEĎ
                    </div>
                    {review.response.text}
                  </div>
                )}
                <div
                  className="text-xs font-black uppercase tracking-widest opacity-80"
                  style={{ fontFamily: V4_MONO }}
                >
                  —{review.customerName.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CREDENTIALS */}
      {(specialist.certifications?.length || specialist.education) && (
        <section className="px-6 py-20 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <h2
              className="mb-12 text-5xl font-black uppercase tracking-tight lg:text-7xl"
              style={{ fontFamily: V4_SANS }}
            >
              CERTIFIKÁTY +<br />
              <span className={`inline-block rounded-3xl border-4 border-foreground bg-primary px-6 py-2 text-primary-foreground ${SHADOW_CHUNKY}`}>
                VZDELANIE
              </span>
            </h2>

            <div className="flex flex-wrap gap-4">
              {specialist.education && (
                <div
                  className={`inline-flex items-center gap-3 rounded-3xl border-4 border-foreground bg-card px-6 py-4 ${SHADOW_CHUNKY}`}
                >
                  <GraduationCap className="h-6 w-6 text-primary" strokeWidth={3} />
                  <span className="text-base font-black uppercase" style={{ fontFamily: V4_MONO }}>
                    {specialist.education}
                  </span>
                </div>
              )}
              {specialist.certifications?.map((cert) => (
                <div
                  key={cert}
                  className={`inline-flex items-center gap-3 rounded-3xl border-4 border-foreground bg-accent px-6 py-4 text-accent-foreground ${SHADOW_CHUNKY}`}
                >
                  <CheckCircle2 className="h-6 w-6" strokeWidth={3} />
                  <span className="text-base font-black uppercase" style={{ fontFamily: V4_MONO }}>
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. BOOKING FORM */}
      <section
        id="booking-form"
        className="border-t-4 border-foreground bg-primary/5 px-6 py-20 lg:px-12"
      >
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-4 text-5xl font-black uppercase tracking-tight lg:text-7xl"
            style={{ fontFamily: V4_SANS }}
          >
            NAPÍŠ<br />
            <span className={`inline-block rounded-3xl border-4 border-foreground bg-accent px-6 py-2 text-accent-foreground ${SHADOW_CHUNKY}`}>
              SPRÁVU →
            </span>
          </h2>
          <p
            className="mb-10 text-base font-black uppercase tracking-wider text-muted-foreground"
            style={{ fontFamily: V4_MONO }}
          >
            // ODPOVEĎ DO 24H · BEZ ZÁVÄZKOV
          </p>

          <div
            className={`mb-8 inline-flex items-center gap-3 rounded-full border-4 border-foreground bg-accent px-5 py-3 text-sm font-black uppercase tracking-wider text-accent-foreground ${SHADOW_CHUNKY}`}
            style={{ fontFamily: V4_MONO }}
          >
            🛡 ZABEZPEČENÝ KONTAKT CEZ PLATFORMU
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`rounded-3xl border-4 border-foreground bg-card p-8 space-y-6 ${SHADOW_CHUNKY_LG}`}
          >
            <input
              type="text"
              {...register('website')}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-widest"
                  style={{ fontFamily: V4_MONO }}
                >
                  // MENO
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full border-b-4 border-foreground bg-transparent px-2 py-3 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Ján Novák"
                />
                {errors.name && (
                  <p className="mt-2 text-xs font-black text-destructive" style={{ fontFamily: V4_MONO }}>
                    ! {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-widest"
                  style={{ fontFamily: V4_MONO }}
                >
                  // TELEFÓN
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full border-b-4 border-foreground bg-transparent px-2 py-3 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="+421 900 123 456"
                />
                {errors.phone && (
                  <p className="mt-2 text-xs font-black text-destructive" style={{ fontFamily: V4_MONO }}>
                    ! {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-black uppercase tracking-widest"
                style={{ fontFamily: V4_MONO }}
              >
                // EMAIL
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full border-b-4 border-foreground bg-transparent px-2 py-3 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="jan@email.sk"
              />
              {errors.email && (
                <p className="mt-2 text-xs font-black text-destructive" style={{ fontFamily: V4_MONO }}>
                  ! {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-black uppercase tracking-widest"
                style={{ fontFamily: V4_MONO }}
              >
                // SPRÁVA
              </label>
              <textarea
                {...register('message')}
                rows={5}
                className="w-full border-b-4 border-foreground bg-transparent px-2 py-3 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                placeholder="S čím vám môžem pomôcť?"
              />
              {errors.message && (
                <p className="mt-2 text-xs font-black text-destructive" style={{ fontFamily: V4_MONO }}>
                  ! {errors.message.message}
                </p>
              )}
            </div>

            <label
              className="flex items-start gap-3 text-sm font-bold text-foreground"
              style={{ fontFamily: V4_MONO }}
            >
              <input
                type="checkbox"
                {...register('gdprAccepted')}
                className="mt-1 h-5 w-5 rounded border-4 border-foreground accent-accent"
              />
              <span className="uppercase tracking-wider text-xs">
                SÚHLASÍM SO SPRACOVANÍM{' '}
                <a href="/ochrana-osobnich-udaju" className="underline decoration-4">
                  OSOBNÝCH ÚDAJOV
                </a>
              </span>
            </label>
            {errors.gdprAccepted && (
              <p className="text-xs font-black text-destructive" style={{ fontFamily: V4_MONO }}>
                ! {errors.gdprAccepted.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || createLead.isPending}
              className={`group flex w-full items-center justify-center gap-4 rounded-full border-4 border-foreground bg-accent px-8 py-6 text-2xl font-black uppercase tracking-wider text-accent-foreground ${SHADOW_CHUNKY_LG} transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_hsl(var(--foreground))] disabled:opacity-50`}
              style={{ fontFamily: V4_SANS }}
            >
              {isSubmitting || createLead.isPending ? (
                'ODOSIELAM...'
              ) : (
                <>
                  → SEND MESSAGE
                  <ArrowRight className="h-6 w-6" strokeWidth={4} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
