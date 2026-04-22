'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';

export default function ContactSalesPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    projectSize: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  const inputClass = "w-full rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30";
  const labelClass = "mb-1.5 block text-xs font-medium text-[var(--text-secondary)]";

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navigation />
      <main className="px-5 pt-28 pb-16">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <div className="text-center space-y-5 rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--green-pass-dim)] text-3xl">✓</div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                We&apos;ll be in touch soon!
              </h1>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Our sales team will contact{' '}
                <span className="font-semibold text-[var(--accent-primary)]">{formData.email}</span>
                {' '}within 24 hours with a personalized demo.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
                <Link href="/docs" className="flex items-center justify-center rounded-xl border border-[var(--bg-border-hover)] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 transition-all">
                  View Docs
                </Link>
                <Link href="/" className="flex items-center justify-center rounded-xl bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5a98ff] transition-all">
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-pass)]" />
                  <span className="font-mono text-xs text-[var(--accent-primary)]">Response within 4 hours</span>
                </div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] font-space-grotesk mb-2 md:text-4xl">
                  Talk to our sales team
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Get a personalized demo and pricing tailored to your firm.
                </p>
              </div>

              {/* Contact options */}
              <div className="mb-8 grid grid-cols-3 gap-3">
                {[
                  { icon: '💬', title: 'Live Support', sub: 'Mon–Fri, 9–6 IST' },
                  { icon: '📧', title: 'Email', sub: 'Within 24 hours' },
                  { icon: '🎥', title: 'Personal Demo', sub: 'Tailored walkthrough' },
                ].map(({ icon, title, sub }) => (
                  <div key={title} className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 text-center">
                    <div className="mb-2 text-2xl">{icon}</div>
                    <div className="font-space-grotesk text-xs font-semibold text-[var(--text-primary)]">{title}</div>
                    <div className="font-mono text-[10px] text-[var(--text-tertiary)] mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Work Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@firm.com" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Company Name *</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} required placeholder="Your Architecture Firm" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Firm Size *</label>
                    <select name="projectSize" value={formData.projectSize} onChange={handleChange} required className={inputClass}>
                      <option value="" className="bg-[var(--bg-elevated)]">Select firm size…</option>
                      <option value="1-10" className="bg-[var(--bg-elevated)]">1–10 architects</option>
                      <option value="11-50" className="bg-[var(--bg-elevated)]">11–50 architects</option>
                      <option value="51-200" className="bg-[var(--bg-elevated)]">51–200 architects</option>
                      <option value="200+" className="bg-[var(--bg-elevated)]">200+ architects</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Tell us about your needs</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="What are your main validation challenges? Which standards matter most?"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-[var(--accent-primary)] px-6 py-3 font-space-grotesk text-sm font-semibold text-white transition-all hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/30 active:scale-[0.98]"
                  >
                    Schedule Demo →
                  </button>
                </form>

                <p className="mt-4 text-center font-mono text-[10px] text-[var(--text-tertiary)]">
                  By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
