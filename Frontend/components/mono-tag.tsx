'use client';

interface MonoTagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'danger' | 'warning';
}

const VARIANTS = {
  default: 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border-[var(--bg-border)]',
  accent: 'bg-[var(--accent-primary-dim)] text-[var(--accent-primary)] border-[var(--accent-primary)]/20',
  success: 'bg-[var(--green-pass-dim)] text-[var(--green-pass)] border-[var(--green-pass)]/20',
  danger: 'bg-[var(--red-flag-dim)] text-[var(--red-flag)] border-[var(--red-flag)]/20',
  warning: 'bg-[var(--amber-flag-dim)] text-[var(--amber-flag)] border-[var(--amber-flag)]/20',
};

export function MonoTag({ children, variant = 'default' }: MonoTagProps) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
