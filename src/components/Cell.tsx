import React from 'react';

interface CellProps {
    number: number | null;
}

const Cell: React.FC<CellProps> = ({ number }) => {
    return (
        <div className="cell">
            {number !== null ? number : ''}
        </div>
    );
};

export default Cell;
