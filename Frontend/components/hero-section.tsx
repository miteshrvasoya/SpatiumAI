'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const VALIDATION_CHECKS = [
  { id: 'nbc', label: 'NBC Room Areas', status: 'pass', value: '14.2m²', note: 'Min 9.5m² ✓' },
  { id: 'vastu', label: 'Vastu Zone', status: 'critical', value: 'NE Toilet', note: 'Violation' },
  { id: 'corridor', label: 'Corridor Width', status: 'warning', value: '0.88m', note: 'Min 1.0m' },
  { id: 'ventilation', label: 'Kitchen Ventilation', status: 'pass', value: '14.3%', note: 'Min 10% ✓' },
  { id: 'br2', label: 'Bedroom 2 Area', status: 'critical', value: '8.1m²', note: 'Min 9.5m²' },
  { id: 'fire', label: 'Fire Egress', status: 'pass', value: '2 exits', note: 'Compliant ✓' },
  { id: 'daylight', label: 'Daylighting', status: 'pass', value: '18.5%', note: 'Min 12.5% ✓' },
];

const STATUS_CONFIG = {
  pass: { color: 'var(--green-pass)', bg: 'var(--green-pass-dim)', label: 'PASS', dot: '#34D399' },
  critical: { color: 'var(--red-flag)', bg: 'var(--red-flag-dim)', label: 'FAIL', dot: '#F87171' },
  warning: { color: 'var(--amber-flag)', bg: 'var(--amber-flag-dim)', label: 'WARN', dot: '#FBBF24' },
};

