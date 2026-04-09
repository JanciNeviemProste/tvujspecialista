'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { toast } from 'sonner';

import { useCreateLead } from '@/lib/hooks/useCreateLead';
import type { SpecialistDetail } from '@/lib/hooks/useSpecialist';

const contactSchema = z.object({
  name: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(9, 'Neplatné telefónne číslo'),
  message: z.string().min(10, 'Správa musí mať aspoň 10 znakov'),
  gdprAccepted: z.boolean().refine((v) => v, 'Musíte súhlasiť s GDPR'),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface SpecialistaV3Props {
  specialist: SpecialistDetail;
}

// Kompetencie — bez cien (lead-gen model)
const COMPETENCIES = [
  { numeral: 'I.', name: 'Hypotéky a refinancovanie' },
  { numeral: 'II.', name: 'Životné poistenie' },
  { numeral: 'III.', name: 'Investičné portfóliá' },
  { numeral: 'IV.', name: 'Dôchodkové sporenie' },
  { numeral: 'V.', name: 'Finančné plánovanie rodiny' },
];

const SERIF = 'var(--font-display-serif), Georgia, serif';
const SANS = 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif';

export function SpecialistaV3({ specialist }: SpecialistaV3Props) {
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
          toast.success('Žiadosť odoslaná. Ozveme sa do 24 hodín.');
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

  return (
    <div
      data-theme="v3"
      className="min-h-screen bg-[#faf8f3] text-[#0f0f0f]"
      style={{ fontFamily: SANS }}
    >
      {/* 1. Editorial masthead */}
      <header className="border-y-2 border-[#0f0f0f]">
        <div className="container mx-auto grid grid-cols-3 items-center px-6 py-4 text-[10px] uppercase">
          <div style={{ letterSpacing: '0.2em' }}>Vol. I · No. 01 · Profile</div>
          <div
            className="text-center text-lg tracking-[0.12em]"
            style={{ fontFamily: SERIF, letterSpacing: '0.12em' }}
          >
            TVŮJ·SPECIALISTA
          </div>
          <div className="text-right" style={{ letterSpacing: '0.2em' }}>
            Apríl 2026
          </div>
        </div>
      </header>

      {/* 2. Full-bleed portrait hero */}
      <section className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[60vh] lg:h-screen">
          <Image
            src={specialist.photo}
            alt={specialist.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/30 via-transparent to-transparent" />
        </div>

        <div className="flex items-center px-8 py-20 lg:px-16">
          <div className="w-full">
            <div
              className="mb-8 text-[10px] uppercase text-[#c9a96e]"
              style={{ letterSpacing: '0.3em' }}
            >
              — Portrét · {specialist.category}
            </div>
            <h1
              className="text-balance text-[clamp(3rem,7vw,7rem)] leading-[0.9] tracking-[-0.02em]"
              style={{ fontFamily: SERIF, fontWeight: 400 }}
            >
              {firstName}
              <br />
              <em className="italic text-[#c9a96e]">{lastName}</em>
            </h1>
            <p
              className="mt-10 max-w-md text-xl italic leading-relaxed text-[#3a3a3a]"
              style={{ fontFamily: SERIF }}
            >
              {specialist.bio}
            </p>
            <div
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase text-[#5a5a5a]"
              style={{ letterSpacing: '0.2em' }}
            >
              <span>{specialist.location}</span>
              <span className="text-[#c9a96e]">·</span>
              <span>{specialist.yearsExperience} rokov praxe</span>
              <span className="text-[#c9a96e]">·</span>
              <span>{specialist.rating.toFixed(1)} ★ ({specialist.reviewsCount})</span>
            </div>
            <a
              href="#booking"
              className="mt-12 inline-block border border-[#0f0f0f] px-10 py-4 text-[10px] uppercase text-[#0f0f0f] transition-colors hover:bg-[#0f0f0f] hover:text-[#faf8f3]"
              style={{ letterSpacing: '0.25em' }}
            >
              Požiadať o konzultáciu
            </a>
            <div
              className="mt-6 text-[10px] uppercase text-[#5a5a5a]"
              style={{ letterSpacing: '0.2em' }}
            >
              — Typicky odpovedá do ~2 hodín —
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pull-quote bio */}
      <section className="border-y border-[#0f0f0f]/20 bg-[#f3efe4] py-32">
        <div className="container mx-auto max-w-5xl px-8 text-center">
          <p
            className="text-balance text-[clamp(2rem,4.5vw,4rem)] italic leading-[1.15] text-[#0f0f0f]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            <span className="text-[#c9a96e]">&ldquo;</span>
            {specialist.bio}
            <span className="text-[#c9a96e]">&rdquo;</span>
          </p>
          <div
            className="mt-12 text-[10px] uppercase text-[#5a5a5a]"
            style={{ letterSpacing: '0.3em' }}
          >
            — {specialist.name}, {specialist.location}
          </div>
        </div>
      </section>

      {/* 4. Kompetencie — numbered list, no pricing (lead-gen model) */}
      <section className="py-32">
        <div className="container mx-auto max-w-4xl px-8">
          <div
            className="mb-16 text-center text-[10px] uppercase text-[#c9a96e]"
            style={{ letterSpacing: '0.3em' }}
          >
            — Oblasti expertízy —
          </div>
          <h2
            className="mb-20 text-center text-5xl tracking-tight"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            S čím vám <em className="italic text-[#c9a96e]">dokáže pomôcť</em>
          </h2>
          <ul>
            {COMPETENCIES.map((comp) => (
              <li
                key={comp.numeral}
                className="flex items-baseline gap-8 border-t border-[#0f0f0f]/30 py-8"
              >
                <span
                  className="text-[#c9a96e]"
                  style={{ fontFamily: SERIF, fontSize: '1.25rem', minWidth: '2rem' }}
                >
                  {comp.numeral}
                </span>
                <span
                  className="text-2xl"
                  style={{ fontFamily: SERIF, fontWeight: 400 }}
                >
                  {comp.name}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="mx-auto mt-20 max-w-2xl text-center text-lg italic leading-relaxed text-[#5a5a5a]"
            style={{ fontFamily: SERIF }}
          >
            „Konkrétne podmienky a honorár pripravíme na mieru po prijatí vašej žiadosti.
            Žiadosti o konzultáciu sú spracované do 24 hodín."
          </p>
        </div>
      </section>

      {/* 6. Reviews as printed letters */}
      <section className="py-32">
        <div className="container mx-auto max-w-3xl px-8">
          <div
            className="mb-10 text-center text-[10px] uppercase text-[#c9a96e]"
            style={{ letterSpacing: '0.3em' }}
          >
            — Listy od klientov —
          </div>
          <h2
            className="mb-20 text-center text-5xl tracking-tight"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Slová <em className="italic text-[#c9a96e]">vďaky</em>
          </h2>

          {specialist.reviews.map((review, idx) => {
            const text = review.text ?? '';
            const firstChar = text.charAt(0);
            const rest = text.slice(1);
            return (
              <div key={review.id}>
                {idx > 0 && (
                  <div className="my-16 flex items-center justify-center">
                    <div className="h-px w-24 bg-[#0f0f0f]/30" />
                    <div className="mx-4 text-[#c9a96e]">§</div>
                    <div className="h-px w-24 bg-[#0f0f0f]/30" />
                  </div>
                )}
                <article>
                  <p
                    className="text-xl leading-[1.7] text-[#0f0f0f]"
                    style={{ fontFamily: SERIF, fontWeight: 400 }}
                  >
                    {idx === 0 && firstChar ? (
                      <>
                        <span
                          className="float-left mr-3 mt-2 text-7xl leading-[0.8] text-[#c9a96e]"
                          style={{ fontFamily: SERIF }}
                        >
                          {firstChar}
                        </span>
                        {rest}
                      </>
                    ) : (
                      text
                    )}
                  </p>
                  <div
                    className="mt-8 text-[10px] uppercase text-[#5a5a5a]"
                    style={{ letterSpacing: '0.25em' }}
                  >
                    —{' '}
                    <em className="italic" style={{ fontFamily: SERIF }}>
                      {review.customerName}
                    </em>
                    , {specialist.location},{' '}
                    {new Date(review.createdAt).toLocaleDateString('sk-SK', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  {review.response?.text && (
                    <div className="mt-6 border-l-2 border-[#c9a96e] pl-6">
                      <div
                        className="mb-2 text-[10px] uppercase text-[#c9a96e]"
                        style={{ letterSpacing: '0.25em' }}
                      >
                        Odpoveď špecialistu
                      </div>
                      <p
                        className="text-base italic leading-relaxed text-[#3a3a3a]"
                        style={{ fontFamily: SERIF }}
                      >
                        {review.response.text}
                      </p>
                    </div>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Credentials index */}
      {(specialist.certifications?.length || specialist.education) && (
        <section className="border-y border-[#0f0f0f]/20 bg-[#f3efe4] py-32">
          <div className="container mx-auto max-w-3xl px-8">
            <div
              className="mb-10 text-center text-[10px] uppercase text-[#c9a96e]"
              style={{ letterSpacing: '0.3em' }}
            >
              — Index kvalifikácií —
            </div>
            <h2
              className="mb-20 text-center text-5xl tracking-tight"
              style={{ fontFamily: SERIF, fontWeight: 400 }}
            >
              Vzdelanie a <em className="italic text-[#c9a96e]">tituly</em>
            </h2>
            <ul>
              {specialist.education && (
                <li className="flex items-baseline gap-8 border-t border-[#0f0f0f]/30 py-6">
                  <span
                    className="w-16 shrink-0 text-[11px] uppercase text-[#c9a96e]"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    N° 01
                  </span>
                  <span className="text-xl" style={{ fontFamily: SERIF }}>
                    {specialist.education}
                  </span>
                </li>
              )}
              {specialist.certifications?.map((cert, i) => (
                <li
                  key={cert}
                  className="flex items-baseline gap-8 border-t border-[#0f0f0f]/30 py-6"
                >
                  <span
                    className="w-16 shrink-0 text-[11px] uppercase text-[#c9a96e]"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    N° {String(i + (specialist.education ? 2 : 1)).padStart(2, '0')}
                  </span>
                  <span className="text-xl" style={{ fontFamily: SERIF }}>
                    {cert}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 8. Booking form */}
      <section id="booking" className="py-32">
        <div className="container mx-auto max-w-2xl px-8">
          <div
            className="mb-10 text-center text-[10px] uppercase text-[#c9a96e]"
            style={{ letterSpacing: '0.3em' }}
          >
            — Formulár —
          </div>
          <h2
            className="mb-6 text-center text-5xl tracking-tight"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Žiadosť o <em className="italic text-[#c9a96e]">konzultáciu</em>
          </h2>
          <p
            className="mb-16 text-center text-lg italic text-[#5a5a5a]"
            style={{ fontFamily: SERIF }}
          >
            {specialist.name} sa vám ozve do 24 hodín.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <input
              type="text"
              {...register('website')}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label
                className="mb-3 block text-[10px] uppercase text-[#5a5a5a]"
                style={{ letterSpacing: '0.25em' }}
              >
                Meno a priezvisko
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full border-0 border-b border-[#0f0f0f]/40 bg-transparent px-0 py-3 text-lg text-[#0f0f0f] outline-none focus:border-[#c9a96e]"
                style={{ fontFamily: SERIF }}
                placeholder="Ján Novák"
              />
              {errors.name && (
                <p className="mt-2 text-[10px] uppercase text-red-700" style={{ letterSpacing: '0.2em' }}>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-3 block text-[10px] uppercase text-[#5a5a5a]"
                style={{ letterSpacing: '0.25em' }}
              >
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full border-0 border-b border-[#0f0f0f]/40 bg-transparent px-0 py-3 text-lg text-[#0f0f0f] outline-none focus:border-[#c9a96e]"
                style={{ fontFamily: SERIF }}
                placeholder="vas@email.sk"
              />
              {errors.email && (
                <p className="mt-2 text-[10px] uppercase text-red-700" style={{ letterSpacing: '0.2em' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-3 block text-[10px] uppercase text-[#5a5a5a]"
                style={{ letterSpacing: '0.25em' }}
              >
                Telefón
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full border-0 border-b border-[#0f0f0f]/40 bg-transparent px-0 py-3 text-lg text-[#0f0f0f] outline-none focus:border-[#c9a96e]"
                style={{ fontFamily: SERIF }}
                placeholder="+421 900 123 456"
              />
              {errors.phone && (
                <p className="mt-2 text-[10px] uppercase text-red-700" style={{ letterSpacing: '0.2em' }}>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-3 block text-[10px] uppercase text-[#5a5a5a]"
                style={{ letterSpacing: '0.25em' }}
              >
                Správa
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full resize-none border-0 border-b border-[#0f0f0f]/40 bg-transparent px-0 py-3 text-lg text-[#0f0f0f] outline-none focus:border-[#c9a96e]"
                style={{ fontFamily: SERIF }}
                placeholder="Napíšte stručne o vašej situácii."
              />
              {errors.message && (
                <p className="mt-2 text-[10px] uppercase text-red-700" style={{ letterSpacing: '0.2em' }}>
                  {errors.message.message}
                </p>
              )}
            </div>

            <label className="flex items-start gap-3 pt-2 text-[11px] text-[#5a5a5a]">
              <input
                type="checkbox"
                {...register('gdprAccepted')}
                className="mt-1 h-3 w-3 shrink-0 border-[#0f0f0f]/40"
              />
              <span>
                Súhlasím so spracovaním osobných údajov podľa{' '}
                <a href="/ochrana-osobnich-udaju" className="text-[#c9a96e] underline">
                  GDPR
                </a>
              </span>
            </label>
            {errors.gdprAccepted && (
              <p className="text-[10px] uppercase text-red-700" style={{ letterSpacing: '0.2em' }}>
                {errors.gdprAccepted.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || createLead.isPending}
              className="w-full border border-[#0f0f0f] bg-transparent px-10 py-5 text-[11px] uppercase text-[#0f0f0f] transition-colors hover:bg-[#0f0f0f] hover:text-[#faf8f3] disabled:opacity-50"
              style={{ letterSpacing: '0.3em' }}
            >
              {isSubmitting || createLead.isPending ? 'Odosielam...' : 'Odoslať žiadosť'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer colophon */}
      <footer className="border-t-2 border-[#0f0f0f] py-8">
        <div
          className="container mx-auto px-8 text-center text-[10px] uppercase text-[#5a5a5a]"
          style={{ letterSpacing: '0.3em' }}
        >
          Tvůj·Specialista — Vol. I · Apríl 2026 · Printed with care
        </div>
      </footer>
    </div>
  );
}
