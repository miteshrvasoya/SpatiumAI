'use client';

import { useState } from 'react';
import { MonoTag } from './mono-tag';

const DOMAINS = [
  {
    id: 1,
    icon: '📐',
    name: 'NBC Building Code',
    subtitle: 'National Building Code 2016',
    body: 'Every check cites the exact NBC clause — Part 3 residential through commercial. No guesswork, full traceability.',
    coverage: ['Min. room areas (habitable, kitchen, WC)', 'Corridor & passage widths', 'Ventilation & window ratios', 'Staircase dimensions & riser ratios'],
    tags: ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Pune'],
    color: 'var(--accent-primary)',
    dim: 'var(--accent-primary-dim)',
  },
  {
    id: 2,
    icon: '🧭',
    name: 'Vastu Shastra',
    subtitle: 'Authentic Spatial Harmony',
    body: 'Room placement, entry orientation, and zone analysis against traditional Vastu principles with modern spatial mapping.',
    coverage: ['NE wealth & pooja zone', 'SW stability (master BR)', 'Kitchen positioning rules', 'Entry & main door orientation'],
    tags: ['Pan-India', 'Regional variants'],
    color: 'var(--accent-secondary)',
    dim: 'var(--accent-secondary-dim)',
  },
  {
    id: 3,
    icon: '🚪',
    name: 'Ergonomics',
    subtitle: 'Human Comfort & Accessibility',
    body: 'Spaces that accommodate human movement, reach, and accessibility requirements per IS & ISO standards.',
    coverage: ['Door widths & thresholds', 'Counter heights (kitchen, bath)', 'Accessibility ramps & clearances', 'Wheelchair turning radius'],
    tags: ['IS 3414', 'ISO 9241', 'Universal Design'],
    color: '#A78BFA',
    dim: 'rgba(167,139,250,0.12)',
  },
  {
    id: 4,
    icon: '↔',
    name: 'Circulation',
    subtitle: 'Movement & Flow Analysis',
    body: 'Spatial traffic patterns, adjacency logic, and privacy gradation — ensuring intuitive movement through every space.',
    coverage: ['Adjacency logic & zoning', 'Entry-to-living flow', 'Path efficiency scoring', 'Public-to-private gradation'],
    tags: ['All typologies'],
    color: 'var(--accent-warm)',
    dim: 'rgba(245,158,11,0.12)',
  },
  {
    id: 5,
    icon: '🏗',
    name: 'Structural',
    subtitle: 'Structural Feasibility',
    body: 'Flags structural conflicts before working drawings — cantilever limits, column alignment, and load-path continuity.',
    coverage: ['Unsupported spans', 'Column grid alignment', 'Load path continuity', 'Cantilever feasibility'],
    tags: ['RCC', 'Masonry', 'Steel Frame'],
    color: 'var(--text-secondary)',
    dim: 'rgba(139,156,196,0.1)',
  },
  {
    id: 6,
    icon: '☀️',
    name: 'Daylighting',
    subtitle: 'Light & Ventilation',
    body: 'Window-to-floor ratios and cross-ventilation paths validated against NBC and climate-specific thresholds.',
    coverage: ['W/F area ratios (10–20%)', 'Cross-ventilation paths', 'Natural light levels (lux)', 'Ventilation adequacy per NBC'],
    tags: ['Climate-adaptive', 'Hot-dry', 'Composite', 'Humid'],
    color: '#FDE68A',
    dim: 'rgba(253,230,138,0.08)',
  },
  {
    id: 7,
    icon: '🔥',
    name: 'Fire & Egress',
    subtitle: 'Life Safety Compliance',
    body: 'Emergency egress widths, maximum travel distances, and fire-rated separations — NBC Part 4 fully integrated.',
    coverage: ['Egress widths (min 0.9m)', 'Max travel distances', 'Stair width & riser ratios', 'Fire separation requirements'],
    tags: ['All occupancy types', 'NBC Part 4'],
    color: 'var(--red-flag)',
    dim: 'var(--red-flag-dim)',
  },
  {
    id: 8,
    icon: '🏠',
    name: 'Indian Typologies',
    subtitle: 'Indian Housing Standards',
    body: 'Pre-trained on compact 1BHK to luxury villa patterns across Indian cities — regional norms included.',
    coverage: ['1BHK compact (600–800 sq.ft)', '2BHK standard (800–1200 sq.ft)', '3BHK premium (1200–2000 sq.ft)', 'G+2 villas & row houses'],
    tags: ['All Indian cities', 'Regional norms'],
    color: 'var(--accent-secondary)',
    dim: 'var(--accent-secondary-dim)',
  },
];

