import React from 'react';
import type { EdgeState } from '../logic/types';

interface EdgeProps {
    type: 'h' | 'v';
    r: number;
    c: number;
    state: EdgeState;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

const Edge: React.FC<EdgeProps> = ({ type, r, c, state, onClick, onContextMenu }) => {
    const style: React.CSSProperties = {
        top: type === 'h' ? `${r * 60}px` : `${r * 60 + 6}px`,
        left: type === 'h' ? `${c * 60 + 6}px` : `${c * 60}px`,
    };

    return (
        <div
            className={`edge edge-${type} edge-state-${state}`}
            style={style}
            onClick={onClick}
            onContextMenu={onContextMenu}
        />
    );
};

export default Edge;
