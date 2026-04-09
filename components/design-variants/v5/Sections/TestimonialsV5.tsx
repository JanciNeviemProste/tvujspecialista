'use client';

import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ARTICLES = [
  {
    byline: 'Martina Kováčová',
    location: 'Bratislava',
    date: 'Marec 2026',
    headline: '„Za tri dni som mala tri overené ponuky. Bez nátlaku."',
    body: 'Začala som hľadať hypotéku cez veľké porovnávače a po hodine som mala 15 zmeškaných hovorov od agentov. Na tvůj specialista som vybrala troch poradcov, odpovedali do 24 hodín, dostala som úplné informácie a vybrala som si toho, ktorý mi najviac vysvetlil dôsledky.',
    rating: 5,
  },
  {
    byline: 'Peter Svoboda',
    location: 'Praha',
    date: 'Február 2026',
    headline: '„Transparentné ceny. Konečne niekto nehrá hry."',
    body: 'V profile finančného poradcu som videl presné sadzby pred prvým kontaktom. Žiadne „zavoláme vám". Na prvé stretnutie som prišiel pripravený a za týždeň som mal hypotéku.',
    rating: 5,
  },
];

export function TestimonialsV5() {
  return (
    <section
      data-theme="v5"
      className="border-t border-foreground/20 bg-background py-20 sm:py-28"
      style={{ fontFamily: 'var(--font-v5-sans), ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span className="h-px w-16 bg-foreground" />
          Listy od klientov
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
          15 000+
          <br />
          <em className="italic text-accent">spokojných listov.</em>
        </motion.h2>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {ARTICLES.map((article, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
              className="border-t-2 border-foreground pt-8"
            >
              {/* Byline */}
              <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-foreground">{article.byline}</span>
                <span>·</span>
                <span>{article.location}</span>
                <span>·</span>
                <span>{article.date}</span>
              </div>

              {/* Headline */}
              <h3
                className="text-3xl leading-tight tracking-tight text-foreground sm:text-4xl"
                style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
              >
                {article.headline}
              </h3>

              {/* Body with dropcap */}
              <p className="mt-6 text-[15px] leading-[1.75] text-foreground">
                <span
                  className="float-left mr-2 mt-1 text-[4rem] leading-[0.85] text-accent"
                  style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
                >
                  {article.body.charAt(0)}
                </span>
                {article.body.slice(1)}
              </p>

              {/* Rating */}
              <div
                className="mt-6 text-xl leading-none text-accent"
                style={{ fontFamily: 'var(--font-display-serif), Georgia, serif', fontWeight: 400 }}
              >
                {'★'.repeat(article.rating)}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
