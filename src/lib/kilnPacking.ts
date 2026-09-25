export type PackingShape = 'circle' | 'rectangle';

export type PackingItem = {
  id: string;
  shape: PackingShape;
  width: number;
  depth: number;
  quantity?: number;
};

export type PackedItem = PackingItem & { x: number; y: number };

export type ShelfPlan = {
  width: number;
  depth: number;
  clearance: number;
  placements: PackedItem[];
  filledArea: number;
  utilization: number;
  remainingArea: number;
};

const EPS = 1e-7;

function area(item: PackingItem): number {
  return item.shape === 'circle'
    ? Math.PI * (item.width / 2) ** 2
    : item.width * item.depth;
}

function radius(item: PackingItem): number {
  return Math.max(item.width, item.depth) / 2;
}

function footprint(item: PackingItem, clearance: number) {
  if (item.shape === 'circle') {
    const r = item.width / 2 + clearance / 2;
    return { width: r * 2, depth: r * 2 };
  }
  return { width: item.width + clearance, depth: item.depth + clearance };
}

function overlaps(a: PackedItem, b: PackedItem, clearance: number): boolean {
  if (a.shape === 'circle' && b.shape === 'circle') {
    const ra = a.width / 2 + clearance / 2;
    const rb = b.width / 2 + clearance / 2;
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy < (ra + rb) ** 2 - EPS;
  }

  if (a.shape === 'rectangle' && b.shape === 'rectangle') {
    const ax = a.width / 2 + clearance / 2;
    const ay = a.depth / 2 + clearance / 2;
    const bx = b.width / 2 + clearance / 2;
    const by = b.depth / 2 + clearance / 2;
    return Math.abs(a.x - b.x) < ax + bx - EPS && Math.abs(a.y - b.y) < ay + by - EPS;
  }

  const circle = a.shape === 'circle' ? a : b;
  const rect = a.shape === 'rectangle' ? a : b;
  const r = circle.width / 2 + clearance / 2;
  const hw = rect.width / 2 + clearance / 2;
  const hd = rect.depth / 2 + clearance / 2;
  const nearestX = Math.max(rect.x - hw, Math.min(circle.x, rect.x + hw));
  const nearestY = Math.max(rect.y - hd, Math.min(circle.y, rect.y + hd));
  const dx = circle.x - nearestX;
  const dy = circle.y - nearestY;
  return dx * dx + dy * dy < r * r - EPS;
}

function inside(item: PackedItem, shelf: Pick<ShelfPlan, 'width' | 'depth'>, clearance: number): boolean {
  const fp = footprint(item, clearance);
  return item.x - fp.width / 2 >= -EPS &&
    item.y - fp.depth / 2 >= -EPS &&
    item.x + fp.width / 2 <= shelf.width + EPS &&
    item.y + fp.depth / 2 <= shelf.depth + EPS;
}

function candidatePoints(shelf: ShelfPlan, item: PackingItem): Array<{ x: number; y: number }> {
  const fp = footprint(item, shelf.clearance);
  const points = [
    { x: fp.width / 2, y: fp.depth / 2 },
    { x: shelf.width - fp.width / 2, y: fp.depth / 2 },
    { x: fp.width / 2, y: shelf.depth - fp.depth / 2 },
    { x: shelf.width - fp.width / 2, y: shelf.depth - fp.depth / 2 },
  ];
  for (const p of shelf.placements) {
    const q = footprint(p, shelf.clearance);
    points.push(
      { x: p.x + q.width / 2 + fp.width / 2, y: p.y },
      { x: p.x - q.width / 2 - fp.width / 2, y: p.y },
      { x: p.x, y: p.y + q.depth / 2 + fp.depth / 2 },
      { x: p.x, y: p.y - q.depth / 2 - fp.depth / 2 },
    );
  }
  return points;
}

function compactnessScore(shelf: ShelfPlan, p: PackedItem): number {
  const edge = Math.min(p.x, shelf.width - p.x, p.y, shelf.depth - p.y);
  let nearest = Math.min(shelf.width, shelf.depth);
  for (const other of shelf.placements) {
    const dx = p.x - other.x;
    const dy = p.y - other.y;
    nearest = Math.min(nearest, Math.hypot(dx, dy));
  }
  return edge * 0.35 + nearest * 0.65;
}

function placeOne(shelf: ShelfPlan, item: PackingItem): boolean {
  const candidates = candidatePoints(shelf, item)
    .filter(p => {
      const test = { ...item, x: p.x, y: p.y };
      return inside(test, shelf, shelf.clearance) && shelf.placements.every(existing => !overlaps(test, existing, shelf.clearance));
    })
    .sort((a, b) => {
      const pa = { ...item, x: a.x, y: a.y };
      const pb = { ...item, x: b.x, y: b.y };
      return compactnessScore(shelf, pa) - compactnessScore(shelf, pb);
    });

  const chosen = candidates[0];
  if (!chosen) return false;
  shelf.placements.push({ ...item, x: chosen.x, y: chosen.y });
  return true;
}

function expand(items: PackingItem[]): PackingItem[] {
  const result: PackingItem[] = [];
  for (const item of items) {
    const quantity = Math.max(0, Math.floor(item.quantity ?? 1));
    for (let i = 0; i < quantity; i++) result.push({ ...item, id: `${item.id}#${i + 1}`, quantity: 1 });
  }
  return result;
}

function score(plan: ShelfPlan): number {
  const count = plan.placements.length;
  const deadArea = plan.remainingArea;
  return count * 1_000_000 + plan.utilization * 1_000 - deadArea;
}

/**
 * Deterministic multi-start shelf packing. It never returns overlapping or
 * out-of-bounds placements. The best plan is selected by count first, then
 * utilization, then remaining dead area.
 */
export function packShelf(width: number, depth: number, clearance: number, source: PackingItem[]): ShelfPlan {
  if (width <= 0 || depth <= 0) throw new Error('Shelf dimensions must be positive');
  if (clearance < 0) throw new Error('Clearance cannot be negative');

  const items = expand(source).sort((a, b) => {
    const af = footprint(a, clearance);
    const bf = footprint(b, clearance);
    return (bf.width * bf.depth) - (af.width * af.depth);
  });

  const orders = [
    items,
    [...items].reverse(),
    [...items].sort((a, b) => radius(b) - radius(a)),
    [...items].sort((a, b) => area(b) - area(a)),
  ];

  let best: ShelfPlan | null = null;
  for (const order of orders) {
    const plan: ShelfPlan = { width, depth, clearance, placements: [], filledArea: 0, utilization: 0, remainingArea: width * depth };
    for (const item of order) placeOne(plan, item);
    plan.filledArea = plan.placements.reduce((sum, item) => sum + area(item), 0);
    plan.utilization = plan.filledArea / (width * depth);
    plan.remainingArea = Math.max(0, width * depth - plan.filledArea);
    if (!best || score(plan) > score(best)) best = plan;
  }

  return best!;
}
