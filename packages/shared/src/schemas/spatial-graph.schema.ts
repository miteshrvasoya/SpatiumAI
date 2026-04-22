// ─────────────────────────────────────────────────────────────────────────────
// SpatiumAI — Zod Schemas for Spatial Graph
// Runtime validation of parser output before it enters the evaluation engine.
// ─────────────────────────────────────────────────────────────────────────────
import { z } from 'zod';

export const Point2DSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const BoundingBoxSchema = z.object({
  min: Point2DSchema,
  max: Point2DSchema,
  widthM: z.number().nonnegative(),
  heightM: z.number().nonnegative(),
});

export const SpaceTypeSchema = z.enum([
  'bedroom', 'living', 'dining', 'kitchen', 'bathroom', 'toilet',
  'corridor', 'staircase', 'balcony', 'study', 'utility', 'pooja',
  'garage', 'lobby', 'store', 'unknown',
]);

export const FacingDirectionSchema = z.enum(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']);

export const RoomSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  spaceType: SpaceTypeSchema,
  areaSqm: z.number().nonnegative(),
  boundingBox: BoundingBoxSchema,
  polygon: z.array(Point2DSchema).min(3),
  centroid: Point2DSchema,
  facingDirection: FacingDirectionSchema.optional(),
  floorLevel: z.number().int().min(0),
  windowCount: z.number().int().nonnegative(),
  doorCount: z.number().int().nonnegative(),
  windowAreaSqm: z.number().nonnegative(),
});

export const WallSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['exterior', 'interior', 'partition', 'structural']),
  start: Point2DSchema,
  end: Point2DSchema,
  lengthM: z.number().positive(),
  thicknessMm: z.number().positive(),
  heightMm: z.number().positive().optional(),
  adjacentRooms: z.tuple([z.string().nullable(), z.string().nullable()]),
  floorLevel: z.number().int().min(0),
});

export const OpeningSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['door', 'window', 'opening', 'sliding_door', 'french_door']),
  wallId: z.string().min(1),
  widthMm: z.number().positive(),
  heightMm: z.number().positive().optional(),
  sillHeightMm: z.number().nonnegative().optional(),
  position: Point2DSchema,
  facingDirection: FacingDirectionSchema.optional(),
  connectsRooms: z.tuple([z.string().nullable(), z.string().nullable()]),
});

export const AdjacencyEntrySchema = z.object({
  roomAId: z.string().min(1),
  roomBId: z.string().min(1),
  sharedWallLengthM: z.number().nonnegative(),
  hasDirectDoor: z.boolean(),
});

export const SpatialGraphSchema = z.object({
  version: z.literal('1.0'),
  sourceFile: z.string(),
  parseTimestamp: z.string().datetime(),
  totalAreaSqm: z.number().nonnegative(),
  floorCount: z.number().int().positive(),
  rooms: z.array(RoomSchema).min(1),
  walls: z.array(WallSchema),
  openings: z.array(OpeningSchema),
  adjacencies: z.array(AdjacencyEntrySchema),
  metadata: z.object({
    parserVersion: z.string(),
    fileFormat: z.enum(['dxf', 'dxf_dwg', 'ifc', 'pdf', 'image']),
    unitSystem: z.enum(['metric', 'imperial']),
    coordinateSystem: z.string().optional(),
    warnings: z.array(z.string()),
  }),
});

export type SpatialGraph = z.infer<typeof SpatialGraphSchema>;
