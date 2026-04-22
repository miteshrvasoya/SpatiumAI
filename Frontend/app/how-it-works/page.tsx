import Link from 'next/link';
import { Navigation } from '@/components/navigation';

export const metadata = {
  title: 'How It Works - SpatiumAI',
  description: 'Learn how SpatiumAI validates architectural designs in 3 simple steps.',
};

const STEPS = [
  {
    n: '01',
    icon: '📤',
    title: 'Upload Your Design',
    description: 'Submit your architectural plans in any format — DWG, IFC, PDF, or even photos of hand-drawn sketches.',
    details: [
      { label: 'Formats', value: 'DWG, DXF, IFC, PDF, IMG' },
      { label: 'Parse time', value: '< 15 seconds' },
      { label: 'Processing', value: 'Cloud-based, secure' },
      { label: 'Data', value: 'Encrypted at rest' },
    ],
    color: 'var(--accent-primary)',
    dim: 'var(--accent-primary-dim)',
  },
  {
    n: '02',
    icon: '⚡',
    title: '8-Domain Validation',
    description: 'SpatiumAI evaluates your design across NBC codes, Vastu, ergonomics, circulation, structure, daylighting, fire egress, and typology — simultaneously, in real time.',
    details: [
      { label: 'Domains', value: '8 in parallel' },
      { label: 'Checks', value: '100+ rules applied' },
      { label: 'Time', value: 'Under 90 seconds' },
      { label: 'Standards', value: 'NBC 2016, IS codes' },
    ],
    color: 'var(--accent-secondary)',
    dim: 'var(--accent-secondary-dim)',
  },
  {
    n: '03',
    icon: '✅',
    title: 'Get Actionable Solutions',
    description: 'Receive 2–3 specific, architecturally-valid resolutions for every issue. Apply solutions instantly, re-validate, and export submission-ready reports.',
    details: [
      { label: 'Solutions', value: '2–3 per issue' },
      { label: 'Apply', value: 'One click' },
      { label: 'Re-validate', value: 'Instant' },
      { label: 'Export', value: 'PDF, DWG, IFC' },
    ],
    color: '#A78BFA',
    dim: 'rgba(167,139,250,0.12)',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-14 px-5 text-center hero-grid-bg">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span className="font-mono text-xs text-[var(--accent-primary)]">3 steps · Under 2 minutes</span>
            </div>
            <h1 className="mb-3 text-4xl font-bold text-[var(--text-primary)] font-space-grotesk md:text-5xl">
              How SpatiumAI works
            </h1>
            <p className="text-base text-[var(--text-secondary)] md:text-lg">
              Upload, validate, iterate. From design file to compliance report in under 2 minutes.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="px-5 py-14 md:py-20">
          <div className="mx-auto max-w-4xl space-y-6">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="group rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-7 transition-all hover:border-[var(--bg-border-hover)]"
              >
                <div className="flex gap-5 md:gap-8">
                  {/* Step number */}
                  <div className="flex-shrink-0">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                      style={{ background: step.dim, border: `1px solid ${step.color}30` }}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <span className="font-mono text-xs font-bold" style={{ color: step.color }}>{step.n}</span>
                      <h3 className="font-space-grotesk text-xl font-bold text-[var(--text-primary)]">{step.title}</h3>
                    </div>
                    <p className="mb-5 font-space-grotesk text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                      {step.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {step.details.map((d) => (
                        <div
                          key={d.label}
                          className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-3 py-2.5"
                          style={{ borderColor: `${step.color}20` }}
                        >
                          <div className="font-mono text-[9px] text-[var(--text-tertiary)] uppercase tracking-wide mb-1">{d.label}</div>
                          <div className="font-space-grotesk text-xs font-semibold" style={{ color: step.color }}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className="mt-6 ml-7 flex items-center gap-2">
                    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }} />
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)]">then</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-14 md:py-20 bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-3 text-2xl font-bold text-[var(--text-primary)] font-space-grotesk md:text-3xl">
              See it in action
            </h2>
            <p className="mb-7 text-sm text-[var(--text-secondary)]">
              Try the interactive demo on our homepage or start a free trial now.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/30"
              >
                Start Free Trial →
              </Link>
              <Link
                href="/contact-sales"
                className="flex items-center justify-center rounded-xl border border-[var(--bg-border-hover)] px-7 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/8 transition-all"
              >
                Request Live Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
