// Tiny 2D physics for falling, piling stars: Verlet integration, circle bodies,
// and a box with an open top. Positions are in CSS pixels within the field.

export type Body = {
  id: string;
  x: number;
  y: number;
  px: number; // previous position (Verlet: velocity = x - px)
  py: number;
  angle: number; // radians, for drawing
  r: number; // collision radius; slightly varied so piles don't form a perfect lattice
};

export type Walls = {
  left: number; // inner wall x
  right: number;
  bottom: number; // inner floor y
};

export const RADIUS = 9.5;

const GRAVITY = 0.22; // px per substep²
const DAMPING = 0.992;
const SUBSTEPS = 2;
const ITERATIONS = 5;
const WALL_FRICTION = 0.85; // keeps piles from sliding forever
const WALL_BOUNCE = 0.45; // fraction of speed kept when hitting the floor/walls
const STAR_BOUNCE = 0.3; // ...and when landing on another star
const BOUNCE_MIN_SPEED = 0.6; // slower impacts just settle (no endless jitter)
// Upward speed cap (px per substep). A normal landing bounce or a tap's hop
// stays under it; overlap corrections can't launch a star sky-high.
const MAX_UP_SPEED = 3.5;
const REST_THRESHOLD = 0.06; // px per frame; below this any leftover jitter is invisible

export function makeBody(id: string, x: number, y: number, angle: number, r = RADIUS): Body {
  return { id, x, y, px: x, py: y, angle, r };
}

/** Lowest y at or above `y` where a star of radius r at x overlaps nothing. */
export function clearSpawnY(bodies: Body[], x: number, y: number, r: number): number {
  for (let guard = 0; guard < bodies.length + 1; guard++) {
    const hit = bodies.find((b) => Math.hypot(b.x - x, b.y - y) < b.r + r);
    if (!hit) return y;
    // Sit just above the star we'd overlap
    const dx = x - hit.x;
    const gap = (hit.r + r + 0.5) ** 2 - dx * dx;
    y = hit.y - Math.sqrt(Math.max(gap, 0));
  }
  return y;
}

/** Upward kick, as if the star was tapped. */
export function hop(b: Body, strength = 3.2) {
  b.py = b.y + strength;
  b.px = b.x + (Math.random() - 0.5) * 0.8;
}

// In Verlet, velocity is (x - px). Bouncing means moving the previous position
// so that, after the position is clamped, the velocity points back out.

function collideWalls(b: Body, w: Walls) {
  const left = w.left + b.r;
  const right = w.right - b.r;
  const floor = w.bottom - b.r;

  if (b.x < left || b.x > right) {
    const vx = b.x - b.px;
    b.x = b.x < left ? left : right;
    b.px = Math.abs(vx) > BOUNCE_MIN_SPEED ? b.x + vx * WALL_BOUNCE : b.x;
    b.py += (b.y - b.py) * (1 - WALL_FRICTION);
  }
  if (b.y > floor) {
    const vy = b.y - b.py;
    b.y = floor;
    b.py = vy > BOUNCE_MIN_SPEED ? b.y + vy * WALL_BOUNCE : b.y;
    b.px += (b.x - b.px) * (1 - WALL_FRICTION);
  }
}

/** Separate overlapping stars; on the first pass, also bounce ones that are approaching. */
function collidePairs(bodies: Body[], bounce: boolean) {
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i];
    for (let j = i + 1; j < bodies.length; j++) {
      const b = bodies[j];
      const min = a.r + b.r;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= min * min || d2 === 0) continue;
      const d = Math.sqrt(d2);
      const nx = dx / d;
      const ny = dy / d;

      const push = (min - d) / 2;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;

      if (!bounce) continue;
      // Closing speed along the line between them (negative = approaching)
      let avx = a.x - a.px;
      let avy = a.y - a.py;
      let bvx = b.x - b.px;
      let bvy = b.y - b.py;
      const vn = (bvx - avx) * nx + (bvy - avy) * ny;
      if (vn >= -BOUNCE_MIN_SPEED) continue;
      const impulse = (-(1 + STAR_BOUNCE) * vn) / 2;
      avx -= impulse * nx;
      avy -= impulse * ny;
      bvx += impulse * nx;
      bvy += impulse * ny;
      a.px = a.x - avx;
      a.py = a.y - avy;
      b.px = b.x - bvx;
      b.py = b.y - bvy;
    }
  }
}

/** Advance one frame. Returns true while anything is still moving. */
export function step(bodies: Body[], walls: Walls): boolean {
  let motion = 0;
  for (let s = 0; s < SUBSTEPS; s++) {
    for (const b of bodies) {
      const vx = (b.x - b.px) * DAMPING;
      const vy = (b.y - b.py) * DAMPING;
      b.px = b.x;
      b.py = b.y;
      b.x += vx;
      b.y += vy + GRAVITY;
    }
    for (let k = 0; k < ITERATIONS; k++) {
      collidePairs(bodies, k === 0);
      for (const b of bodies) collideWalls(b, walls);
    }
  }
  for (const b of bodies) {
    if (b.py - b.y > MAX_UP_SPEED) b.py = b.y + MAX_UP_SPEED;
    const vx = b.x - b.px;
    const vy = b.y - b.py;
    // Roll a little as they move sideways
    b.angle += (vx / b.r) * 0.7;
    motion = Math.max(motion, Math.abs(vx) + Math.abs(vy));
  }
  return motion > REST_THRESHOLD;
}
