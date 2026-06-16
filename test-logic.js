import { checkWin } from './src/logic/generator.js';

const mockState = {
    rows: 2,
    cols: 2,
    cells: [
        [2, null],
        [null, 2]
    ],
    horizontalEdges: [
        [1, 0],
        [1, 0],
        [0, 0]
    ],
    verticalEdges: [
        [1, 1],
        [1, 1]
    ]
};

// This is not a valid loop, just testing the function call
try {
    const isWin = checkWin(mockState);
    console.log('CheckWin result:', isWin);
} catch (e) {
    console.error('CheckWin failed:', e);
}
