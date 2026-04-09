'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Award,
  GraduationCap,
  MessageSquare,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

import { PremiumHeader } from '@/components/layout/PremiumHeader';
import { useCreateLead } from '@/lib/hooks/useCreateLead';
import type { SpecialistDetail } from '@/lib/hooks/useSpecialist';
import { toast } from 'sonner';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.7, ease: EASE },
  }),
};

const contactSchema = z.object({
  name: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(9, 'Neplatné telefónne číslo'),
  message: z.string().min(10, 'Správa musí mať aspoň 10 znakov'),
  gdprAccepted: z.boolean().refine((v) => v, 'Musíte súhlasiť s GDPR'),
  website: z.string().optional(), // honeypot
});

type ContactFormData = z.infer<typeof contactSchema>;

interface SpecialistaV1Props {
  specialist: SpecialistDetail;
}

// Areas of expertise — no pricing, marketplace tipér model
// Client contacts specialist ONLY via lead form. All communication is
// mediated through the platform (tvujspecialista.cz). Prices are negotiated
// privately after lead acceptance.
const EXPERTISE_AREAS = [
  { name: 'Hypotéky a refinancovanie', icon: 'home', featured: true },
  { name: 'Životné poistenie', icon: 'shield' },
  { name: 'Investičné portfóliá', icon: 'trending' },
  { name: 'Dôchodkové sporenie', icon: 'clock' },
  { name: 'Úverové konzultácie', icon: 'wallet' },
  { name: 'Finančné plánovanie rodiny', icon: 'users' },
];

