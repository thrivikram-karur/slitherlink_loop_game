import { DIFFICULTY_SETTINGS } from './types';
import type { GridState, Difficulty } from './types';

export function generatePuzzle(difficulty: Difficulty): GridState {
    const { rows, cols, density } = DIFFICULTY_SETTINGS[difficulty];

    // 1. Generate a random closed loop
    // Simple way: Random walk that returns to start, or just a random rectangle/shape
    // Let's use a simpler approach: 
    // - Pick a random set of cells to be "inside" the loop.
    // - The loop is the boundary of these cells.
    // - To ensure it's a single loop, the cells must be connected and have no holes.

    const inside = Array(rows).fill(0).map(() => Array(cols).fill(false));

    // Start with a random cell
    let currR = Math.floor(rows / 2);
    let currC = Math.floor(cols / 2);
    inside[currR][currC] = true;

    const numInside = Math.floor(rows * cols * 0.4); // 40% of cells inside
    let count = 1;
    while (count < numInside) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!inside[r][c]) {
            // Check if adjacent to an inside cell to keep it connected
            let adjacent = false;
            if (r > 0 && inside[r - 1][c]) adjacent = true;
            if (r < rows - 1 && inside[r + 1][c]) adjacent = true;
            if (c > 0 && inside[r][c - 1]) adjacent = true;
            if (c < cols - 1 && inside[r][c + 1]) adjacent = true;

            if (adjacent) {
                inside[r][c] = true;
                count++;
            }
        }
    }

    // 2. Derive cell numbers
    const cells: (number | null)[][] = Array(rows).fill(0).map(() => Array(cols).fill(null));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let edges = 0;
            // Top
            if (isBoundary(r, c, r - 1, c, inside, rows, cols)) edges++;
            // Bottom
            if (isBoundary(r, c, r + 1, c, inside, rows, cols)) edges++;
            // Left
            if (isBoundary(r, c, r, c - 1, inside, rows, cols)) edges++;
            // Right
            if (isBoundary(r, c, r, c + 1, inside, rows, cols)) edges++;

            cells[r][c] = edges;
        }
    }

    // 3. Remove some numbers based on density
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() > density) {
                cells[r][c] = null;
            }
        }
    }

    return {
        rows,
        cols,
        cells,
        horizontalEdges: Array(rows + 1).fill(0).map(() => Array(cols).fill(0)),
        verticalEdges: Array(rows).fill(0).map(() => Array(cols + 1).fill(0)),
    };
}

function isBoundary(r1: number, c1: number, r2: number, c2: number, inside: boolean[][], rows: number, cols: number): boolean {
    const in1 = inside[r1][c1];
    const in2 = (r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols) ? inside[r2][c2] : false;
    return in1 !== in2;
}

export function checkWin(state: GridState): boolean {
    const { rows, cols, cells, horizontalEdges, verticalEdges } = state;

    // 1. Check cell constraints
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const target = cells[r][c];
            if (target === null) continue;

            let count = 0;
            if (horizontalEdges[r][c] === 1) count++;
            if (horizontalEdges[r + 1][c] === 1) count++;
            if (verticalEdges[r][c] === 1) count++;
            if (verticalEdges[r][c + 1] === 1) count++;

            if (count !== target) return false;
        }
    }

    // 2. Check if it's a single closed loop
    let totalEdges = 0;
    let startNode: [number, number] | null = null;

    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            let degree = 0;
            if (c < cols && horizontalEdges[r][c] === 1) degree++;
            if (c > 0 && horizontalEdges[r][c - 1] === 1) degree++;
            if (r < rows && verticalEdges[r][c] === 1) degree++;
            if (r > 0 && verticalEdges[r - 1][c] === 1) degree++;

            if (degree !== 0 && degree !== 2) return false;
            if (degree === 2) {
                totalEdges += 1; // This will count each edge twice eventually
                if (!startNode) startNode = [r, c];
            }
        }
    }

    if (!startNode) return false;

    // Connectivity check
    const visited = new Set<string>();
    const stack: [number, number][] = [startNode];
    while (stack.length > 0) {
        const [r, c] = stack.pop()!;
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        visited.add(key);

        if (c < cols && horizontalEdges[r][c] === 1) stack.push([r, c + 1]);
        if (c > 0 && horizontalEdges[r][c - 1] === 1) stack.push([r, c - 1]);
        if (r < rows && verticalEdges[r][c] === 1) stack.push([r + 1, c]);
        if (r > 0 && verticalEdges[r - 1][c] === 1) stack.push([r - 1, c]);
    }

    // totalEdges is the number of nodes with degree 2.
    // In a single loop, number of nodes = number of edges.
    // visited.size should be equal to totalEdges.
    return visited.size === totalEdges && totalEdges > 0;
}
