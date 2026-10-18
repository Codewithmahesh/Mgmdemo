import type { FeatureIcon } from '@/lib/content';

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function FeatureIconSvg({ name }: { name: FeatureIcon }) {
  if (name === 'arena') {
    return (
      <svg {...base}>
        <path d="M14 8h20v10a10 10 0 0 1-20 0z" />
        <path d="M14 12H7v3a7 7 0 0 0 7 7M34 12h7v3a7 7 0 0 1-7 7" />
        <path d="M24 28v8M16 41h16M19 36h10" />
      </svg>
    );
  }
  if (name === 'studio') {
    return (
      <svg {...base}>
        <path d="M17 15L7 24l10 9M31 15l10 9-10 9M27 11l-6 26" />
      </svg>
    );
  }
  return (
    <svg {...base}>
      <rect x="14" y="4" width="20" height="40" rx="4" />
      <path d="M21 9h6M22 39h4" />
    </svg>
  );
}

/** The Exponentor mark. */
export function BrandMark({ stroke = 1.8, className }: { stroke?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 13 8 3l6 10" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9h6" stroke="#e8a55a" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}