export function SpecialistaV1({ specialist }: SpecialistaV1Props) {
  const createLead = useCreateLead();
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | '4'>('all');

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
    if (data.website) return; // honeypot
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

  const filteredReviews =
    reviewFilter === 'all'
      ? specialist.reviews
      : specialist.reviews.filter((r) => r.rating === parseInt(reviewFilter));

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* HERO — asymmetric editorial */}
      <section className="relative overflow-hidden pt-8 lg:pt-16">
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="pointer-events-none absolute -left-32 top-32 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-[120px] animate-mesh-drift" />
        <div
          className="pointer-events-none absolute -right-32 top-64 -z-10 h-96 w-96 rounded-full bg-accent/15 blur-[120px] animate-mesh-drift"
          style={{ animationDelay: '7s' }}
        />

        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* LEFT: Editorial profile intro */}
            <div className="lg:col-span-7">
              {/* Badges */}
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-6 flex flex-wrap items-center gap-2"
              >
                {specialist.verified && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-3 w-3" strokeWidth={3} />
                    Overený
                  </div>
                )}
                {specialist.topSpecialist && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <Sparkles className="h-3 w-3" strokeWidth={3} />
                    TOP špecialista
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Online · odpovedá do ~2h
                </div>
              </motion.div>

              {/* Name — editorial display */}
              <motion.h1
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-balance text-display-2 font-bold tracking-tight text-foreground lg:text-display-1"
              >
                {specialist.name.split(' ')[0]}{' '}
                <span className="text-serif-italic font-normal text-primary">
                  {specialist.name.split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>

              {/* Meta row */}
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {specialist.category}
                </div>
                <div>·</div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {specialist.location}
                </div>
                <div>·</div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {specialist.yearsExperience} rokov praxe
                </div>
              </motion.div>

              {/* Rating row */}
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-6 flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i <= Math.round(specialist.rating) ? 'fill-accent text-accent' : 'text-muted'
                        }`}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-foreground">{specialist.rating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-muted-foreground">· {specialist.reviewsCount} recenzií</div>
              </motion.div>

              {/* Bio */}
              <motion.p
                custom={4}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground"
              >
                {specialist.bio}
              </motion.p>

              {/* Trust stack */}
              <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {[
                  { icon: Award, value: `${specialist.yearsExperience}+`, label: 'rokov praxe' },
                  { icon: MessageSquare, value: specialist.reviewsCount, label: 'recenzií' },
                  { icon: Star, value: specialist.rating.toFixed(1), label: 'hodnotenie' },
                  { icon: Clock, value: '~2h', label: 'odpoveď' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card p-4 shadow-elevation-1"
                  >
                    <stat.icon className="mb-2 h-5 w-5 text-primary" strokeWidth={2.5} />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Portrait + sticky booking widget */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: EASE }}
                className="sticky top-24 space-y-6"
              >
                {/* Portrait */}
                <div className="relative overflow-hidden rounded-3xl shadow-elevation-5">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={specialist.photo}
                      alt={specialist.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 440px"
                      className="object-cover object-top"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-neutral-900 backdrop-blur">
                        <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        Dostupný teraz
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response time indicator — passive trust signal, no booking */}
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                  <Clock className="h-4 w-4 text-primary" strokeWidth={2.5} />
                  <span className="font-semibold text-foreground">Typicky odpovedá do ~2h</span>
                </div>

                {/* Primary CTA — form only, no direct contact */}
                <a
                  href="#booking-form"
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-base font-semibold text-background shadow-elevation-4 transition-all hover:-translate-y-0.5 hover:shadow-elevation-5"
                >
                  Požiadať o konzultáciu
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <div className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Zabezpečený kontakt cez platformu
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise areas — no pricing (lead-gen model) */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Oblasti expertízy
            </div>
            <h2 className="text-display-3 font-bold tracking-tight text-foreground">
              S čím vám{' '}
              <span className="text-serif-italic font-normal text-primary">dokáže pomôcť</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {EXPERTISE_AREAS.map((area, i) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                className={`flex items-center gap-4 rounded-3xl border p-5 shadow-elevation-1 transition-all hover:shadow-elevation-3 ${
                  area.featured
                    ? 'border-primary/40 bg-gradient-to-r from-primary/5 to-accent/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-bold text-foreground sm:text-lg">{area.name}</h3>
              </motion.div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            Konkrétne podmienky a cenník sú individuálne — špecialista vám ich pripraví po odoslaní žiadosti
            o konzultáciu nižšie.
          </p>
        </div>
      </section>

      {/* Reviews with filter */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-display-3 font-bold tracking-tight text-foreground">
              Čo hovoria{' '}
              <span className="text-serif-italic font-normal text-primary">overení klienti</span>
            </h2>
            <div className="mt-6 flex justify-center gap-2">
              {(['all', '5', '4'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setReviewFilter(f)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    reviewFilter === f
                      ? 'bg-foreground text-background'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'all' ? 'Všetky' : `${f}★`}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-elevation-1 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-bold text-white">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        {review.customerName}
                        {review.verified && (
                          <ShieldCheck className="h-3 w-3 text-primary" strokeWidth={3} />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('sk-SK', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i <= review.rating ? 'fill-accent text-accent' : 'text-muted'
                        }`}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">„{review.text}"</p>
                {review.response?.text && (
                  <div className="mt-4 rounded-2xl bg-secondary p-4 text-sm">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Odpoveď špecialistu
                    </div>
                    <p className="text-muted-foreground">{review.response?.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      {(specialist.certifications?.length || specialist.education) && (
        <section className="py-20 sm:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="text-display-3 font-bold tracking-tight text-foreground">
                  Vzdelanie a{' '}
                  <span className="text-serif-italic font-normal text-primary">certifikáty</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {specialist.education && (
                  <div className="rounded-3xl border border-border bg-card p-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-indigo">
                      <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Vzdelanie</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {specialist.education}
                    </p>
                  </div>
                )}
                {specialist.certifications && specialist.certifications.length > 0 && (
                  <div className="rounded-3xl border border-border bg-card p-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 shadow-premium">
                      <Award className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Certifikáty</h3>
                    <ul className="mt-3 space-y-2">
                      {specialist.certifications.map((cert) => (
                        <li key={cert} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking form */}
      <section
        id="booking-form"
        className="relative overflow-hidden border-t border-border py-20 sm:py-28"
      >
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <h2 className="text-display-3 font-bold tracking-tight text-foreground">
                Požiadať o{' '}
                <span className="text-serif-italic font-normal text-primary">konzultáciu</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Vyplňte formulár a {specialist.name} sa vám ozve do 24 hodín
              </p>

              {/* Anti-bypass trust indicator */}
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                Zabezpečený kontakt cez tvujspecialista.cz
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-elevation-4"
            >
              {/* Honeypot */}
              <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Meno
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                    placeholder="Vaše meno"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Telefón
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                    placeholder="+421 900 123 456"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="vas@email.sk"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Správa
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="S čím vám môžem pomôcť? Napíšte stručne o vašej situácii."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              <label className="flex items-start gap-2 pt-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  {...register('gdprAccepted')}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                />
                <span>
                  Súhlasím so spracovaním{' '}
                  <a href="/ochrana-osobnich-udaju" className="text-primary underline">
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
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-base font-semibold text-background shadow-elevation-3 transition-all hover:-translate-y-0.5 hover:shadow-elevation-5 disabled:opacity-50"
              >
                {isSubmitting || createLead.isPending ? (
                  'Odosielam...'
                ) : (
                  <>
                    Odoslať žiadosť o konzultáciu
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
