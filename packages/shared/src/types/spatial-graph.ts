// ─────────────────────────────────────────────────────────────────────────────
// SpatiumAI — Spatial Graph Types
// Represents the parsed geometric + spatial data extracted from a DXF/IFC file.
// This is the core data structure passed between the parser service, worker,
// and constraint evaluation engine.
// ─────────────────────────────────────────────────────────────────────────────

export type SpaceType =
  | 'bedroom'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'bathroom'
  | 'toilet'
  | 'corridor'
  | 'staircase'
  | 'balcony'
  | 'study'
  | 'utility'
  | 'pooja'
  | 'garage'
  | 'lobby'
  | 'store'
  | 'unknown';

export type WallType = 'exterior' | 'interior' | 'partition' | 'structural';

export type OpeningType = 'door' | 'window' | 'opening' | 'sliding_door' | 'french_door';

export type FacingDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export type FileFormat = 'dxf' | 'dxf_dwg' | 'ifc' | 'pdf' | 'image';

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  min: Point2D;
  max: Point2D;
  widthM: number;
  heightM: number;
}

/**
 * A single room/space extracted from the floor plan.
 * `polygon` contains the ordered vertices of the room boundary in metres.
 */
export interface Room {
  id: string;
  label: string; // As labelled in the original drawing, e.g. "BED-1"
  spaceType: SpaceType;
  areaSqm: number;
  boundingBox: BoundingBox;
  polygon: Point2D[]; // ordered boundary vertices
  centroid: Point2D;
  facingDirection?: FacingDirection | undefined; // primary window/opening direction
  floorLevel: number; // 0 = ground, 1 = first, etc.
  windowCount: number;
  doorCount: number;
  windowAreaSqm: number; // total glazed area, for daylight ratio checks
}

/**
 * A wall segment. May be shared between two rooms.
 */
export interface Wall {
  id: string;
  type: WallType;
  start: Point2D;
  end: Point2D;
  lengthM: number;
  thicknessMm: number;
  heightMm?: number | undefined;
  /** [leftRoom, rightRoom] — null if exterior */
  adjacentRooms: [string | null, string | null];
  floorLevel: number;
}

/**
 * A door, window, or other opening in a wall.
 */
export interface Opening {
  id: string;
  type: OpeningType;
  wallId: string;
  widthMm: number;
  heightMm?: number | undefined;
  sillHeightMm?: number | undefined;
  position: Point2D; // centroid on the wall
  facingDirection?: FacingDirection | undefined;
  /** Rooms the opening connects — null means exterior */
  connectsRooms: [string | null, string | null];
}

/**
 * Spatial relationship between two adjacent rooms.
 */
export interface AdjacencyEntry {
  roomAId: string;
  roomBId: string;
  sharedWallLengthM: number;
  hasDirectDoor: boolean; // direct door connecting the two rooms
}

/**
 * The complete spatial graph output from the parser service.
 * This is returned by POST /parse and stored as JSONB in the evaluations table.
 */
export interface SpatialGraph {
  version: '1.0';
  sourceFile: string;
  parseTimestamp: string; // ISO 8601
  totalAreaSqm: number;
  floorCount: number;
  rooms: Room[];
  walls: Wall[];
  openings: Opening[];
  adjacencies: AdjacencyEntry[];
  metadata: {
    parserVersion: string;
    fileFormat: FileFormat;
    unitSystem: 'metric' | 'imperial';
    coordinateSystem?: string | undefined;
    warnings: string[]; // non-fatal parsing issues
  };
}
