import type { EdgeState } from './types';

export function solve(
    rows: number,
    cols: number,
    cells: (number | null)[][],
    findMultiple: boolean = false
): EdgeState[][][] {
    const horizontalEdges: EdgeState[][] = Array(rows + 1)
        .fill(0)
        .map(() => Array(cols).fill(0));
    const verticalEdges: EdgeState[][] = Array(rows)
        .fill(0)
        .map(() => Array(cols + 1).fill(0));

    const solutions: { h: EdgeState[][]; v: EdgeState[][] }[] = [];

    function isCellValid(r: number, c: number): boolean {
        const target = cells[r][c];
        if (target === null) return true;

        let count = 0;
        if (horizontalEdges[r][c] === 1) count++;
        if (horizontalEdges[r + 1][c] === 1) count++;
        if (verticalEdges[r][c] === 1) count++;
        if (verticalEdges[r][c + 1] === 1) count++;

        return count === target;
    }

    function isCellPartiallyValid(r: number, c: number): boolean {
        const target = cells[r][c];
        if (target === null) return true;

        let count = 0;
        let empty = 0;

        // Check horizontal top
        if (horizontalEdges[r][c] === 1) count++;
        else if (horizontalEdges[r][c] === 0) empty++;

        // Check horizontal bottom
        if (horizontalEdges[r + 1][c] === 1) count++;
        else if (horizontalEdges[r + 1][c] === 0) empty++;

        // Check vertical left
        if (verticalEdges[r][c] === 1) count++;
        else if (verticalEdges[r][c] === 0) empty++;

        // Check vertical right
        if (verticalEdges[r][c + 1] === 1) count++;
        else if (verticalEdges[r][c + 1] === 0) empty++;

        if (count > target) return false;
        if (count + empty < target) return false;

        return true;
    }

    function getDegree(r: number, c: number): number {
        let degree = 0;
        if (c < cols && horizontalEdges[r][c] === 1) degree++;
        if (c > 0 && horizontalEdges[r][c - 1] === 1) degree++;
        if (r < rows && verticalEdges[r][c] === 1) degree++;
        if (r > 0 && verticalEdges[r - 1][c] === 1) degree++;
        return degree;
    }

    function isDegreeValid(r: number, c: number): boolean {
        const degree = getDegree(r, c);
        return degree === 0 || degree === 2;
    }

    function isDegreePartiallyValid(r: number, c: number): boolean {
        let degree = 0;
        let empty = 0;

        if (c < cols) {
            if (horizontalEdges[r][c] === 1) degree++;
            else if (horizontalEdges[r][c] === 0) empty++;
        }
        if (c > 0) {
            if (horizontalEdges[r][c - 1] === 1) degree++;
            else if (horizontalEdges[r][c - 1] === 0) empty++;
        }
        if (r < rows) {
            if (verticalEdges[r][c] === 1) degree++;
            else if (verticalEdges[r][c] === 0) empty++;
        }
        if (r > 0) {
            if (verticalEdges[r - 1][c] === 1) degree++;
            else if (verticalEdges[r - 1][c] === 0) empty++;
        }

        if (degree > 2) return false;
        if (degree === 1 && empty === 0) return false;
        return true;
    }

    function checkLoop(): boolean {
        // Find first edge
        let startEdge: { r: number; c: number; type: 'h' | 'v' } | null = null;
        let totalEdges = 0;

        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (horizontalEdges[r][c] === 1) {
                    if (!startEdge) startEdge = { r, c, type: 'h' };
                    totalEdges++;
                }
            }
        }
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c <= cols; c++) {
                if (verticalEdges[r][c] === 1) {
                    if (!startEdge) startEdge = { r, c, type: 'v' };
                    totalEdges++;
                }
            }
        }

        if (totalEdges === 0) return false;

        // Traverse loop
        let currentPos = startEdge!.type === 'h' ? { r: startEdge!.r, c: startEdge!.c } : { r: startEdge!.r, c: startEdge!.c };
        let visitedCount = 0;
        let currR = startEdge!.r;
        let currC = startEdge!.c;
        let prevR = -1;
        let prevC = -1;

        // This is a bit complex to implement correctly in a few lines.
        // Let's use a simpler check: all nodes must have degree 0 or 2, and it must be connected.
        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                if (getDegree(r, c) !== 0 && getDegree(r, c) !== 2) return false;
            }
        }

        // Connectivity check
        const visited = new Set<string>();
        const stack: string[] = [];

        // Find first node with degree 2
        let startNode = "";
        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                if (getDegree(r, c) === 2) {
                    startNode = `${r},${c}`;
                    break;
                }
            }
            if (startNode) break;
        }

        if (!startNode) return false;

        stack.push(startNode);
        while (stack.length > 0) {
            const node = stack.pop()!;
            if (visited.has(node)) continue;
            visited.add(node);

            const [r, c] = node.split(',').map(Number);
            // Neighbors
            if (c < cols && horizontalEdges[r][c] === 1) stack.push(`${r},${c + 1}`);
            if (c > 0 && horizontalEdges[r][c - 1] === 1) stack.push(`${r},${c - 1}`);
            if (r < rows && verticalEdges[r][c] === 1) stack.push(`${r + 1},${c}`);
            if (r > 0 && verticalEdges[r - 1][c] === 1) stack.push(`${r - 1},${c}`);
        }

        // Check if all edges are visited
        let visitedEdges = 0;
        for (const node of visited) {
            const [r, c] = node.split(',').map(Number);
            if (c < cols && horizontalEdges[r][c] === 1) visitedEdges++;
            if (c > 0 && horizontalEdges[r][c - 1] === 1) visitedEdges++;
            if (r < rows && verticalEdges[r][c] === 1) visitedEdges++;
            if (r > 0 && verticalEdges[r - 1][c] === 1) visitedEdges++;
        }
        // Each edge is counted twice (once for each endpoint)
        return visitedEdges === totalEdges * 2;
    }

    function backtrack(edgeIdx: number): boolean {
        if (solutions.length > 1 && findMultiple) return true;

        const totalH = (rows + 1) * cols;
        const totalV = rows * (cols + 1);

        if (edgeIdx === totalH + totalV) {
            // Check all constraints
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (!isCellValid(r, c)) return false;
                }
            }
            if (checkLoop()) {
                solutions.push({
                    h: horizontalEdges.map(row => [...row]),
                    v: verticalEdges.map(row => [...row])
                });
                return solutions.length > 1 && findMultiple;
            }
            return false;
        }

        // Try state 1 (drawn) then 2 (X)
        // To optimize, we can try to prune
        const isH = edgeIdx < totalH;
        const r = isH ? Math.floor(edgeIdx / cols) : Math.floor((edgeIdx - totalH) / (cols + 1));
        const c = isH ? edgeIdx % cols : (edgeIdx - totalH) % (cols + 1);

        for (const state of [1, 2] as EdgeState[]) {
            if (isH) horizontalEdges[r][c] = state;
            else verticalEdges[r][c] = state;

            // Pruning
            let possible = true;
            // Check affected cells
            if (isH) {
                if (r > 0 && !isCellPartiallyValid(r - 1, c)) possible = false;
                if (r < rows && !isCellPartiallyValid(r, c)) possible = false;
            } else {
                if (c > 0 && !isCellPartiallyValid(r, c - 1)) possible = false;
                if (c < cols && !isCellPartiallyValid(r, c)) possible = false;
            }

            // Check affected nodes
            if (possible) {
                if (isH) {
                    if (!isDegreePartiallyValid(r, c)) possible = false;
                    if (!isDegreePartiallyValid(r, c + 1)) possible = false;
                } else {
                    if (!isDegreePartiallyValid(r, c)) possible = false;
                    if (!isDegreePartiallyValid(r + 1, c)) possible = false;
                }
            }

            if (possible) {
                if (backtrack(edgeIdx + 1)) return true;
            }

            // Reset
            if (isH) horizontalEdges[r][c] = 0;
            else verticalEdges[r][c] = 0;
        }

        return false;
    }

    // Actually, full backtracking is too slow for 5x5.
    // I should use a more efficient approach for generation.
    // For now, let's keep it but I might need to optimize.
    // backtrack(0);
    return []; // Placeholder
}
