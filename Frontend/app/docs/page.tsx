import Link from 'next/link';
import { Navigation } from '@/components/navigation';

export const metadata = {
  title: 'Documentation - SpatiumAI',
  description: 'Learn how to use SpatiumAI with our comprehensive documentation.',
};

const DOC_SECTIONS = [
  {
    title: 'Getting Started',
    icon: '🚀',
    items: [
      'Introduction to SpatiumAI',
      'Account Setup & Onboarding',
      'Your First Validation',
      'Glossary of Terms',
    ],
  },
  {
    title: 'Core Features',
    icon: '⚙️',
    items: [
      'Design Upload & Parsing',
      'Understanding Validation Results',
      'Constraint Domains Explained',
      'Applying Auto-Solutions',
    ],
  },
  {
    title: 'Advanced',
    icon: '🔌',
    items: [
      'API Reference',
      'Custom Compliance Rules',
      'Integrations (AutoCAD, Revit)',
      'Bulk Validation',
    ],
  },
  {
    title: 'Support',
    icon: '💬',
    items: [
      'Troubleshooting',
      'FAQ',
      'Contact Support',
      'System Status',
    ],
  },
];

const QUICK_LINKS = [
  {
    title: 'API Documentation',
    description: 'Complete API reference for integrating SpatiumAI into your CAD workflow.',
    icon: '⚙️',
    tag: 'REST API',
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides to master all features from upload to export.',
    icon: '🎥',
    tag: 'TUTORIALS',
  },
  {
    title: 'Community Forum',
    description: 'Connect with architects, share designs, and get answers from the community.',
    icon: '💬',
    tag: 'COMMUNITY',
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-10 px-5 hero-grid-bg">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span className="font-mono text-xs text-[var(--accent-primary)]">Documentation</span>
            </div>
            <h1 className="mb-3 text-4xl font-bold text-[var(--text-primary)] font-space-grotesk md:text-5xl">
              Everything you need to master SpatiumAI
            </h1>
            <p className="mb-8 text-base text-[var(--text-secondary)] md:text-lg max-w-xl">
              Guides, API reference, tutorials, and support — all in one place.
            </p>

            {/* Search */}
            <div className="relative max-w-xl">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search documentation…"
                className="w-full rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] pl-11 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Documentation Sections Grid */}
        <section className="px-5 py-14 md:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-5 md:grid-cols-2">
              {DOC_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-6 hover:border-[var(--bg-border-hover)] transition-all"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-xl">{section.icon}</span>
                    <h3 className="font-space-grotesk text-sm font-bold text-[var(--text-primary)]">{section.title}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {section.items.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="flex items-center gap-2 font-space-grotesk text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors group"
                        >
                          <span className="text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors">→</span>
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="px-5 py-14 md:py-16 bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-7 font-space-grotesk text-xl font-bold text-[var(--text-primary)] md:text-2xl">
              Quick Links
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.title}
                  href="#"
                  className="group flex flex-col rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-5 transition-all hover:border-[var(--accent-primary)]/30 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-2xl">{link.icon}</span>
                    <span className="rounded border border-[var(--bg-border)] px-1.5 py-0.5 font-mono text-[8px] text-[var(--text-tertiary)]">{link.tag}</span>
                  </div>
                  <h4 className="mb-1.5 font-space-grotesk text-sm font-semibold text-[var(--text-primary)]">{link.title}</h4>
                  <p className="mb-4 font-space-grotesk text-xs text-[var(--text-secondary)] leading-relaxed flex-1">{link.description}</p>
                  <span className="font-mono text-xs text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform inline-block">
                    Explore →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section className="px-5 py-14 md:py-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-3 text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
              Can&apos;t find what you need?
            </h2>
            <p className="mb-7 text-sm text-[var(--text-secondary)]">
              Our support team responds within 24 hours. Reach out anytime.
            </p>
            <Link
              href="/contact-sales"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/30"
            >
              Contact Support →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
