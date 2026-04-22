'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navigation />
      <main className="flex min-h-screen items-center justify-center px-5 pt-20 pb-12">
        <div className="w-full max-w-md">
          {submitted ? (
            <div className="text-center space-y-5 rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--green-pass-dim)] text-3xl">
                ✓
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                Welcome to SpatiumAI!
              </h1>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                We&apos;ve sent a confirmation email to{' '}
                <span className="font-semibold text-[var(--accent-primary)]">{formData.email}</span>.
                Check your inbox to activate your account.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-2 rounded-xl bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/30"
              >
                Return to Home →
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 text-center">
                <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-primary)]/20">
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
                </Link>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk mb-1.5">
                  Start your free trial
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  10 designs free · No credit card required
                </p>
              </div>

              {/* Form Card */}
              <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'firstName', label: 'First Name', placeholder: 'John' },
                      { id: 'lastName', label: 'Last Name', placeholder: 'Doe' },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.id}
                          value={formData[field.id as keyof typeof formData]}
                          onChange={handleChange}
                          required
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30"
                        />
                      </div>
                    ))}
                  </div>

                  {[
                    { id: 'email', label: 'Work Email', type: 'email', placeholder: 'john@firm.com' },
                    { id: 'company', label: 'Company / Firm', type: 'text', placeholder: 'Your Architecture Firm' },
                    { id: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Principal Architect' },
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={handleChange}
                        required={field.id === 'email'}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-[var(--accent-primary)] px-6 py-3 font-space-grotesk text-sm font-semibold text-white transition-all hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/30 active:scale-[0.98]"
                  >
                    Create Free Account →
                  </button>
                </form>

                <p className="mt-5 text-center text-xs text-[var(--text-tertiary)]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[var(--accent-primary)] hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Trust strip */}
              <div className="mt-5 flex flex-wrap justify-center gap-4">
                {['🔒 Secure & encrypted', '🇮🇳 Built for India', '⚡ Setup in 2 min'].map((t) => (
                  <span key={t} className="font-mono text-[10px] text-[var(--text-tertiary)]">{t}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
