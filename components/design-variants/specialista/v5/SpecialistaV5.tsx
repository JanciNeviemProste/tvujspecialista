'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { toast } from 'sonner';

import { useCreateLead } from '@/lib/hooks/useCreateLead';
import type { SpecialistDetail } from '@/lib/hooks/useSpecialist';

const CREAM = '#faf6ef';
const INK = '#0a0a0a';
const RUST = '#c8410b';

const SERIF = 'var(--font-display-serif), Georgia, serif';
const SANS = 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif';

const contactSchema = z.object({
  name: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(9, 'Neplatné telefónne číslo'),
  message: z.string().min(10, 'Správa musí mať aspoň 10 znakov'),
  gdprAccepted: z.boolean().refine((v) => v, 'Musíte súhlasiť s GDPR'),
  website: z.string().optional(), // honeypot
});

type ContactFormData = z.infer<typeof contactSchema>;

interface SpecialistaV5Props {
  specialist: SpecialistDetail;
}

const SERVICE_MENU = [
  { name: 'Bezplatná konzultácia', duration: '30 min', price: 'Zdarma', featured: true },
  { name: 'Hypotekárne poradenstvo', duration: '60 min', price: '1 500 Kč' },
  { name: 'Komplexné finančné plánovanie', duration: '90 min', price: '2 900 Kč' },
  { name: 'Refinancovanie hypotéky', duration: '60 min', price: '1 900 Kč' },
  { name: 'Investičné portfólio — review', duration: '60 min', price: '2 400 Kč' },
];

