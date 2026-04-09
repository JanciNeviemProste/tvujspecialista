'use client';

import { memo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, ShieldCheck, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';

import { EditableText } from '@/components/editor/EditableText';
interface SpecialistCardV2Props {
  specialist: {
    slug: string;
    name: string;
    photo: string;
    verified: boolean;
    topSpecialist: boolean;
    category: string | null;
    location: string | null;
    rating: number;
    reviewsCount: number;
    bio: string;
  };
  /** Compact = used inside hero preview / small carousels */
  variant?: 'default' | 'compact' | 'feature';
  /** Enable 3D tilt on hover */
  tilt?: boolean;
}

export const SpecialistCardV2 = memo(function SpecialistCardV2({
  specialist,
  variant = 'default',
  tilt = false,
}: SpecialistCardV2Props) {
  const tCommon = useTranslations('common');
  const tSpec = useTranslations('specialist');
  const ref = useRef<HTMLAnchorElement>(null);

  // 3D tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={`/specialista/${specialist.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        tilt
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1200,
              transformStyle: 'preserve-3d',
            }
          : undefined
      }
      className="group relative block overflow-hidden rounded-3xl bg-card shadow-elevation-3 transition-shadow duration-500 hover:shadow-elevation-5"
    >
      {/* Gradient border via pseudo-element */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-border/60 transition-opacity duration-500 group-hover:opacity-0" />
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-accent/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-px rounded-[calc(1.5rem-1px)] bg-card" />

      {/* Photo */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={specialist.photo}
          alt={specialist.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top gradient overlay for badges legibility */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />

        {/* Bottom gradient for content overlay */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

        {/* Badges — always white bg + dark text regardless of theme (overlay on photo) */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {specialist.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-neutral-900 backdrop-blur-md">
              <ShieldCheck className="h-3 w-3 text-indigo-600" strokeWidth={3} />
              <EditableText tKey="common.status.verified">{tCommon('status.verified')}</EditableText>
            </span>
          )}
          {specialist.topSpecialist && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-premium">
              <Sparkles className="h-3 w-3" strokeWidth={3} />
              <EditableText tKey="common.status.top">{tCommon('status.top')}</EditableText>
            </span>
          )}
        </div>

        {/* Rating chip top right — always white bg + dark text (overlay on photo) */}
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-neutral-900 backdrop-blur-md">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          {specialist.rating.toFixed(1)}
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-500">{specialist.reviewsCount}</span>
        </div>

        {/* Bottom content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="mb-1 text-xl font-bold leading-tight text-white">
            {specialist.name}
          </h3>
          <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-white/80">
            {specialist.category && <span>{specialist.category}</span>}
            {specialist.location && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {specialist.location}
                </span>
              </>
            )}
          </div>

          {variant !== 'compact' && (
            <div className="flex items-center justify-between gap-3">
              <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-white/75">
                {specialist.bio}
              </p>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
});
