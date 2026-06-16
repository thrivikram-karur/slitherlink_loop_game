import React from 'react';
import Cell from './Cell';
import Edge from './Edge';
import type { GridState } from '../logic/types';

interface GridProps {
    state: GridState;
    onEdgeClick: (type: 'h' | 'v', r: number, c: number) => void;
    onEdgeRightClick: (type: 'h' | 'v', r: number, c: number) => void;
}

const Grid: React.FC<GridProps> = ({ state, onEdgeClick, onEdgeRightClick }) => {
    const { rows, cols, cells, horizontalEdges, verticalEdges } = state;

    const dots = [];
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            dots.push(
                <div
                    key={`dot-${r}-${c}`}
                    className="dot"
                    style={{ top: `${r * 60}px`, left: `${c * 60}px`, transform: 'translate(-50%, -50%)' }}
                />
            );
        }
    }

    const hEdges = [];
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c < cols; c++) {
            hEdges.push(
                <Edge
                    key={`h-${r}-${c}`}
                    type="h"
                    r={r}
                    c={c}
                    state={horizontalEdges[r][c]}
                    onClick={() => onEdgeClick('h', r, c)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        onEdgeRightClick('h', r, c);
                    }}
                />
            );
        }
    }

    const vEdges = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= cols; c++) {
            vEdges.push(
                <Edge
                    key={`v-${r}-${c}`}
                    type="v"
                    r={r}
                    c={c}
                    state={verticalEdges[r][c]}
                    onClick={() => onEdgeClick('v', r, c)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        onEdgeRightClick('v', r, c);
                    }}
                />
            );
        }
    }

    return (
        <div className="grid-container">
            <div
                className="grid"
                style={{
                    width: `${cols * 60}px`,
                    height: `${rows * 60}px`,
                    gridTemplateColumns: `repeat(${cols}, 60px)`,
                    gridTemplateRows: `repeat(${rows}, 60px)`,
                }}
            >
                {cells.map((row, r) =>
                    row.map((num, c) => <Cell key={`cell-${r}-${c}`} number={num} />)
                )}
                {dots}
                {hEdges}
                {vEdges}
            </div>
        </div>
    );
};

export default Grid;
