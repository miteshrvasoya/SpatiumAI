// ─────────────────────────────────────────────────────────────────────────────
// SpatiumAI — Constraint Knowledge Base Types
// These types define the shape of every rule in the constraint KB.
// The actual KB entries live in PostgreSQL. This is the TypeScript shape.
// ─────────────────────────────────────────────────────────────────────────────

export type ConstraintDomain =
  | 'nbc'        // National Building Code 2016
  | 'vastu'      // Vastu Shastra
  | 'ergonomics' // Human comfort & accessibility
  | 'circulation'// Movement & flow
  | 'structural' // Structural feasibility
  | 'daylight'   // Daylighting & ventilation
  | 'fire'       // Fire & egress (NBC Part 4)
  | 'typology';  // Indian housing typology norms

export type ConstraintSeverity =
  | 'critical' // Blocks approval — must fix. Validated by Ayush before going live.
  | 'major'    // Significant issue — should fix
  | 'advisory';// Best practice — consider fixing

export type CheckType =
  | 'min_area'       // e.g. room area >= threshold
  | 'max_area'       // e.g. room area <= threshold
  | 'min_dimension'  // e.g. min width/length
  | 'min_distance'   // e.g. min corridor width
  | 'max_distance'   // e.g. max travel distance to exit
  | 'ratio'          // e.g. window area / floor area >= 0.10
  | 'orientation'    // e.g. kitchen must NOT face SW
  | 'adjacency'      // e.g. master bedroom must adjoin ensuite
  | 'flag';          // Boolean presence check — no threshold, just flag if violated

export type ThresholdUnit = 'sqm' | 'm' | 'mm' | 'ratio' | 'percent' | 'count';

export type SpaceTypeFilter =
  | 'bedroom' | 'living' | 'dining' | 'kitchen' | 'bathroom' | 'toilet'
  | 'corridor' | 'staircase' | 'balcony' | 'utility' | 'pooja' | 'garage'
  | 'lobby' | 'all'; // 'all' means applies to every space type

/**
 * A single entry in the Constraint Knowledge Base.
 * Every entry must be Ayush-approved before it goes active in production.
 */
export interface ConstraintKBEntry {
  id: string;
  domain: ConstraintDomain;
  code: string; // e.g. "NBC-3-4.2.1", "VASTU-NE-TOILET", "ERGO-DOOR-MIN"

  spaceTypes: SpaceTypeFilter[]; // which space types this applies to

  severity: ConstraintSeverity;
  checkType: CheckType;

  // Required for numeric check types (min_area, ratio, etc.)
  thresholdValue?: number;
  thresholdUnit?: ThresholdUnit;

  /**
   * Plain English description shown to architects.
   * Written by Ayush — never auto-generated.
   * E.g. "Bedroom area below NBC minimum of 9.5 m²"
   */
  plainDescription: string;

  /**
   * Hints given to the LLM resolution generator.
   * At least one item required. Shrinks the solution search space.
   * E.g. ["Merge with adjacent room", "Extend into balcony space"]
   */
  resolutionHints: string[];

  /**
   * Array of jurisdictions this applies to.
   * Use 'national' for NBC rules, city names for local bye-laws.
   * E.g. ['national'] or ['mumbai', 'pune', 'nashik']
   */
  jurisdiction: string[];

  /**
   * Exact source reference for traceability.
   * E.g. "NBC 2016 Part 3 Section 4.2.1" or "Maha Vastu §NE-Toilet"
   */
  sourceReference: string;

  /**
   * Must be true before the constraint is active in production.
   * Set by Ayush explicitly after reviewing the entry.
   */
  ayushApproved: boolean;

  active: boolean; // false = soft-disabled, still in DB for audit

  /**
   * Automatically tracked after launch.
   * If > 0.05 (5%), the constraint goes into the review queue.
   */
  falsePositiveRate?: number;

  createdAt: string; // ISO 8601
  updatedAt: string;
}

/**
 * Shape used when inserting a new KB entry (before review cycle).
 * plainDescription is optional here — Ayush fills it.
 */
export type ConstraintKBDraft = Omit<
  ConstraintKBEntry,
  'id' | 'ayushApproved' | 'falsePositiveRate' | 'createdAt' | 'updatedAt'
> & {
  plainDescription?: string;
  ayushApproved: false;
};
