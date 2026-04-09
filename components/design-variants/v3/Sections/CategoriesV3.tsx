'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CATEGORIES = [
  {
    id: 'I',
    title: 'Finančný poradca',
    subtitle: 'Hypotéky, poistenie, investície',
    description:
      'Vybraný kruh odborníkov, ktorí rozumejú dlhodobým plánom. Nie produktoví predajcovia — poradcovia, ktorí pozerajú 10 rokov dopredu.',
    count: '1 450',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90',
    href: '/hledat?category=Finan%C4%8Dn%C3%AD%20poradce',
  },
  {
    id: 'II',
    title: 'Realitný maklér',
    subtitle: 'Predaj, kúpa, komerčné projekty',
    description:
      'Profesionáli s lokálnym know-how. Žiadne hromadné kancelárie — iba makléri, ktorí vedia, ako sa predáva vaša nehnuteľnosť.',
    count: '1 050',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=90',
    href: '/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99',
  },
];

export function CategoriesV3() {
  return (
    <section
      data-theme="v3"
      className="bg-background py-28 sm:py-40"
      style={{ fontFamily: 'var(--font-v3-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div
            className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            style={{ letterSpacing: '0.3em' }}
          >
            Kolekcia · I & II
          </div>
          <h2
            className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[-0.02em] text-foreground"
            style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
          >
            Dve profesie.
            <br />
            <em className="italic text-accent">Jeden prístup.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:gap-8 lg:grid-cols-2 lg:gap-12">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={cat.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: i * 0.15, ease: EASE }}
              className="group block"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
                {/* Number overlay */}
                <div
                  className="absolute left-8 top-8 text-6xl tracking-tight text-background/90 sm:text-7xl"
                  style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                >
                  {cat.id}
                </div>
              </div>

              {/* Content below */}
              <div className="mt-8 flex items-start justify-between gap-6 border-b border-foreground/20 pb-8">
                <div className="flex-1">
                  <div
                    className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    {cat.subtitle}
                  </div>
                  <h3
                    className="text-3xl text-foreground sm:text-4xl"
                    style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                  >
                    {cat.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div
                    className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    <div
                      className="text-2xl tracking-tight text-foreground sm:text-3xl"
                      style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                    >
                      {cat.count}
                    </div>
                    <div>Špecialistov</div>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 border-b border-foreground text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition-all group-hover:border-accent group-hover:text-accent">
                    Objaviť
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:rotate-45" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
