import type { Placement, PlacementItem, PlacementResult, Shelf } from './types';

type Candidate = { x:number; y:number; rotation:0|90; width:number; height:number; shape: PlacementItem['shape'] };

const areaOf = (item: PlacementItem) => item.shape === 'circle'
  ? Math.PI * (item.width / 2) * (item.width / 2)
  : item.width * item.height;

const candidatesFor = (item: PlacementItem, shelf: Shelf): Candidate[] => {
  const rotations: (0|90)[] = item.shape === 'rect' && item.allowRotation !== false && item.width !== item.height ? [0, 90] : [0];
  return rotations.map(rotation => ({
    x: 0,
    y: 0,
    rotation,
    width: rotation === 90 ? item.height : item.width,
    height: rotation === 90 ? item.width : item.height,
    shape: item.shape,
  })).filter(c => c.width + 2 * shelf.clearance <= shelf.width && c.height + 2 * shelf.clearance <= shelf.height);
};

const bounds = (p: Placement, clearance: number) => ({
  left: p.x - clearance,
  right: p.x + p.width + clearance,
  top: p.y - clearance,
  bottom: p.y + p.height + clearance,
});

const overlap = (a: Placement, b: Placement, clearance: number) => {
  if (a.shape === 'rect' && b.shape === 'rect') {
    const A = bounds(a, clearance), B = bounds(b, clearance);
    return A.left < B.right && A.right > B.left && A.top < B.bottom && A.bottom > B.top;
  }
  const ax = a.x + a.width / 2, ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2, by = b.y + b.height / 2;
  const ar = a.shape === 'circle' ? a.width / 2 : Math.min(a.width, a.height) / 2;
  const br = b.shape === 'circle' ? b.width / 2 : Math.min(b.width, b.height) / 2;
  return Math.hypot(ax - bx, ay - by) < ar + br + clearance;
};

const valid = (candidate: Candidate, placed: Placement[], shelf: Shelf) => {
  if (candidate.x < shelf.clearance || candidate.y < shelf.clearance) return false;
  if (candidate.x + candidate.width + shelf.clearance > shelf.width) return false;
  if (candidate.y + candidate.height + shelf.clearance > shelf.height) return false;
  const p: Placement = { ...candidate, id: '__candidate__', allowRotation: true };
  return !placed.some(existing => overlap(p, existing, shelf.clearance));
};

/** Deterministic bottom-left packer. It prefers dense layouts and evaluates rotation. */
export function packShelf(items: PlacementItem[], shelf: Shelf): PlacementResult {
  const ordered = [...items].sort((a, b) => areaOf(b) - areaOf(a) || b.width - a.width || a.id.localeCompare(b.id));
  const placements: Placement[] = [];
  const unplaced: PlacementItem[] = [];

  for (const item of ordered) {
    const candidates = candidatesFor(item, shelf);
    let best: Placement | null = null;
    for (const c of candidates) {
      const points = new Set<string>(['0,0']);
      for (const p of placements) {
        points.add(`${p.x + p.width + shelf.clearance},${p.y}`);
        points.add(`${p.x},${p.y + p.height + shelf.clearance}`);
      }
      for (const key of points) {
        const [x, y] = key.split(',').map(Number);
        const candidate = { ...c, x, y };
        if (!valid(candidate, placements, shelf)) continue;
        const placed: Placement = { ...candidate, id: item.id, shape: item.shape, allowRotation: item.allowRotation };
        if (!best || placed.y < best.y || (placed.y === best.y && placed.x < best.x)) best = placed;
      }
    }
    if (best) placements.push(best); else unplaced.push(item);
  }

  const usedArea = placements.reduce((sum, p) => sum + areaOf(p), 0);
  return { placements, unplaced, usedArea, utilization: usedArea / (shelf.width * shelf.height) };
}
