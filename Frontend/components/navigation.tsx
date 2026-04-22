'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--bg-border)] bg-[var(--bg-base)]/90 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
          <div className="relative flex h-7 w-7 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-[var(--accent-primary)]/20 group-hover:bg-[var(--accent-primary)]/30 transition-colors" />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="var(--accent-primary)" opacity="0.9" />
              <rect x="9" y="1" width="6" height="6" rx="1" fill="var(--accent-primary)" opacity="0.5" />
              <rect x="1" y="9" width="6" height="6" rx="1" fill="var(--accent-primary)" opacity="0.5" />
              <rect x="9" y="9" width="6" height="6" rx="1" fill="var(--accent-secondary)" opacity="0.85" />
            </svg>
          </div>
          <span className="font-space-grotesk text-sm font-bold tracking-tight">
            <span className="text-[var(--text-primary)]">Spatium</span>
            <span className="text-[var(--accent-primary)]">AI</span>
          </span>
        </Link>

        {/* Center Navigation - Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/contact-sales"
            className="hidden rounded-lg border border-[var(--bg-border-hover)] px-4 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/8 sm:block"
          >
            Book Demo
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[var(--accent-primary)] px-5 py-1.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[var(--accent-primary)]/30 hover:bg-[#5a98ff] active:scale-95"
          >
            Start Free
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="ml-1 rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-[var(--bg-border)] bg-[var(--bg-surface)]/95 backdrop-blur-xl px-5 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--bg-border)] flex flex-col gap-2">
            <Link
              href="/contact-sales"
              className="w-full rounded-lg border border-[var(--bg-border-hover)] px-4 py-2.5 text-center text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40"
            >
              Book Demo
            </Link>
            <Link
              href="/signup"
              className="w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#5a98ff]"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