export function HeroSection() {
  const [animStep, setAnimStep] = useState(0);
  const [activeCheck, setActiveCheck] = useState(1);
  const [scanDone, setScanDone] = useState(false);
  const [score, setScore] = useState(0);

  // Animate evaluation steps
  useEffect(() => {
    const timer = setTimeout(() => setScanDone(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!scanDone) return;
    let n = 0;
    const target = 74;
    const step = setInterval(() => {
      n = Math.min(n + 3, target);
      setScore(n);
      if (n >= target) clearInterval(step);
    }, 30);
    return () => clearInterval(step);
  }, [scanDone]);

  // Auto-cycle highlighted check
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCheck((prev) => (prev + 1) % VALIDATION_CHECKS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const issues = VALIDATION_CHECKS.filter((c) => c.status !== 'pass').length;
  const passes = VALIDATION_CHECKS.filter((c) => c.status === 'pass').length;

  return (
    <section className="relative min-h-screen hero-grid-bg overflow-hidden pt-16">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="animate-breathing absolute"
          style={{
            top: '-15%', left: '-10%',
            width: '700px', height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-20%', right: '-10%',
            width: '600px', height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 lg:items-center">
          {/* ── LEFT COLUMN ── */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/25 bg-[var(--accent-primary)]/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse-glow" />
              <span className="font-mono text-xs text-[var(--accent-primary)] tracking-wide">
                India&apos;s first AI design validator
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-5 font-space-grotesk text-4xl font-bold leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
              Validate designs{' '}
              <span className="gradient-text">instantly.</span>
              <br />
              Ship compliant{' '}
              <span className="relative">
                <span className="gradient-text">every time.</span>
                <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 200 4" fill="none" preserveAspectRatio="none">
                  <path d="M0 2 Q50 0 100 2 Q150 4 200 2" stroke="var(--accent-secondary)" strokeWidth="2" fill="none" opacity="0.6" />
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <p className="mb-8 text-base leading-relaxed text-[var(--text-secondary)] max-w-lg sm:text-lg">
              Upload your floor plan — SpatiumAI cross-validates against NBC codes, Vastu, ergonomics, fire egress, and 5 more domains in under 90 seconds.
            </p>

            {/* Stat chips */}
            <div className="mb-8 flex flex-wrap gap-3">
              {[
                { label: '&lt; 90s', sub: 'validation time' },
                { label: '8 domains', sub: 'simultaneous' },
                { label: '40+ firms', sub: 'in closed beta' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] px-4 py-3"
                >
                  <span
                    className="font-space-grotesk text-base font-bold text-[var(--text-primary)]"
                    dangerouslySetInnerHTML={{ __html: stat.label }}
                  />
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] mt-0.5">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-7 py-3.5 font-space-grotesk font-semibold text-white transition-all hover:bg-[#5a98ff] hover:shadow-xl hover:shadow-[var(--accent-primary)]/30 active:scale-95"
              >
                Start Free Trial
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact-sales"
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--bg-border-hover)] px-7 py-3.5 font-space-grotesk font-semibold text-[var(--text-primary)] transition-all hover:border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/8"
              >
                Request Demo
              </Link>
            </div>

            <p className="mt-4 font-mono text-[11px] text-[var(--text-tertiary)]">
              No credit card required · Free 10-design trial
            </p>
          </div>

          {/* ── RIGHT COLUMN — Interactive Validator UI ── */}
          <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl shadow-black/40">
              {/* Window Chrome */}
              <div className="flex items-center justify-between gap-3 border-b border-[var(--bg-border)] bg-[var(--bg-elevated)] px-5 py-3.5">
                <div className="flex gap-1.5">
                  {['#FF5F57', '#FFBD2E', '#28CA41'].map((c) => (
                    <div key={c} className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 rounded-md bg-[var(--bg-base)] px-3 py-1">
                    <div className="h-2 w-2 rounded-full bg-[var(--accent-secondary)]" />
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                      project.spatiumai.com / residential-2025
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] rounded bg-[var(--bg-base)] px-2 py-0.5">
                    {scanDone ? 'DONE ✓' : 'SCANNING...'}
                  </span>
                </div>
              </div>

              {/* Main layout */}
              <div className="flex flex-col gap-0 md:flex-row">
                {/* Floor Plan SVG */}
                <div className="relative flex-[0_0_42%] border-r border-[var(--bg-border)] bg-[var(--bg-base)] p-4">
                  {/* Scan line animation */}
                  {!scanDone && (
                    <div
                      className="animate-scan-line pointer-events-none absolute left-0 right-0 h-0.5 z-10"
                      style={{ background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', top: '10%' }}
                    />
                  )}
                  <svg viewBox="0 0 240 310" className="w-full" style={{ aspectRatio: '24/31' }}>
                    {/* Grid */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79,142,247,0.06)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="240" height="310" fill="url(#grid)" />

                    {/* Outer boundary */}
                    <rect x="8" y="8" width="224" height="294" fill="none" stroke="rgba(79,142,247,0.3)" strokeWidth="1.5" rx="1" />

                    {/* Master BR – PASS */}
                    <rect x="16" y="16" width="104" height="80"
                      fill={activeCheck === 0 ? 'rgba(52,211,153,0.12)' : 'rgba(52,211,153,0.06)'}
                      stroke="rgba(52,211,153,0.4)" strokeWidth="1" rx="1"
                      style={{ transition: 'fill 0.3s' }}
                    />
                    <text x="68" y="52" textAnchor="middle" fontSize="7" fill="rgba(139,156,196,0.8)" fontFamily="monospace">MASTER BR</text>
                    <text x="68" y="64" textAnchor="middle" fontSize="6" fill="rgba(52,211,153,0.7)" fontFamily="monospace">14.2m² ✓</text>
                    <text x="102" y="26" textAnchor="middle" fontSize="10" fill="#34D399">✓</text>

                    {/* BR 2 – CRITICAL */}
                    <rect x="128" y="16" width="96" height="80"
                      fill={activeCheck === 4 ? 'rgba(248,113,113,0.15)' : 'rgba(248,113,113,0.06)'}
                      stroke="rgba(248,113,113,0.4)" strokeWidth="1" rx="1"
                      style={{ transition: 'fill 0.3s' }}
                    />
                    <text x="176" y="52" textAnchor="middle" fontSize="7" fill="rgba(139,156,196,0.8)" fontFamily="monospace">BR 2</text>
                    <text x="176" y="64" textAnchor="middle" fontSize="6" fill="rgba(248,113,113,0.8)" fontFamily="monospace">8.1m² ✗</text>
                    <circle cx="218" cy="24" r="5" fill="none" stroke="#F87171" strokeWidth="1.5"
                      style={{ animation: scanDone ? 'none' : undefined }}
                    />
                    <text x="218" y="27" textAnchor="middle" fontSize="7" fill="#F87171">!</text>

                    {/* Kitchen – PASS */}
                    <rect x="128" y="108" width="96" height="64"
                      fill={activeCheck === 3 ? 'rgba(52,211,153,0.12)' : 'rgba(79,142,247,0.05)'}
                      stroke="rgba(79,142,247,0.25)" strokeWidth="1" rx="1"
                      style={{ transition: 'fill 0.3s' }}
                    />
                    <text x="176" y="137" textAnchor="middle" fontSize="7" fill="rgba(139,156,196,0.8)" fontFamily="monospace">KITCHEN</text>
                    <text x="176" y="149" textAnchor="middle" fontSize="6" fill="rgba(52,211,153,0.7)" fontFamily="monospace">14.3% ✓</text>

                    {/* Living */}
                    <rect x="16" y="108" width="104" height="118"
                      fill="rgba(79,142,247,0.04)"
                      stroke="rgba(79,142,247,0.2)" strokeWidth="1" rx="1"
                    />
                    <text x="68" y="168" textAnchor="middle" fontSize="7" fill="rgba(139,156,196,0.8)" fontFamily="monospace">LIVING</text>

                    {/* Corridor – WARNING */}
                    <rect x="128" y="180" width="96" height="48"
                      fill={activeCheck === 2 ? 'rgba(251,191,36,0.12)' : 'rgba(251,191,36,0.05)'}
                      stroke="rgba(251,191,36,0.35)" strokeWidth="1" rx="1"
                      style={{ transition: 'fill 0.3s' }}
                    />
                    <text x="176" y="201" textAnchor="middle" fontSize="7" fill="rgba(139,156,196,0.8)" fontFamily="monospace">CORRIDOR</text>
                    <text x="176" y="213" textAnchor="middle" fontSize="6" fill="rgba(251,191,36,0.8)" fontFamily="monospace">0.88m ⚠</text>

                    {/* Toilet – CRITICAL */}
                    <rect x="190" y="16" width="34" height="34"
                      fill={activeCheck === 1 ? 'rgba(248,113,113,0.18)' : 'rgba(248,113,113,0.08)'}
                      stroke="rgba(248,113,113,0.5)" strokeWidth="1" rx="1"
                      style={{ transition: 'fill 0.3s' }}
                    />
                    <text x="207" y="36" textAnchor="middle" fontSize="6" fill="rgba(248,113,113,0.9)" fontFamily="monospace">WC</text>

                    {/* Compass */}
                    <g transform="translate(220, 270)">
                      <circle r="10" fill="none" stroke="rgba(79,142,247,0.2)" strokeWidth="1" />
                      <line x1="0" y1="-7" x2="0" y2="7" stroke="rgba(139,156,196,0.4)" strokeWidth="1" />
                      <line x1="-7" y1="0" x2="7" y2="0" stroke="rgba(139,156,196,0.4)" strokeWidth="1" />
                      <text x="0" y="-10" textAnchor="middle" fontSize="6" fill="rgba(139,156,196,0.6)" fontFamily="monospace" fontWeight="bold">N</text>
                    </g>

                    {/* Scale bar */}
                    <line x1="16" y1="298" x2="76" y2="298" stroke="rgba(79,142,247,0.3)" strokeWidth="1" />
                    <text x="46" y="307" textAnchor="middle" fontSize="5.5" fill="rgba(139,156,196,0.5)" fontFamily="monospace">3m</text>
                  </svg>
                </div>

                {/* Validation results panel */}
                <div className="flex-1 flex flex-col p-4">
                  {/* Score row */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Compliance Score</p>
                      <div className="flex items-end gap-1">
                        <span className="font-space-grotesk text-3xl font-bold text-[var(--text-primary)]">
                          {scanDone ? score : '--'}
                        </span>
                        <span className="mb-1 font-mono text-sm text-[var(--text-tertiary)]">/100</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-[var(--text-tertiary)] mb-1">{VALIDATION_CHECKS.length} checks</div>
                      <div className="flex gap-1.5 justify-end">
                        <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold" style={{ color: 'var(--red-flag)', background: 'var(--red-flag-dim)' }}>
                          {issues} FAIL
                        </span>
                        <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold" style={{ color: 'var(--green-pass)', background: 'var(--green-pass-dim)' }}>
                          {passes} PASS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Progress */}
                  <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: scanDone ? `${score}%` : '0%',
                        background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                      }}
                    />
                  </div>

                  {/* Checks */}
                  <div className="flex-1 space-y-1.5">
                    {VALIDATION_CHECKS.map((check, i) => {
                      const cfg = STATUS_CONFIG[check.status as keyof typeof STATUS_CONFIG];
                      const isActive = activeCheck === i;
                      return (
                        <div
                          key={check.id}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-300 cursor-default"
                          style={{
                            background: isActive ? cfg.bg : 'transparent',
                            borderLeft: isActive ? `2px solid ${cfg.color}` : '2px solid transparent',
                          }}
                        >
                          <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
                          <span className="flex-1 font-space-grotesk text-xs text-[var(--text-secondary)] truncate">
                            {check.label}
                          </span>
                          <span className="font-mono text-[9px]" style={{ color: cfg.color }}>
                            {check.value}
                          </span>
                          <span
                            className="rounded px-1.5 py-0.5 font-mono text-[8px] font-bold"
                            style={{ color: cfg.color, background: cfg.bg }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fix suggestion */}
                  <div className="mt-4 rounded-lg border border-[var(--accent-secondary)]/20 bg-[var(--accent-secondary)]/8 p-3">
                    <p className="font-mono text-[10px] text-[var(--accent-secondary)] font-semibold mb-0.5">
                      → 2 auto-fix solutions ready
                    </p>
                    <p className="font-mono text-[9px] text-[var(--text-tertiary)]">
                      Shift east partition +900mm · Re-designate BR2
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption below validator */}
            <p className="mt-3 text-center font-mono text-[10px] text-[var(--text-tertiary)]">
              Live validation preview · Highlighting cycles automatically
            </p>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-14 md:mt-20">
          <div className="section-divider mb-6" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <span className="font-mono text-[11px] text-[var(--text-tertiary)]">Trusted during closed beta by</span>
            {[
              'Rohit Shah Associates',
              'Nair Design Studio',
              'Mehta Architects Mumbai',
              'Patel & Partners Surat',
              'DesignSync Bangalore',
            ].map((firm, i) => (
              <span key={i} className="font-space-grotesk text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                {firm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
