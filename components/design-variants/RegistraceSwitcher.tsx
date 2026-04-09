'use client';

import { Link, usePathname } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';

const VARIANTS = [
  { id: 'v0', label: 'V0', name: 'Originál', href: '/design/registrace/v0' as const },
  { id: 'v1', label: 'V1', name: 'Trusted Authority', href: '/design/registrace/v1' as const },
  { id: 'v2', label: 'V2', name: 'Modern Tech', href: '/design/registrace/v2' as const },
  { id: 'v3', label: 'V3', name: 'Quiet Luxury', href: '/design/registrace/v3' as const },
  { id: 'v4', label: 'V4', name: 'Bold Fintech', href: '/design/registrace/v4' as const },
  { id: 'v5', label: 'V5', name: 'Print Editorial', href: '/design/registrace/v5' as const },
] as const;

export function RegistraceSwitcher() {
  const pathname = usePathname();
  const currentId = VARIANTS.find((v) => pathname.endsWith(`/${v.id}`))?.id ?? 'v0';
  const current = VARIANTS.find((v) => v.id === currentId)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
      style={{ fontFamily: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-neutral-900/90 p-1.5 shadow-2xl backdrop-blur-xl">
        <Link
          href="/design/registrace"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Späť na prehľad registračných variantov"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mx-1 h-6 w-px bg-white/15" />

        {VARIANTS.map((variant) => {
          const isActive = variant.id === currentId;
          return (
            <Link
              key={variant.id}
              href={variant.href}
              className={`relative flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors ${
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
              title={variant.name}
            >
              {isActive && (
                <motion.div
                  layoutId="registrace-switcher-pill"
                  className="absolute inset-0 rounded-full bg-white/15"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative">{variant.label}</span>
            </Link>
          );
        })}

        <div className="mx-1 h-6 w-px bg-white/15" />

        <div className="hidden items-center gap-2 px-3 text-sm font-medium text-white/80 sm:flex">
          <UserPlus className="h-3.5 w-3.5 text-white/50" />
          Registrácia · {current.name}
        </div>
      </div>
    </motion.div>
  );
}