export function SpecialistaV5({ specialist }: SpecialistaV5Props) {
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

  const firstName = specialist.name.split(' ')[0];
  const lastName = specialist.name.split(' ').slice(1).join(' ');
  const bio = specialist.bio || '';
  const bioFirst = bio.charAt(0);
  const bioRest = bio.slice(1);
  const bioParagraphs = bioRest.split(/\n\n+/).filter(Boolean);

  return (
    <div
      data-theme="v5"
      className="min-h-screen"
      style={{ fontFamily: SANS, background: CREAM, color: INK }}
    >
      {/* 1. MASTHEAD */}
      <header
        className="border-y-2"
        style={{ borderColor: INK }}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em]">
            Vol. XII · N° 04
          </div>
          <div
            className="flex items-center gap-2 text-xl tracking-[0.15em] sm:text-2xl"
            style={{ fontFamily: SERIF }}
          >
            TVŮJ
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: RUST }} />
            SPECIALISTA
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em]">
            Praha · Apríl 2026
          </div>
        </div>
      </header>

      {/* 2. ARTICLE HEADER */}
      <section className="container mx-auto px-6 pt-16 pb-10 lg:px-12 lg:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div
            className="mb-8 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: RUST }}
          >
            <span className="inline-block h-px w-10" style={{ background: RUST }} />
            Feature · N° 01 · Profile
            <span className="inline-block h-px w-10" style={{ background: RUST }} />
          </div>

          <h1
            className="text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.03em]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            {firstName}{' '}
            <em className="italic" style={{ color: RUST }}>
              {lastName}
            </em>
          </h1>

          <div className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em]">
            By Editorial Desk <span style={{ color: RUST }}>·</span> Apríl 2026
          </div>

          <p
            className="mx-auto mt-10 max-w-3xl text-xl italic leading-[1.6] sm:text-2xl"
            style={{ fontFamily: SERIF }}
          >
            „{specialist.category} s viac než {specialist.yearsExperience} rokmi praxe
            v {specialist.location}. Hodnotenie {specialist.rating.toFixed(1)} z piatich
            — a {specialist.reviewsCount} klientov, ktorí by svedčili znovu."
          </p>
        </div>
      </section>

      {/* 3. TWO-COLUMN ARTICLE + PORTRAIT */}
      <section
        className="border-y"
        style={{ borderColor: INK }}
      >
        <div className="container mx-auto px-6 py-16 lg:px-12 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* LEFT — article body */}
            <article className="lg:col-span-8">
              <div
                className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: RUST }}
              >
                § I · Profil
              </div>
              <p
                className="text-[17px] leading-[1.75]"
                style={{ fontFamily: SERIF }}
              >
                <span
                  className="float-left mr-3 mt-2 text-[6rem] leading-[0.82]"
                  style={{ fontFamily: SERIF, color: RUST, fontWeight: 400 }}
                >
                  {bioFirst || 'O'}
                </span>
                {bioRest || 'sobnostný portrét špecialistu, ktorý si stavia profesijnú dráhu na dôvere, disciplíne a dlhodobých vzťahoch s klientmi.'}
              </p>

              {bioParagraphs.slice(1).map((p, i) => (
                <p
                  key={i}
                  className="mt-6 text-[17px] leading-[1.75]"
                  style={{ fontFamily: SERIF }}
                >
                  {p}
                </p>
              ))}

              <p
                className="mt-6 text-[17px] leading-[1.75]"
                style={{ fontFamily: SERIF }}
              >
                Pôsobí v meste {specialist.location}, venuje sa klientom v oblasti{' '}
                <em className="italic">{specialist.category?.toLowerCase() ?? 'finančného poradenstva'}</em>{' '}
                a za svojou kariérou má {specialist.yearsExperience} rokov neprerušenej
                praxe. Jeho prístup kombinuje analytickú presnosť s osobnou
                prítomnosťou — vlastnosť, ktorá sa v tomto odvetví stáva vzácnou.
              </p>

              <div
                className="mt-10 border-t pt-6 text-[11px] uppercase tracking-[0.2em]"
                style={{ borderColor: INK, color: RUST }}
              >
                Pokračovanie na strane II →
              </div>
            </article>

            {/* RIGHT — portrait */}
            <aside className="lg:col-span-4">
              <div className="border" style={{ borderColor: INK }}>
                <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ background: '#ebe5d6' }}>
                  <Image
                    src={specialist.photo}
                    alt={specialist.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover grayscale"
                    priority
                  />
                </div>
                <div className="border-t p-5" style={{ borderColor: INK }}>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: RUST }}
                  >
                    Portrét
                  </div>
                  <p
                    className="mt-2 text-xs italic leading-relaxed"
                    style={{ fontFamily: SERIF }}
                  >
                    {firstName}, {specialist.location} — Photographed for
                    tvuj specialista, 2026.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4. SERVICES — CLASSIFIED */}
      <section className="container mx-auto px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: RUST }}
          >
            § II · Classifieds
          </div>
          <h2
            className="text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Nabídka <em className="italic" style={{ color: RUST }}>služieb</em>
          </h2>

          <div className="mt-10 border-b-2" style={{ borderColor: INK }}>
            {SERVICE_MENU.map((svc) => (
              <div
                key={svc.name}
                className="flex items-baseline justify-between gap-6 border-t py-5"
                style={{
                  borderColor: INK,
                  background: svc.featured ? 'rgba(200,65,11,0.06)' : 'transparent',
                }}
              >
                <div className="flex-1">
                  <h3
                    className="text-xl sm:text-2xl"
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 400,
                      color: svc.featured ? RUST : INK,
                    }}
                  >
                    {svc.name}
                  </h3>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                    {svc.duration}
                  </div>
                </div>
                <div
                  className="text-xl sm:text-2xl"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 400,
                    color: svc.featured ? RUST : INK,
                  }}
                >
                  {svc.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AVAILABILITY */}
      <section
        className="border-y-2"
        style={{ borderColor: INK, background: 'rgba(10,10,10,0.03)' }}
      >
        <div className="container mx-auto px-6 py-16 text-center lg:px-12">
          <div
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: RUST }}
          >
            § III · Hours
          </div>
          <p
            className="mx-auto max-w-3xl text-3xl leading-[1.3] sm:text-4xl"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Príjmam klientov: <em className="italic">Pondelok–Piatok, 9:00–17:00</em>
          </p>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg italic opacity-70"
            style={{ fontFamily: SERIF }}
          >
            Telefonické konzultácie aj video hovory dostupné.
          </p>
        </div>
      </section>

      {/* 6. REVIEWS — PUBLISHED QUOTES */}
      <section className="container mx-auto px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: RUST }}
          >
            § IV · Letters to the Editor
          </div>
          <h2
            className="text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Co hovoria <em className="italic" style={{ color: RUST }}>klienti</em>
          </h2>

          <div className="mt-12 space-y-10">
            {specialist.reviews.map((review, idx) => {
              const date = new Date(review.createdAt).toLocaleDateString('sk-SK', {
                year: 'numeric',
                month: 'long',
              });
              const text = review.text;
              const first = text.charAt(0);
              const rest = text.slice(1);
              return (
                <div key={review.id}>
                  {idx > 0 && (
                    <hr className="mb-10 border-0 border-t" style={{ borderColor: INK }} />
                  )}
                  <p
                    className="text-[19px] leading-[1.75]"
                    style={{ fontFamily: SERIF }}
                  >
                    {idx === 0 && (
                      <span
                        className="float-left mr-3 mt-2 text-[5.5rem] leading-[0.82]"
                        style={{ fontFamily: SERIF, color: RUST, fontWeight: 400 }}
                      >
                        „
                      </span>
                    )}
                    {idx === 0 ? '' : '„'}{first}{rest}"
                  </p>
                  <p
                    className="mt-4 text-sm italic"
                    style={{ fontFamily: SERIF }}
                  >
                    — {review.customerName}, {specialist.location}, {date}
                  </p>
                  {review.response?.text && (
                    <p
                      className="mt-3 border-l-2 pl-4 text-sm italic opacity-75"
                      style={{ borderColor: RUST, fontFamily: SERIF }}
                    >
                      Odpoveď redakcie: {review.response.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CREDENTIALS — NUMBERED FOOTNOTES */}
      {(specialist.certifications?.length || specialist.education) && (
        <section
          className="border-y-2"
          style={{ borderColor: INK }}
        >
          <div className="container mx-auto px-6 py-20 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <div
                className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: RUST }}
              >
                § V · Footnotes
              </div>
              <h2
                className="text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                Vzdelanie &amp; <em className="italic" style={{ color: RUST }}>certifikáty</em>
              </h2>

              <ol className="mt-12 space-y-8">
                {specialist.education && (
                  <li className="grid grid-cols-[auto_1fr] gap-6 border-t pt-6" style={{ borderColor: INK }}>
                    <div
                      className="text-4xl leading-none"
                      style={{ fontFamily: SERIF, fontWeight: 400, color: RUST }}
                    >
                      N° 01
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
                        Vzdelanie
                      </div>
                      <p
                        className="mt-2 text-lg leading-relaxed"
                        style={{ fontFamily: SERIF }}
                      >
                        {specialist.education}
                      </p>
                    </div>
                  </li>
                )}
                {specialist.certifications?.map((cert, i) => {
                  const n = (specialist.education ? i + 2 : i + 1).toString().padStart(2, '0');
                  return (
                    <li
                      key={cert}
                      className="grid grid-cols-[auto_1fr] gap-6 border-t pt-6"
                      style={{ borderColor: INK }}
                    >
                      <div
                        className="text-4xl leading-none"
                        style={{ fontFamily: SERIF, fontWeight: 400, color: RUST }}
                      >
                        N° {n}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
                          Certifikát
                        </div>
                        <p
                          className="mt-2 text-lg leading-relaxed"
                          style={{ fontFamily: SERIF }}
                        >
                          {cert}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* 8. SCHEDULE AN INTERVIEW FORM */}
      <section id="booking-form" className="container mx-auto px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-2xl">
          <div
            className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: RUST }}
          >
            § VI · Correspondence
          </div>
          <h2
            className="text-center text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Žiadosť o <em className="italic" style={{ color: RUST }}>stretnutie</em>
          </h2>
          <p
            className="mt-6 text-center text-base italic opacity-70"
            style={{ fontFamily: SERIF }}
          >
            Vyplňte žiadosť — {firstName} sa ozve do 24 hodín.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-8">
            <input
              type="text"
              {...register('website')}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em]">
                  Meno
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full border-0 border-b-2 bg-transparent py-2 text-base focus:outline-none"
                  style={{ borderColor: INK, fontFamily: SERIF }}
                  placeholder="Vaše meno"
                />
                {errors.name && (
                  <p className="mt-1 text-xs" style={{ color: RUST }}>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em]">
                  Telefón
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full border-0 border-b-2 bg-transparent py-2 text-base focus:outline-none"
                  style={{ borderColor: INK, fontFamily: SERIF }}
                  placeholder="+421 900 123 456"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs" style={{ color: RUST }}>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em]">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full border-0 border-b-2 bg-transparent py-2 text-base focus:outline-none"
                style={{ borderColor: INK, fontFamily: SERIF }}
                placeholder="vas@email.sk"
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: RUST }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em]">
                Správa
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full resize-none border-0 border-b-2 bg-transparent py-2 text-base focus:outline-none"
                style={{ borderColor: INK, fontFamily: SERIF }}
                placeholder="Stručne o vašej situácii…"
              />
              {errors.message && (
                <p className="mt-1 text-xs" style={{ color: RUST }}>
                  {errors.message.message}
                </p>
              )}
            </div>

            <label className="flex items-start gap-3 pt-2 text-xs opacity-80">
              <input
                type="checkbox"
                {...register('gdprAccepted')}
                className="mt-0.5 h-4 w-4"
                style={{ accentColor: RUST }}
              />
              <span style={{ fontFamily: SERIF }} className="italic">
                Súhlasím so spracovaním{' '}
                <a
                  href="/ochrana-osobnich-udaju"
                  className="underline"
                  style={{ color: RUST }}
                >
                  osobných údajov
                </a>
                .
              </span>
            </label>
            {errors.gdprAccepted && (
              <p className="text-xs" style={{ color: RUST }}>
                {errors.gdprAccepted.message}
              </p>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || createLead.isPending}
                className="w-full border-2 py-5 text-[11px] font-bold uppercase tracking-[0.25em] transition-colors disabled:opacity-50"
                style={{ borderColor: INK, background: 'transparent', color: INK }}
              >
                {isSubmitting || createLead.isPending
                  ? 'Odosielam…'
                  : 'Odoslať žiadosť →'}
              </button>
              <p
                className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] opacity-60"
              >
                Editorial reviewed within 48 hours
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER RULE */}
      <div className="border-t-2" style={{ borderColor: INK }}>
        <div
          className="container mx-auto px-6 py-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] lg:px-12"
        >
          — End of Feature N° 01 —
        </div>
      </div>
    </div>
  );
}
