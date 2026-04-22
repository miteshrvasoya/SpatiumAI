'use client';

import { useState, useEffect, useRef } from 'react';
import { MonoTag } from './mono-tag';
import { ConstraintBadge } from './constraint-badge';

// ─── Data ───────────────────────────────────────────────────────────────────

const DEMO_SCENARIOS = [
  {
    id: 'residential',
    label: 'Residential 2BHK',
    type: 'DWG',
    score: 74,
    issues: 3,
    passes: 9,
    description: 'Standard 1,100 sq.ft. apartment layout — Mumbai suburb',
    checks: [
      { id: 'nbc',       label: 'NBC Room Areas',     status: 'pass'     as const, detail: 'all rooms ≥ 9.5m²',          value: '✓ OK' },
      { id: 'vastu',     label: 'Vastu Zones',         status: 'critical' as const, detail: 'NE toilet placement',         value: '⚠ Fail' },
      { id: 'corridor',  label: 'Corridor Width',      status: 'major'    as const, detail: '0.88m vs 1.0m min',           value: '⚠ Warn' },
      { id: 'kitchen',   label: 'Kitchen Ventilation', status: 'pass'     as const, detail: '18.3% (min 10%)',             value: '✓ OK' },
      { id: 'fire',      label: 'Fire Egress',         status: 'pass'     as const, detail: '2 exits, both compliant',     value: '✓ OK' },
      { id: 'daylight',  label: 'Daylighting',         status: 'pass'     as const, detail: 'W/F ratio 14.5%',             value: '✓ OK' },
      { id: 'ergo',      label: 'Ergonomics',          status: 'critical' as const, detail: 'master bath door 0.7m',       value: '⚠ Fail' },
      { id: 'struct',    label: 'Structural',          status: 'pass'     as const, detail: 'no unsupported spans',        value: '✓ OK' },
    ],
    resolutions: [
      {
        id: 'A',
        title: 'Relocate Toilet',
        tag: 'RECOMMENDED',
        tagVariant: 'success' as const,
        desc: 'Shift WC to NW zone. Adjust plumbing chase by 1.2m. Vastu score improves by +18 pts.',
        impact: '+18 score',
        impactPositive: true,
      },
      {
        id: 'B',
        title: 'Widen Corridor',
        tag: 'EASY WIN',
        tagVariant: 'accent' as const,
        desc: 'Shift living room east wall by 120mm. Corridor → 1.0m. No structural changes.',
        impact: '+6 score',
        impactPositive: true,
      },
      {
        id: 'C',
        title: 'Expand Master Bath',
        tag: 'REVIEW',
        tagVariant: 'warning' as const,
        desc: 'Absorb 0.4m² of passage. Door → 0.9m. Passage reduces to advisory width.',
        impact: '+4 score',
        impactPositive: true,
      },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial Office',
    type: 'IFC',
    score: 88,
    issues: 1,
    passes: 11,
    description: 'Open-plan office floor — 3,400 sq.ft., Bangalore IT park',
    checks: [
      { id: 'nbc',       label: 'NBC Occupancy Load', status: 'pass'     as const, detail: '82 persons, 12m² per head',    value: '✓ OK' },
      { id: 'fire',      label: 'Fire Egress',        status: 'critical' as const, detail: 'travel dist. 54m vs 45m max',  value: '⚠ Fail' },
      { id: 'daylight',  label: 'Daylighting',        status: 'pass'     as const, detail: '22% W/F ratio, excellent',     value: '✓ OK' },
      { id: 'access',    label: 'Accessibility',      status: 'pass'     as const, detail: 'ramp, tactile, lift present',  value: '✓ OK' },
      { id: 'parking',   label: 'Parking Ratio',      status: 'pass'     as const, detail: '1:75m² GFA compliant',         value: '✓ OK' },
      { id: 'struct',    label: 'Structural Grid',    status: 'pass'     as const, detail: '8m × 8m column grid OK',       value: '✓ OK' },
      { id: 'hvac',      label: 'HVAC Zoning',        status: 'pass'     as const, detail: 'fresh air: 15 CFM/person',     value: '✓ OK' },
      { id: 'vastu',     label: 'Vastu (Optional)',   status: 'pass'     as const, detail: 'N-facing entry, ideal',        value: '✓ OK' },
    ],
    resolutions: [
      {
        id: 'A',
        title: 'Add Egress Stair',
        tag: 'REQUIRED',
        tagVariant: 'danger' as const,
        desc: 'Add secondary stair at NE corner. Reduces max. travel to 38m. Compliant.',
        impact: '+12 score',
        impactPositive: true,
      },
      {
        id: 'B',
        title: 'Reroute Aisle',
        tag: 'ALTERNATIVE',
        tagVariant: 'accent' as const,
        desc: 'Realign central corridor to shorten path-to-exit. No structural modification.',
        impact: '+8 score',
        impactPositive: true,
      },
    ],
  },
  {
    id: 'villa',
    label: 'Independent Villa',
    type: 'PDF',
    score: 61,
    issues: 5,
    passes: 7,
    description: 'G+2 duplex villa with basement — Ahmedabad residential plot',
    checks: [
      { id: 'setback',  label: 'Plot Setbacks',       status: 'critical' as const, detail: 'rear setback 1.8m vs 3m req', value: '⚠ Fail' },
      { id: 'far',      label: 'FAR Compliance',      status: 'major'    as const, detail: '2.8 vs 2.5 FSI permitted',    value: '⚠ Warn' },
      { id: 'height',   label: 'Building Height',     status: 'pass'     as const, detail: '9.6m within 10m limit',       value: '✓ OK' },
      { id: 'vastu',    label: 'Vastu Zones',         status: 'critical' as const, detail: 'master BR in NE sector',      value: '⚠ Fail' },
      { id: 'parking',  label: 'Parking',             status: 'pass'     as const, detail: '2 ECS provided, min 1',       value: '✓ OK' },
      { id: 'fire',     label: 'Fire Egress',         status: 'pass'     as const, detail: 'staircase 1.2m wide OK',      value: '✓ OK' },
      { id: 'daylight', label: 'Daylighting',         status: 'major'    as const, detail: 'basement rooms 0% nat. light',value: '⚠ Warn' },
      { id: 'struct',   label: 'Structural',          status: 'critical' as const, detail: 'cantilever 4.8m needs check', value: '⚠ Fail' },
    ],
    resolutions: [
      {
        id: 'A',
        title: 'Reduce Building Footprint',
        tag: 'RECOMMENDED',
        tagVariant: 'success' as const,
        desc: 'Reduce ground floor by 2.1m to achieve FSI 2.49 and rear setback 3.0m simultaneously.',
        impact: '+22 score',
        impactPositive: true,
      },
      {
        id: 'B',
        title: 'Shift Master Bedroom',
        tag: 'VASTU FIX',
        tagVariant: 'accent' as const,
        desc: 'Move master bedroom to SW corner. SW zone ideal for stability. NE freed for pooja room.',
        impact: '+9 score',
        impactPositive: true,
      },
      {
        id: 'C',
        title: 'Add Basement Lightwells',
        tag: 'ADVISORY',
        tagVariant: 'warning' as const,
        desc: '2× lightwells of 1.0m × 1.0m to provide natural light to basement rooms.',
        impact: '+6 score',
        impactPositive: true,
      },
    ],
  },
];

const DOMAIN_ICONS: Record<string, string> = {
  nbc: '📐', vastu: '🧭', corridor: '↔', kitchen: '🍳', fire: '🔥',
  daylight: '☀️', ergo: '🚪', struct: '🏗', access: '♿', parking: '🚗',
  hvac: '💨', setback: '📏', far: '📊', height: '📏', weight: '⚖',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function HowItWorksSection() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [activeStep, setActiveStep] = useState(0); // 0=upload, 1=validate, 2=resolve
  const [selectedFix, setSelectedFix] = useState('A');
  const [applied, setApplied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [visibleChecks, setVisibleChecks] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const scenario = DEMO_SCENARIOS[activeScenario];

  // Reset when scenario changes
  useEffect(() => {
    setActiveStep(0);
    setUploadProgress(0);
    setValidationProgress(0);
    setVisibleChecks(0);
    setApplied(false);
    setSelectedFix('A');
    setIsUploading(false);
    setIsValidating(false);
  }, [activeScenario]);

  // Upload simulation
  const handleUpload = () => {
    if (activeStep !== 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setActiveStep(1);
          startValidation();
        }, 400);
      } else {
        setUploadProgress(Math.round(p));
      }
    }, 120);
  };

  const startValidation = () => {
    setIsValidating(true);
    setValidationProgress(0);
    setVisibleChecks(0);
    let p = 0;
    const total = DEMO_SCENARIOS[activeScenario].checks.length;
    let shown = 0;
    const t = setInterval(() => {
      p += 100 / (total * 1.4);
      if (shown < total && p >= ((shown + 1) / total) * 100) {
        shown++;
        setVisibleChecks(shown);
      }
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setValidationProgress(100);
        setVisibleChecks(total);
        setTimeout(() => {
          setIsValidating(false);
          setActiveStep(2);
        }, 600);
      } else {
        setValidationProgress(Math.round(p));
      }
    }, 200);
  };

  const handleApplyFix = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  return (
    <section className="relative bg-[var(--bg-surface)] px-5 py-20 md:py-28">
      {/* Section divider top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bg-border)] to-transparent" />

      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-4 flex justify-center">
          <MonoTag variant="accent">INTERACTIVE DEMO</MonoTag>
        </div>
        <h2 className="mb-3 text-center font-space-grotesk text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl">
          Try it — right here.
        </h2>
        <p className="mb-10 text-center font-space-grotesk text-base text-[var(--text-secondary)] mx-auto max-w-xl md:text-lg">
          Pick a project type and walk through a real validation flow.
        </p>

        {/* Scenario Selector */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {DEMO_SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveScenario(i)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeScenario === i
                  ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary-dim)] text-[var(--accent-primary)]'
                  : 'border-[var(--bg-border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--bg-border-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <MonoTag variant="default">{s.type}</MonoTag>
              {s.label}
            </button>
          ))}
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {[
            { n: 1, label: 'Upload' },
            { n: 2, label: 'Validate' },
            { n: 3, label: 'Fix' },
          ].map((step, i) => {
            const done = activeStep > i;
            const active = activeStep === i;
            return (
              <div key={step.n} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      done
                        ? 'bg-[var(--accent-secondary)] text-[var(--bg-base)]'
                        : active
                        ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/30'
                        : 'border border-[var(--bg-border)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    {done ? '✓' : step.n}
                  </div>
                  <span className={`font-mono text-[10px] ${active ? 'text-[var(--accent-primary)]' : done ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-tertiary)]'}`}>
                    {step.label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className="mb-4 h-px w-12 transition-all duration-500"
                    style={{ background: done ? 'var(--accent-secondary)' : 'var(--bg-border)' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Main Demo Panel ── */}
        <div className="overflow-hidden rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-base)]">
          {/* Window chrome */}
          <div className="flex items-center gap-3 border-b border-[var(--bg-border)] bg-[var(--bg-elevated)] px-5 py-3">
            <div className="flex gap-1.5">
              {['#FF5F57', '#FFBD2E', '#28CA41'].map(c => (
                <div key={c} className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 rounded-md bg-[var(--bg-base)] px-3 py-1">
                <div className={`h-2 w-2 rounded-full transition-colors ${activeStep === 2 ? 'bg-[var(--green-pass)]' : activeStep === 1 ? 'bg-[var(--amber-flag)]' : 'bg-[var(--text-tertiary)]'}`} />
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  spatiumai.com / demo / {scenario.id}
                </span>
              </div>
            </div>
            <MonoTag variant={activeStep === 2 ? 'success' : activeStep === 1 ? 'warning' : 'default'}>
              {activeStep === 2 ? 'COMPLETE' : activeStep === 1 ? 'VALIDATING' : 'READY'}
            </MonoTag>
          </div>

          {/* Panel content */}
          <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-[var(--bg-border)]">

            {/* ── LEFT: Upload → Validate ── */}
            <div className="p-6">
              {/* STEP 0: Upload */}
              {activeStep === 0 && (
                <div className="flex flex-col gap-4">
                  <div className="mb-2">
                    <p className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)] mb-0.5">Step 1 — Upload Design File</p>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)]">{scenario.description}</p>
                  </div>

                  {/* Drop zone */}
                  <div
                    className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer ${
                      dragOver
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-dim)]'
                        : 'border-[var(--bg-border-hover)] hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-elevated)]'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
                    onClick={handleUpload}
                  >
                    <div className="mb-4 text-4xl opacity-60">
                      {scenario.type === 'DWG' ? '📐' : scenario.type === 'IFC' ? '🏗' : '📄'}
                    </div>
                    <p className="font-space-grotesk text-sm font-medium text-[var(--text-primary)] mb-1">
                      Drop your {scenario.type} file here
                    </p>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)] mb-4">or click to browse</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {['DWG', 'DXF', 'IFC', 'PDF', 'IMG'].map(f => (
                        <MonoTag key={f} variant={f === scenario.type ? 'accent' : 'default'}>{f}</MonoTag>
                      ))}
                    </div>
                  </div>

                  {isUploading && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex justify-between">
                        <span className="font-mono text-[11px] text-[var(--text-tertiary)]">Uploading {scenario.label}.{scenario.type.toLowerCase()}…</span>
                        <span className="font-mono text-[11px] text-[var(--accent-primary)]">{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                        <div
                          className="h-full rounded-full transition-all duration-150"
                          style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="mt-1 w-full rounded-xl bg-[var(--accent-primary)] py-3 font-space-grotesk text-sm font-semibold text-white transition-all hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/25 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isUploading ? `Uploading… ${uploadProgress}%` : `→ Upload & Validate ${scenario.label}`}
                  </button>
                </div>
              )}

              {/* STEP 1: Validation Progress */}
              {activeStep === 1 && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="mb-2">
                    <p className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)] mb-0.5">Step 2 — Running 8-Domain Validation</p>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)]">{scenario.description}</p>
                  </div>

                  {/* Overall progress */}
                  <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[var(--text-secondary)]">
                        {isValidating ? 'Checking constraints…' : 'Validation complete'}
                      </span>
                      <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">{validationProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-base)]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${validationProgress}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
                      />
                    </div>
                    <div className="flex gap-3 text-[10px] font-mono">
                      <span className="text-[var(--text-tertiary)]">
                        {visibleChecks}/{scenario.checks.length} checks run
                      </span>
                      {!isValidating && (
                        <span className="text-[var(--green-pass)]">→ Results ready</span>
                      )}
                    </div>
                  </div>

                  {/* Live checks */}
                  <div className="space-y-1.5">
                    {scenario.checks.slice(0, visibleChecks).map((check, i) => (
                      <div
                        key={check.id}
                        className="flex items-center gap-2.5 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] px-3 py-2 animate-slide-up"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <ConstraintBadge
                          variant={check.status === 'pass' ? 'pass' : check.status === 'critical' ? 'critical' : 'major'}
                          text={check.status === 'pass' ? 'OK' : check.status === 'critical' ? 'FAIL' : 'WARN'}
                        />
                        <span className="flex-1 font-space-grotesk text-xs text-[var(--text-secondary)] truncate">{check.label}</span>
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)] hidden sm:block">{check.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Results Overview */}
              {activeStep === 2 && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="mb-1">
                    <p className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)] mb-0.5">Step 3 — Results & Solutions</p>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)]">{scenario.description}</p>
                  </div>

                  {/* Score card */}
                  <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Compliance Score</p>
                        <div className="flex items-end gap-1">
                          <span className="font-space-grotesk text-4xl font-bold text-[var(--text-primary)]">{scenario.score}</span>
                          <span className="mb-1.5 font-mono text-sm text-[var(--text-tertiary)]">/100</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-right">
                        <div className="flex justify-end gap-2">
                          <span className="rounded-md px-2 py-0.5 font-mono text-[9px] font-bold" style={{ color: 'var(--red-flag)', background: 'var(--red-flag-dim)' }}>
                            {scenario.issues} FAIL
                          </span>
                          <span className="rounded-md px-2 py-0.5 font-mono text-[9px] font-bold" style={{ color: 'var(--green-pass)', background: 'var(--green-pass-dim)' }}>
                            {scenario.passes} PASS
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-[var(--text-tertiary)]">{scenario.checks.length} domains checked</p>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-base)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${scenario.score}%`,
                          background: scenario.score >= 80 ? 'var(--green-pass)' : scenario.score >= 60 ? 'linear-gradient(90deg, var(--amber-flag), var(--accent-primary))' : 'var(--red-flag)',
                          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      />
                    </div>
                  </div>

                  {/* All checks */}
                  <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                    {scenario.checks.map((check) => (
                      <div
                        key={check.id}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-[var(--bg-elevated)] transition-colors"
                      >
                        <ConstraintBadge
                          variant={check.status === 'pass' ? 'pass' : check.status === 'critical' ? 'critical' : 'major'}
                          text={check.status === 'pass' ? 'OK' : check.status === 'critical' ? 'FAIL' : 'WARN'}
                        />
                        <span className="flex-1 font-space-grotesk text-xs text-[var(--text-secondary)]">{check.label}</span>
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)] hidden sm:block">{check.detail}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => { setActiveStep(0); setUploadProgress(0); setValidationProgress(0); setVisibleChecks(0); setApplied(false); setSelectedFix('A'); }}
                    className="w-full rounded-xl border border-[var(--bg-border-hover)] py-2.5 font-space-grotesk text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
                  >
                    ↺ Try Another Scenario
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: Fix Panel ── */}
            <div className="p-6">
              {activeStep < 2 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="relative">
                    <div
                      className="h-16 w-16 rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] flex items-center justify-center text-2xl"
                      style={{ opacity: activeStep === 1 ? 1 : 0.4 }}
                    >
                      {activeStep === 1 ? '⚡' : '🔒'}
                    </div>
                    {activeStep === 1 && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[var(--amber-flag)] animate-pulse-glow" />
                    )}
                  </div>
                  <div>
                    <p className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)] mb-1">
                      {activeStep === 1 ? 'Generating auto-fix solutions…' : 'Auto-Fix Solutions'}
                    </p>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
                      {activeStep === 1
                        ? 'Analyzing constraints and calculating resolutions'
                        : 'Complete the validation to unlock AI-generated solutions'}
                    </p>
                  </div>
                  {activeStep === 0 && (
                    <div className="flex flex-col gap-2 w-full max-w-xs opacity-40 pointer-events-none">
                      {[1, 2, 3].map(n => (
                        <div key={n} className="h-16 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] animate-shimmer" />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="mb-1">
                    <p className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)] mb-0.5">AI-Generated Fix Solutions</p>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
                      {scenario.resolutions.length} architecturally-valid options — select and apply
                    </p>
                  </div>

                  {/* Resolution cards */}
                  <div className="space-y-2.5">
                    {scenario.resolutions.map((res) => (
                      <label
                        key={res.id}
                        className={`group flex cursor-pointer gap-3 rounded-xl border p-4 transition-all duration-200 ${
                          selectedFix === res.id
                            ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary-dim)]'
                            : 'border-[var(--bg-border)] bg-[var(--bg-elevated)] hover:border-[var(--bg-border-hover)] hover:bg-[var(--bg-card)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="fix"
                          value={res.id}
                          checked={selectedFix === res.id}
                          onChange={() => setSelectedFix(res.id)}
                          className="mt-1 accent-[var(--accent-primary)]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)]">
                              {res.id}. {res.title}
                            </span>
                            <MonoTag variant={res.tagVariant}>{res.tag}</MonoTag>
                          </div>
                          <p className="font-space-grotesk text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
                            {res.desc}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-[var(--text-tertiary)]">Impact:</span>
                            <span className="font-mono text-[10px] font-bold text-[var(--accent-secondary)]">{res.impact}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Apply button */}
                  <button
                    onClick={handleApplyFix}
                    disabled={applied}
                    className={`w-full rounded-xl py-3.5 font-space-grotesk text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                      applied
                        ? 'bg-[var(--green-pass)] text-[var(--bg-base)] shadow-lg shadow-[var(--green-pass)]/20'
                        : 'bg-[var(--accent-primary)] text-white hover:bg-[#5a98ff] hover:shadow-lg hover:shadow-[var(--accent-primary)]/25'
                    }`}
                  >
                    {applied
                      ? `✓ Solution ${selectedFix} Applied — Re-validating…`
                      : `→ Apply Solution ${selectedFix}`}
                  </button>

                  {applied && (
                    <div className="rounded-xl border border-[var(--accent-secondary)]/25 bg-[var(--accent-secondary)]/10 p-3 animate-fade-in">
                      <p className="font-mono text-[11px] text-[var(--accent-secondary)] font-semibold mb-0.5">
                        ✓ Applying solution to your design file…
                      </p>
                      <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-elevated)] mt-2">
                        <div
                          className="h-full rounded-full bg-[var(--accent-secondary)]"
                          style={{ animation: 'progress-fill 2.5s ease-out forwards' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Export options */}
                  <div className="mt-1 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-3">
                    <p className="font-mono text-[10px] text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">Export Options</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['PDF Report', 'DWG Updated', 'IFC Export', 'Compliance Cert'].map(opt => (
                        <span
                          key={opt}
                          className="rounded-lg border border-[var(--bg-border)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--accent-primary)] cursor-pointer transition-colors"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Steps summary below */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { n: '01', title: 'Upload Any Format', body: 'DWG, IFC, PDF, or photo. Parsed in seconds.', icon: '📤' },
            { n: '02', title: '8-Domain Validation', body: 'NBC, Vastu, fire, ergonomics, structure & more.', icon: '⚡' },
            { n: '03', title: 'Auto-Fix & Export', body: 'Apply solutions, export reports. First-time pass.', icon: '✅' },
          ].map((step) => (
            <div
              key={step.n}
              className="flex items-start gap-4 rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] p-5 hover:border-[var(--bg-border-hover)] transition-colors"
            >
              <div className="flex-shrink-0 text-2xl">{step.icon}</div>
              <div>
                <div className="font-mono text-[10px] text-[var(--text-tertiary)] mb-1">{step.n}</div>
                <h3 className="font-space-grotesk text-sm font-semibold text-[var(--text-primary)] mb-1">{step.title}</h3>
                <p className="font-space-grotesk text-xs text-[var(--text-secondary)] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--bg-border)] to-transparent" />
    </section>
  );
}
