'use client';

import Link from 'next/link';
import { WaitlistForm } from './WaitlistForm';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface)] px-5 py-20 md:py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bg-border)] to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="animate-breathing"
          style={{
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[860px]">
        {/* Main CTA card */}
        <div className="rounded-2xl border border-[var(--bg-border-hover)] bg-[var(--bg-card)] p-10 text-center md:p-14">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary-dim)] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-secondary)] animate-pulse-glow" />
              <span className="font-mono text-xs text-[var(--accent-primary)]">Free during beta · No credit card</span>
            </div>
          </div>

          <h2 className="mb-4 font-space-grotesk text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl">
            Start validating designs{' '}
            <span className="gradient-text">today.</span>
          </h2>

          <p className="mb-8 font-space-grotesk text-base text-[var(--text-secondary)] mx-auto max-w-lg leading-relaxed md:text-lg">
            Join 40+ architecture firms using SpatiumAI to eliminate compliance delays and ship first-time-pass designs.
          </p>

          {/* Waitlist Form */}
          <div className="flex justify-center mt-2">
            <WaitlistForm />
          </div>

          {/* Social proof metrics */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--bg-border)] pt-8">
            {[
              { stat: '&lt; 90s', label: 'Average validation time' },
              { stat: '100+', label: 'Designs validated monthly' },
              { stat: '40%', label: 'Faster design iterations' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="font-space-grotesk text-2xl font-bold text-[var(--text-primary)] md:text-3xl"
                  dangerouslySetInnerHTML={{ __html: item.stat }}
                />
                <div className="mt-1 font-mono text-[10px] text-[var(--text-tertiary)]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          {[
            { icon: '🔒', text: 'SOC 2 Type II — In Progress' },
            { icon: '🇮🇳', text: 'Built for Indian building codes' },
            { icon: '⚡', text: 'Real-time, no batch processing' },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2">
              <span className="text-sm">{badge.icon}</span>
              <span className="font-mono text-[11px] text-[var(--text-tertiary)]">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
