import React, { useState, useEffect, useCallback } from 'react';
import Grid from './Grid';
import type { GridState, Difficulty, EdgeState } from '../logic/types';
import { generatePuzzle, checkWin } from '../logic/generator';
import { Trophy, RotateCcw, Play, Pause, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const SlitherlinkGame: React.FC = () => {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [gridState, setGridState] = useState<GridState | null>(null);
    const [timer, setTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const startNewGame = useCallback((diff: Difficulty = difficulty) => {
        const newGrid = generatePuzzle(diff);
        setGridState(newGrid);
        setDifficulty(diff);
        setTimer(0);
        setIsPaused(false);
        setGameWon(false);
    }, [difficulty]);

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        let interval: any;
        if (!isPaused && !gameWon && gridState) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused, gameWon, gridState]);

    const handleEdgeClick = (type: 'h' | 'v', r: number, c: number) => {
        if (gameWon || isPaused || !gridState) return;

        const newState = { ...gridState };
        if (type === 'h') {
            newState.horizontalEdges[r][c] = ((newState.horizontalEdges[r][c] + 1) % 3) as EdgeState;
        } else {
            newState.verticalEdges[r][c] = ((newState.verticalEdges[r][c] + 1) % 3) as EdgeState;
        }

        setGridState(newState);

        if (checkWin(newState)) {
            setGameWon(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#38bdf8', '#818cf8', '#f8fafc']
            });
        }
    };

    const handleEdgeRightClick = (type: 'h' | 'v', r: number, c: number) => {
        if (gameWon || isPaused || !gridState) return;

        const newState = { ...gridState };
        if (type === 'h') {
            // Cycle: empty -> X -> drawn -> empty
            // But user asked for: click again to mark as X, third time undo.
            // Let's make right click specifically for X.
            newState.horizontalEdges[r][c] = newState.horizontalEdges[r][c] === 2 ? 0 : 2;
        } else {
            newState.verticalEdges[r][c] = newState.verticalEdges[r][c] === 2 ? 0 : 2;
        }
        setGridState(newState);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!gridState) return <div>Loading...</div>;

    return (
        <div className="game-container">
            <div className="header">
                <h1>Slitherlink</h1>
                <p>Connect the dots to form a single closed loop.</p>
            </div>

            <div className="controls">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <button
                        key={diff}
                        className={difficulty === diff ? 'active' : ''}
                        onClick={() => startNewGame(diff)}
                    >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                ))}
            </div>

            <div className="stats">
                <div className="stat-item">
                    Time: <span>{formatTime(timer)}</span>
                </div>
                <div className="stat-item">
                    Difficulty: <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                </div>
            </div>

            <div className={gameWon ? 'win-animation' : ''}>
                <Grid
                    state={gridState}
                    onEdgeClick={handleEdgeClick}
                    onEdgeRightClick={handleEdgeRightClick}
                />
            </div>

            <div className="controls">
                <button onClick={() => startNewGame()}>
                    <RotateCcw size={20} /> Reset
                </button>
                <button onClick={() => setIsPaused(!isPaused)}>
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                    {isPaused ? 'Resume' : 'Pause'}
                </button>
                {gameWon && (
                    <div className="win-message" style={{ color: 'var(--edge-drawn)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Trophy size={24} /> Puzzle Solved!
                    </div>
                )}
            </div>

            <div className="help-text" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', textAlign: 'center' }}>
                <HelpCircle size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Left click to draw/cycle edges. Right click to mark as X.
                The number in a cell indicates how many of its four edges are part of the loop.
            </div>
        </div>
    );
};

export default SlitherlinkGame;
