'use client';

interface ConstraintBadgeProps {
  variant: 'pass' | 'critical' | 'major' | 'advisory';
  text: string;
}

const CONFIG = {
  pass:     { color: 'var(--green-pass)', bg: 'var(--green-pass-dim)', border: 'rgba(52,211,153,0.25)', dot: '#34D399' },
  critical: { color: 'var(--red-flag)',   bg: 'var(--red-flag-dim)',   border: 'rgba(248,113,113,0.25)', dot: '#F87171' },
  major:    { color: 'var(--amber-flag)', bg: 'var(--amber-flag-dim)', border: 'rgba(251,191,36,0.25)', dot: '#FBBF24' },
  advisory: { color: 'var(--accent-primary)', bg: 'var(--accent-primary-dim)', border: 'rgba(79,142,247,0.25)', dot: 'var(--accent-primary)' },
};

export function ConstraintBadge({ variant, text }: ConstraintBadgeProps) {
  const cfg = CONFIG[variant];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
      {text}
    </span>
  );
}
