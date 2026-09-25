export type PlacementShape = 'circle' | 'rect';

export type PlacementItem = {
  id: string;
  shape: PlacementShape;
  width: number;
  height: number;
  allowRotation?: boolean;
};

export type Placement = PlacementItem & {
  x: number;
  y: number;
  rotation: 0 | 90;
};

export type Shelf = {
  width: number;
  height: number;
  clearance: number;
};

export type PlacementResult = {
  placements: Placement[];
  unplaced: PlacementItem[];
  usedArea: number;
  utilization: number;
};
