'use client';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroV3() {
  return (
    <section
      data-theme="v3"
      className="relative min-h-screen overflow-hidden bg-background"
      style={{ fontFamily: 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      {/* Split-screen layout (nav handled by HeaderV3 above) */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
        {/* LEFT — Editorial headline */}
        <div className="relative flex items-center lg:col-span-7 lg:pr-16">
          <div className="w-full px-8 pb-16 pt-32 lg:px-16 lg:py-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
              className="mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              Vol. 01 · Marketplace · Apríl 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: EASE }}
              className="text-display-serif text-balance text-[clamp(3rem,7vw,7.5rem)] leading-[0.92] tracking-[-0.02em] text-foreground"
              style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
            >
              Dôvera
              <br />
              <em className="italic text-accent">nad slovami.</em>
              <br />
              Výsledky,
              <br />
              <em className="italic">ktoré cítiť.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
              className="mt-10 max-w-md text-base leading-relaxed text-muted-foreground"
            >
              Vybraný kruh 2 500 špecialistov, ktorým záleží. Žiadne hlučné reklamy,
              žiadne skryté poplatky. Iba odborníci, ktorí vás spoznajú po mene.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
              className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center"
            >
              <Link
                href="/hledat"
                className="group inline-flex items-center gap-4 bg-foreground px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-all hover:bg-accent hover:text-accent-foreground"
                style={{ letterSpacing: '0.14em' }}
              >
                Nájsť špecialistu
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                <span className="text-accent">—</span> Bezplatné pre klientov
              </div>
            </motion.div>

            {/* Bottom meta row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
              className="mt-24 flex items-end justify-between border-t border-border pt-6"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                <div className="mb-1 text-foreground">2 500+</div>
                <div>Specialisté</div>
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                <div className="mb-1 text-foreground">4.9 ★</div>
                <div>Hodnotenie</div>
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                <div className="mb-1 text-foreground">15K+</div>
                <div>Recenzií</div>
              </div>
              <div className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:block">
                <div className="mb-1 text-foreground">98%</div>
                <div>Spokojnosť</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT — Full-bleed portrait photo */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1.4, ease: EASE }}
          className="relative lg:col-span-5"
        >
          <div className="sticky top-0 h-[60vh] lg:h-screen">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=90"
              alt="Specialista"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
              priority
            />
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

            {/* Floating editorial tag */}
            <div className="absolute bottom-12 left-8 right-8">
              <div className="inline-block bg-background/95 px-6 py-4 backdrop-blur">
                <div
                  className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                  style={{ letterSpacing: '0.3em' }}
                >
                  Profil špecialistu
                </div>
                <div
                  className="mt-2 text-2xl text-foreground"
                  style={{ fontFamily: 'var(--font-display-serif), Georgia, serif' }}
                >
                  Eva Nováková
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Finanční poradkyňa · Praha · 12 rokov praxe
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
