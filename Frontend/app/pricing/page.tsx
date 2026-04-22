import Link from 'next/link';
import { Navigation } from '@/components/navigation';

export const metadata = {
  title: 'Pricing - SpatiumAI',
  description: 'Transparent pricing plans for architectural design validation.',
};

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: null,
    description: 'Perfect for exploring SpatiumAI',
    features: [
      '10 designs per month',
      'Single user',
      'Basic validation (4 domains)',
      'PDF reports',
      'Community support',
    ],
    cta: 'Start Free',
    ctaHref: '/signup',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '₹2,999',
    period: '/month',
    description: 'For small to mid-size firms',
    features: [
      'Unlimited designs',
      'Up to 5 users',
      'Full 8-domain validation',
      'Advanced reports & exports',
      'API access',
      'Custom compliance rules',
      'Priority email support',
    ],
    cta: 'Schedule Demo',
    ctaHref: '/contact-sales',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: null,
    description: 'For large firms & teams',
    features: [
      'Everything in Professional',
      'Unlimited users',
      'Dedicated support manager',
      'Custom integrations',
      'On-premise deployment',
      'SLA guarantee',
      'Advanced analytics dashboard',
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact-sales',
    highlighted: false,
  },
];

const FAQS = [
  { q: 'Can I change plans anytime?', a: 'Yes — upgrade or downgrade at any time. Changes take effect on your next billing cycle.' },
  { q: 'Do you offer annual discounts?', a: 'Annual plans save 20%. Contact our sales team for enterprise discounts.' },
  { q: 'Is there a free trial?', a: 'Yes — start with our free Starter plan with 10 monthly validations. No credit card required.' },
  { q: 'What payment methods do you accept?', a: 'Credit cards, bank transfers, and UPI. Enterprise customers can use custom payment terms.' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-14 px-5 text-center hero-grid-bg">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span className="font-mono text-xs text-[var(--accent-primary)]">Simple, transparent pricing</span>
            </div>
            <h1 className="mb-3 text-4xl font-bold text-[var(--text-primary)] font-space-grotesk md:text-5xl">
              Plans for every firm size
            </h1>
            <p className="text-base text-[var(--text-secondary)] md:text-lg">
              Always know what you&apos;re paying. Cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-5 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-5 md:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-7 transition-all ${
                    plan.highlighted
                      ? 'border-[var(--accent-primary)]/40 bg-[var(--bg-card)] shadow-xl shadow-[var(--accent-primary)]/10'
                      : 'border-[var(--bg-border)] bg-[var(--bg-surface)] hover:border-[var(--bg-border-hover)]'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-primary)] px-4 py-1 font-mono text-[10px] font-bold text-white tracking-wider">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="font-space-grotesk text-lg font-bold text-[var(--text-primary)] mb-1">{plan.name}</h3>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)]">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="font-space-grotesk text-4xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                      {plan.period && (
                        <span className="mb-1.5 font-mono text-sm text-[var(--text-tertiary)]">{plan.period}</span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={plan.ctaHref}
                    className={`mb-7 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-[var(--accent-primary)] text-white hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/30'
                        : 'border border-[var(--bg-border-hover)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/8'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                        <span className="mt-0.5 flex-shrink-0 font-bold text-[var(--accent-secondary)]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-14 md:py-20 bg-[var(--bg-surface)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bg-border)] to-transparent" />
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-10 text-center font-space-grotesk text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="space-y-0 divide-y divide-[var(--bg-border)]">
              {FAQS.map((faq, i) => (
                <div key={i} className="py-5">
                  <h3 className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)] mb-2">{faq.q}</h3>
                  <p className="font-space-grotesk text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-5 py-14 md:py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-3 text-2xl font-bold text-[var(--text-primary)] font-space-grotesk md:text-3xl">
              Ready to get started?
            </h2>
            <p className="mb-7 text-sm text-[var(--text-secondary)]">
              Join 40+ architecture firms already using SpatiumAI.
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
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
