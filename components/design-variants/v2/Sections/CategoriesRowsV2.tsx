'use client';

import { motion } from 'framer-motion';
import { Briefcase, Home, ArrowRight, Terminal } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CATEGORIES = [
  {
    icon: Briefcase,
    id: '01',
    name: 'financial-advisor',
    title: 'Finančný poradca',
    description:
      'Hypotéky, poistenie, investície. 1 450+ overených špecialistov na úvery, poistné produkty a investičné portfóliá.',
    count: '1,450+',
    tags: ['mortgages', 'insurance', 'investments', 'loans'],
  },
  {
    icon: Home,
    id: '02',
    name: 'real-estate',
    title: 'Realitný maklér',
    description:
      'Predaj, kúpa, prenájom. 1 050+ maklérov s reálnou praxou v lokálnych trhoch CZ a SK.',
    count: '1,050+',
    tags: ['sale', 'purchase', 'rental', 'commercial'],
  },
];

export function CategoriesRowsV2() {
  return (
    <section data-theme="v2" className="relative bg-background py-24" style={{ fontFamily: 'var(--font-v2-sans), ui-sans-serif, system-ui, sans-serif' }}>
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl">
          <div className="mb-3 flex items-center gap-3 text-xs font-mono text-muted-foreground" style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}>
            <Terminal className="h-3 w-3" />
            ~/categories
          </div>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Dve profesie. <span className="text-primary">Nula kompromisov.</span>
          </h2>
        </div>

        <div className="mx-auto max-w-5xl divide-y divide-border overflow-hidden rounded-lg border border-border">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={`/hledat?category=${encodeURIComponent(cat.title)}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="group grid grid-cols-12 items-center gap-6 bg-card p-6 transition-colors hover:bg-secondary sm:p-8"
            >
              {/* ID — mono */}
              <div
                className="col-span-2 text-xs text-muted-foreground sm:col-span-1"
                style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}
              >
                [{cat.id}]
              </div>

              {/* Icon */}
              <div className="col-span-2 sm:col-span-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <cat.icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>

              {/* Title + description */}
              <div className="col-span-8 sm:col-span-6">
                <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {cat.title}
                </h3>
                <p className="mt-1 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                  {cat.description}
                </p>
                {/* Mono tags */}
                <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex" style={{ fontFamily: 'var(--font-v2-mono), ui-monospace, monospace' }}>
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div className="col-span-12 hidden sm:col-span-3 sm:block">
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{cat.count}</div>
                  <div className="text-xs text-muted-foreground">specialists</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="col-span-12 text-right sm:col-span-1">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
