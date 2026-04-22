import Link from 'next/link';
import { Navigation } from '@/components/navigation';

export const metadata = {
  title: 'Features - SpatiumAI',
  description: 'Explore the powerful features of SpatiumAI that transform architectural validation.',
};

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-time Validation',
    description: 'Instant feedback on your architectural designs as you iterate — no waiting, no batch jobs.',
    tag: 'CORE',
  },
  {
    icon: '✓',
    title: '8-Domain Compliance',
    description: 'NBC codes, Vastu, ergonomics, circulation, structure, daylighting, fire egress, and typology — all at once.',
    tag: 'CORE',
  },
  {
    icon: '🔧',
    title: 'Auto-Fix Solutions',
    description: '2–3 specific, architecturally-valid resolutions for every issue. Apply with one click.',
    tag: 'AI',
  },
  {
    icon: '📊',
    title: 'Submission-Ready Reports',
    description: 'Compliance reports with visual analysis, clause references, and authority-ready formatting.',
    tag: 'EXPORT',
  },
  {
    icon: '🌐',
    title: 'Multi-format Support',
    description: 'Upload DWG, DXF, IFC, PDF, or even photos. Parsed and spatially analyzed in seconds.',
    tag: 'UPLOAD',
  },
  {
    icon: '🔐',
    title: 'Enterprise Security',
    description: 'Encrypted data handling, SOC 2 compliance in progress, and role-based access control.',
    tag: 'SECURITY',
  },
  {
    icon: '🔌',
    title: 'API Access',
    description: 'Integrate SpatiumAI directly into AutoCAD, Revit, or your own design pipeline via REST API.',
    tag: 'API',
  },
  {
    icon: '🏗',
    title: 'Indian Typology Engine',
    description: 'Pre-trained on 1BHK to villa patterns across Indian cities with regional rule variants.',
    tag: 'INDIA',
  },
  {
    icon: '📈',
    title: 'Analytics Dashboard',
    description: 'Track validation history, spot recurring issues across projects, and improve design quality over time.',
    tag: 'INSIGHTS',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-14 px-5 text-center hero-grid-bg">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span className="font-mono text-xs text-[var(--accent-primary)]">Everything you need</span>
            </div>
            <h1 className="mb-3 text-4xl font-bold text-[var(--text-primary)] font-space-grotesk md:text-5xl">
              Built for architecture professionals
            </h1>
            <p className="text-base text-[var(--text-secondary)] md:text-lg">
              Every feature designed to eliminate compliance delays and ship better designs, faster.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-5 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:border-[var(--bg-border-hover)] hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)' }} />
                  <div className="mb-3 text-2xl">{feature.icon}</div>
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-space-grotesk text-sm font-bold text-[var(--text-primary)]">{feature.title}</h3>
                    <span className="rounded border border-[var(--bg-border)] px-1.5 py-0.5 font-mono text-[8px] text-[var(--text-tertiary)]">{feature.tag}</span>
                  </div>
                  <p className="font-space-grotesk text-xs text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compare CTA strip */}
        <section className="px-5 py-14 md:py-20 bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-bold text-[var(--text-primary)] font-space-grotesk md:text-3xl">
              Ready to transform your workflow?
            </h2>
            <p className="mb-7 text-sm text-[var(--text-secondary)]">
              Start with 10 free designs. No credit card required.
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
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
