import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { ProblemSection } from '@/components/problem-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { ConstraintDomainsSection } from '@/components/constraint-domains-section';
import { CTASection } from '@/components/cta-section';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-[var(--bg-base)] min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <ConstraintDomainsSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--bg-border)] bg-[var(--bg-base)] px-5 py-8">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--accent-primary)]/20">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="var(--accent-primary)" opacity="0.9" />
                <rect x="9" y="1" width="6" height="6" rx="1" fill="var(--accent-primary)" opacity="0.5" />
                <rect x="1" y="9" width="6" height="6" rx="1" fill="var(--accent-primary)" opacity="0.5" />
                <rect x="9" y="9" width="6" height="6" rx="1" fill="var(--accent-secondary)" opacity="0.85" />
              </svg>
            </div>
            <span className="font-space-grotesk text-sm font-bold">
              <span className="text-[var(--text-primary)]">Spatium</span>
              <span className="text-[var(--accent-primary)]">AI</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--text-tertiary)] ml-2">© 2025 SpatiumAI</span>
          </div>
          <div className="flex flex-wrap gap-5">
            {[
              { label: 'Features', href: '/features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Docs', href: '/docs' },
              { label: 'Contact', href: '/contact-sales' },
              { label: 'Privacy', href: '/privacy' },
            ].map(link => (
              <Link key={link.label} href={link.href} className="font-mono text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
