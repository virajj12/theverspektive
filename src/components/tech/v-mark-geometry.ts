/**
 * Geometry for the 3D V-mark, derived from the REAL VerspeKtive logomark.
 *
 * Source: public/VB-01.svg
 *   viewBox 0 0 1000 1000
 *   <g transform="translate(10.984854, 10.984854)">
 *   <path d="M167.303,167.303 L489.015,810.727 L810.727,167.303 Z" />
 *
 * NOTE FOR ART DIRECTION (spec 5): the mark is a single SOLID triangular wedge,
 * not the "two intersecting strokes/blades" the spec assumed. To honour the
 * spec's two-state concept without inventing a mark that doesn't exist, the
 * wedge is split down its axis of symmetry into a left and a right blade.
 * Viewed head-on and at rest the two blades read as the exact logomark; they
 * only separate when a track is selected.
 */

// Raw SVG points with the group transform applied.
const T = 10.984854;
const RAW = {
  topLeft: [167.303 + T, 167.303 + T],
  apex: [489.015 + T, 810.727 + T],
  topRight: [810.727 + T, 167.303 + T],
} as const;

/**
 * SVG space is y-down and 0..1000; three.js is y-up and we want the mark
 * centred on the origin at roughly unit scale.
 */
function toLocal([x, y]: readonly [number, number]): [number, number] {
  return [(x - 500) / 500, -(y - 500) / 500];
}

export const TOP_LEFT = toLocal(RAW.topLeft);
export const APEX = toLocal(RAW.apex);
export const TOP_RIGHT = toLocal(RAW.topRight);

/** Midpoint of the top edge — the seam the wedge splits along. */
export const TOP_MID: [number, number] = [0, TOP_LEFT[1]];

/** Depth of the extrusion. Keeps the blades volumetric, not a flat logo. */
export const BLADE_DEPTH = 0.28;

export type Pt = [number, number];

/** The left blade: outer top-left corner → seam → apex. */
export const LEFT_BLADE: Pt[] = [TOP_LEFT, TOP_MID, APEX];

/** The right blade: seam → outer top-right corner → apex. */
export const RIGHT_BLADE: Pt[] = [TOP_MID, TOP_RIGHT, APEX];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

/**
 * Slice the left blade into horizontal bands for the "personal brands"
 * fragment state (spec 5). Each band is its own small extruded piece that
 * drifts outward, so the blade appears to come apart into shards rather than
 * simply moving away.
 *
 * The blade is a triangle with a vertical seam edge (TOP_MID → APEX) and an
 * outer edge (TOP_LEFT → APEX). Cutting at constant t along both edges yields
 * quads that tile the triangle exactly, with no gaps or overlap.
 */
export function buildLeftShards(count: number): Pt[][] {
  const shards: Pt[][] = [];
  for (let i = 0; i < count; i++) {
    const t0 = i / count;
    const t1 = (i + 1) / count;

    const outerA = lerpPt(TOP_LEFT, APEX, t0);
    const outerB = lerpPt(TOP_LEFT, APEX, t1);
    const seamA = lerpPt(TOP_MID, APEX, t0);
    const seamB = lerpPt(TOP_MID, APEX, t1);

    // Wound consistently so the extrusion faces the same way on every shard.
    shards.push([outerA, seamA, seamB, outerB]);
  }
  return shards;
}

/** Centroid of a polygon — used as the origin each shard pushes away from. */
export function centroid(pts: Pt[]): Pt {
  const sx = pts.reduce((s, p) => s + p[0], 0);
  const sy = pts.reduce((s, p) => s + p[1], 0);
  return [sx / pts.length, sy / pts.length];
}

/**
 * The clean architectural block the RIGHT blade resolves into for the
 * "businesses" state (spec 5: "solidifies into a clean architectural block —
 * reads as structure/reliability"). Sized to the blade's own bounding box so
 * the transition reads as the same mass squaring up, not a new object.
 */
export const BLOCK = {
  width: Math.abs(TOP_RIGHT[0] - TOP_MID[0]),
  height: Math.abs(TOP_RIGHT[1] - APEX[1]),
  depth: BLADE_DEPTH,
  /** Centre of the block in blade-local space. */
  center: [
    (TOP_MID[0] + TOP_RIGHT[0]) / 2,
    (TOP_RIGHT[1] + APEX[1]) / 2,
  ] as Pt,
};
