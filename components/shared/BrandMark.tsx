/**
 * Brand mark — serif letter monogram in a gradient square.
 * Replaces the generic Sparkles icon with a premium editorial letterform.
 * Uses Instrument Serif italic (already loaded via app/layout.tsx).
 *
 * Matches the Mercury/Anthropic premium fintech aesthetic:
 * — gradient block (indigo → amber by default, or variant-scoped via tokens)
 * — single italic serif letterform (premium, editorial, recognizable)
 */

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  /** If true, uses semantic tokens (from-primary to-accent); else hardcoded indigo→amber. */
  useTokens?: boolean;
}

const DIMENSIONS = {
  sm: { box: 'h-8 w-8', radius: 'rounded-xl', letter: 'text-xl' },
  md: { box: 'h-9 w-9', radius: 'rounded-xl', letter: 'text-2xl' },
  lg: { box: 'h-12 w-12', radius: 'rounded-2xl', letter: 'text-[2rem]' },
} as const;

export function BrandMark({ size = 'md', useTokens = false }: BrandMarkProps) {
  const { box, radius, letter } = DIMENSIONS[size];
  const gradient = useTokens
    ? 'bg-gradient-to-br from-primary to-accent shadow-indigo'
    : 'bg-gradient-to-br from-indigo-600 to-amber-500 shadow-[0_4px_14px_0_rgba(79,70,229,0.35)]';

  return (
    <div className={`flex ${box} items-center justify-center ${radius} ${gradient}`}>
      <span
        className={`${letter} italic text-white`}
        style={{
          fontFamily: 'var(--font-serif), Georgia, serif',
          fontWeight: 400,
          lineHeight: '1',
          marginTop: size === 'lg' ? '-4px' : '-2px',
          marginLeft: '1px',
        }}
      >
        t
      </span>
    </div>
  );
}