export function ConstraintDomainsSection() {
  const [activeTab, setActiveTab] = useState(1);
  const activeDomain = DOMAINS.find((d) => d.id === activeTab) || DOMAINS[0];

  return (
    <section className="relative bg-[var(--bg-base)] px-5 py-20 md:py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bg-border)] to-transparent" />

      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-4 flex justify-center">
          <MonoTag variant="accent">8 DOMAINS</MonoTag>
        </div>
        <h2 className="mb-3 text-center font-space-grotesk text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl">
          Every dimension. One validation.
        </h2>
        <p className="mb-14 text-center font-space-grotesk text-base text-[var(--text-secondary)] mx-auto max-w-xl md:text-lg">
          Eight expert-maintained rule sets checked in parallel — no manual switching between standards.
        </p>

        {/* Domain grid + detail */}
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Domain pill list */}
          <div className="space-y-1">
            {DOMAINS.map((domain) => {
              const isActive = activeTab === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveTab(domain.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--bg-card)] border border-[var(--bg-border-hover)]'
                      : 'border border-transparent hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <span className="text-lg flex-shrink-0" style={{ filter: isActive ? 'none' : 'grayscale(0.7) opacity(0.6)' }}>
                    {domain.icon}
                  </span>
                  <div className="min-w-0">
                    <div className={`font-space-grotesk text-sm font-semibold truncate transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {domain.name}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">{domain.tags[0]}</div>
                  </div>
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: activeDomain.color }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Domain Detail Card */}
          <div
            key={activeDomain.id}
            className="rounded-2xl border bg-[var(--bg-surface)] p-7 animate-fade-in"
            style={{ borderColor: activeDomain.color + '30' }}
          >
            {/* Domain header */}
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{activeDomain.icon}</span>
                  <div>
                    <h3 className="font-space-grotesk text-xl font-bold text-[var(--text-primary)]">{activeDomain.name}</h3>
                    <p className="font-mono text-[11px]" style={{ color: activeDomain.color }}>{activeDomain.subtitle}</p>
                  </div>
                </div>
              </div>
              <div
                className="flex-shrink-0 h-2 w-2 rounded-full mt-2 animate-pulse-glow"
                style={{ backgroundColor: activeDomain.color }}
              />
            </div>

            <p className="mb-6 font-space-grotesk text-sm text-[var(--text-secondary)] leading-relaxed">
              {activeDomain.body}
            </p>

            {/* Coverage items */}
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] mb-3">What We Check</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {activeDomain.coverage.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-3 py-2.5"
                  >
                    <span className="mt-0.5 font-bold text-xs flex-shrink-0" style={{ color: activeDomain.color }}>→</span>
                    <span className="font-space-grotesk text-xs text-[var(--text-secondary)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] mb-2">Applies To</p>
              <div className="flex flex-wrap gap-2">
                {activeDomain.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-lg border px-2.5 py-1 font-mono text-[10px]"
                    style={{ color: activeDomain.color, borderColor: activeDomain.color + '30', background: activeDomain.dim }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Domain icon strip */}
        <div className="mt-10 grid grid-cols-4 gap-3 md:grid-cols-8">
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveTab(d.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 ${
                activeTab === d.id
                  ? 'border-[var(--bg-border-hover)] bg-[var(--bg-card)]'
                  : 'border-[var(--bg-border)] bg-[var(--bg-elevated)] hover:border-[var(--bg-border-hover)]'
              }`}
            >
              <span className="text-xl">{d.icon}</span>
              <span className={`font-mono text-[9px] leading-tight text-center ${activeTab === d.id ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}`}>
                {d.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bg-border)] to-transparent" />
    </section>
  );
}
