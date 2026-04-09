'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CATEGORIES = [
  {
    num: 'I',
    title: 'Finančný poradca',
    subtitle: 'Section 01',
    lede: 'Hypotéky, poistenie, investície. Odborníci, ktorí rozumejú dlhodobým plánom mladých rodín aj zrelých klientov.',
    body: 'V kolekcii tvůj specialista nájdete 1 450+ overených finančných poradcov. Každý prechádza manuálnou verifikáciou — kontrolujeme identitu, certifikáty a profesijnú históriu.',
    count: '1 450',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90',
    href: '/hledat?category=Finan%C4%8Dn%C3%AD%20poradce',
  },
  {
    num: 'II',
    title: 'Realitný maklér',
    subtitle: 'Section 02',
    lede: 'Predaj, kúpa, prenájom a komerčné nehnuteľnosti. Profesionáli s lokálnym know-how a reálnymi výsledkami.',
    body: 'V kolekcii nájdete 1 050+ maklérov, ktorí skutočne poznajú lokálne trhy v ČR a SR. Žiadne hromadné kancelárie. Žiadne anonymné call-centrá.',
    count: '1 050',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=90',
    href: '/hledat?category=Realitn%C3%AD%20makl%C3%A9%C5%99',
  },
];

export function CategoriesV5() {
  return (
    <section
      data-theme="v5"
      className="border-t border-foreground/20 bg-background py-20 sm:py-28"
      style={{ fontFamily: 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section divider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="h-px w-16 bg-foreground" />
          Kolekcia — Dve profesie
          <span className="h-px flex-1 bg-foreground" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mb-20 max-w-4xl text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em] text-foreground"
          style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
        >
          Dve cesty.{' '}
          <em className="italic text-accent">Jedna kurátorská platforma.</em>
        </motion.h2>

        <div className="space-y-20">
          {CATEGORIES.map((cat, i) => (
            <motion.article
              key={cat.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
            >
              {/* Image (alternating sides) */}
              <div className={`${i % 2 === 0 ? 'lg:col-span-5' : 'lg:col-span-5 lg:order-2'}`}>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover grayscale"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={`${i % 2 === 0 ? 'lg:col-span-7' : 'lg:col-span-7 lg:order-1'}`}>
                {/* Section marker */}
                <div className="mb-6 flex items-baseline gap-4">
                  <span
                    className="text-6xl leading-none tracking-tight text-accent sm:text-7xl"
                    style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                  >
                    {cat.num}.
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.25em] text-muted-foreground"
                    style={{ letterSpacing: '0.25em' }}
                  >
                    {cat.subtitle}
                  </span>
                </div>

                <h3
                  className="text-4xl leading-tight tracking-tight text-foreground sm:text-5xl"
                  style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                >
                  {cat.title}
                </h3>

                <p className="mt-6 text-lg italic leading-relaxed text-muted-foreground">
                  {cat.lede}
                </p>

                <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-foreground">{cat.body}</p>

                <div className="mt-10 flex items-end justify-between border-t border-foreground/20 pt-6">
                  <div>
                    <div
                      className="text-4xl leading-none text-foreground"
                      style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                    >
                      {cat.count}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Špecialistov
                    </div>
                  </div>
                  <a
                    href={cat.href}
                    className="group inline-flex items-center gap-2 border-b-2 border-foreground pb-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    Prehliadnuť kolekciu
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
