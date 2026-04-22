'use client';

import { MonoTag } from './mono-tag';

const PROBLEMS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="var(--amber-flag)" strokeWidth="1.5" opacity="0.3" />
        <path d="M14 8v7M14 18v1" stroke="var(--amber-flag)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    tag: 'TIME LOSS',
    tagVariant: 'warning' as const,
    title: '3–4 hours per design',
    body: 'Manual code checks, vastu cross-referencing, and ergonomic reviews — all done by hand, for every single design.',
    stat: '~3.5 hrs',
    statLabel: 'avg. manual check',
    accentColor: 'var(--amber-flag)',
    dimColor: 'var(--amber-flag-dim)',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="var(--red-flag)" strokeWidth="1.5" opacity="0.3" />
        <path d="M9 9l10 10M19 9L9 19" stroke="var(--red-flag)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    tag: 'REVENUE RISK',
    tagVariant: 'danger' as const,
    title: '15–35% first-submission rejections',
    body: 'Authority rejections mean resubmissions, delayed projects, and client trust erosion — all from correctable issues.',
    stat: '35%',
    statLabel: 'rejection rate avg.',
    accentColor: 'var(--red-flag)',
    dimColor: 'var(--red-flag-dim)',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="var(--accent-primary)" strokeWidth="1.5" opacity="0.3" />
        <path d="M9 14h10M9 10h6M9 18h8" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    tag: 'VALIDATION GAP',
    tagVariant: 'accent' as const,
    title: 'AI tools generate, not validate',
    body: 'Generative AI creates floor plans without spatial awareness. No built-in code compliance, no Vastu logic, no safety checks.',
    stat: '0',
    statLabel: 'AI tools validate today',
    accentColor: 'var(--accent-primary)',
    dimColor: 'var(--accent-primary-dim)',
  },
];

export function ProblemSection() {
  return (
    <section className="relative bg-[var(--bg-base)] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        {/* Section header */}
        <div className="mb-4 flex justify-center">
          <MonoTag variant="danger">THE PROBLEM</MonoTag>
        </div>
        <h2 className="mb-4 text-center font-space-grotesk text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl">
          Compliance still costs you days.
        </h2>
        <p className="mb-14 text-center font-space-grotesk text-base text-[var(--text-secondary)] mx-auto max-w-xl leading-relaxed md:text-lg">
          Every project carries hidden time taxes and submission risk — before SpatiumAI.
        </p>

        {/* Problem Cards */}
        <div className="mb-14 grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((card, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:border-[rgba(79,142,247,0.25)] hover:shadow-xl hover:shadow-black/20 cursor-default"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Subtle top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor}, transparent)` }}
              />

              <div className="mb-4">{card.icon}</div>
              <MonoTag variant={card.tagVariant}>{card.tag}</MonoTag>
              <h3 className="mt-3 mb-2 font-space-grotesk text-lg font-bold text-[var(--text-primary)]">
                {card.title}
              </h3>
              <p className="mb-5 font-space-grotesk text-sm text-[var(--text-secondary)] leading-relaxed">
                {card.body}
              </p>

              {/* Stat */}
              <div
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{ borderColor: card.accentColor + '30', background: card.dimColor }}
              >
                <span className="font-space-grotesk text-2xl font-bold" style={{ color: card.accentColor }}>
                  {card.stat}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">{card.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Before / After comparison */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Without */}
          <div className="rounded-2xl border border-[var(--red-flag)]/20 bg-[var(--red-flag-dim)] p-7">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--red-flag)]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--red-flag)]">
                Without SpatiumAI
              </span>
            </div>
            <ul className="space-y-3">
              {[
                'Manual code checks: 2–3 hours per design',
                'Vastu reviewed separately — prone to misses',
                'No real-time feedback during design',
                'Costly late-stage revisions',
                'Planning authority rejections: weeks of delay',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-space-grotesk text-sm text-[var(--text-secondary)]">
                  <span className="mt-0.5 font-bold text-[var(--red-flag)] flex-shrink-0">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With */}
          <div className="rounded-2xl border border-[var(--green-pass)]/20 bg-[var(--green-pass-dim)] p-7">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--green-pass)]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--green-pass)]">
                With SpatiumAI
              </span>
            </div>
            <ul className="space-y-3">
              {[
                'Full validation in under 90 seconds',
                'All 8 standards checked simultaneously',
                'Live compliance dashboard while you design',
                'Auto-fix solutions — apply with one click',
                'Submission-ready reports, first time',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-space-grotesk text-sm text-[var(--text-secondary)]">
                  <span className="mt-0.5 font-bold text-[var(--green-pass)] flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
