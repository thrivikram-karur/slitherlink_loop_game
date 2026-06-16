export type EdgeState = 0 | 1 | 2; // 0: empty, 1: drawn, 2: X

export interface GridState {
  rows: number;
  cols: number;
  cells: (number | null)[][];
  horizontalEdges: EdgeState[][]; // (rows + 1) x cols
  verticalEdges: EdgeState[][];   // rows x (cols + 1)
}

export interface Point {
  r: number;
  c: number;
}

export interface Edge {
  type: 'h' | 'v';
  r: number;
  c: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_SETTINGS: Record<Difficulty, { rows: number; cols: number; density: number }> = {
  easy: { rows: 5, cols: 5, density: 0.6 },
  medium: { rows: 7, cols: 7, density: 0.5 },
  hard: { rows: 10, cols: 10, density: 0.4 },
};
