'use client';

import { useTranslations } from 'next-intl';
import { EditableText } from '@/components/editor/EditableText';

const PARTNERS = [
  'OVB',
  'Partner Group',
  '4fin',
  'Broker Consulting',
  'Fincentrum',
  'M&M Reality',
  'Re/Max',
  'Sreality',
];

export function LogoMarquee() {
  const t = useTranslations('home.v2.trust');

  return (
    <section className="relative border-y border-border/40 bg-background/50 py-12 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <EditableText tKey="home.v2.trust.label">{t('label')}</EditableText>
        </p>

        <div className="marquee-mask relative overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-16">
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={`${partner}-${i}`}
                className="flex h-10 items-center"
              >
                <span className="text-2xl font-bold tracking-tight text-foreground/30 grayscale transition-all duration-300 hover:text-foreground/70 hover:grayscale-0">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
