import React, { useState, useEffect } from 'react';
import { Position, GameState } from '../../types/game';
import { positionToKey } from '../../utils/gameLogic';
import { Button } from '../ui/Button';
import { ReplayIcon} from '../../assets/icons';
import { GameGrid } from './GameGrid';

interface GameBoardProps {
  gameState: GameState;
  onMove: (position: Position) => void;
  onNewGame: () => void;
  playerX: string;
  playerO: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onMove,
  onNewGame,
  playerX,
  playerO,
}) => {
  const [centerPosition, setCenterPosition] = useState({ x: 0, y: 0 });
  const [showGameEndAnimation, setShowGameEndAnimation] = useState(false);
  const [lastMovePosition, setLastMovePosition] = useState<Position | null>(null);

  useEffect(() => {
    if (gameState.moves.length > 0) {
      const lastMove = gameState.moves[gameState.moves.length - 1];
      setLastMovePosition(lastMove.position);
      
      const timer = setTimeout(() => {
        setLastMovePosition(null);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.moves]);

  useEffect(() => {
    if (gameState.isGameOver && !showGameEndAnimation) {
      setShowGameEndAnimation(true);
      
      const timer = setTimeout(() => {
        setShowGameEndAnimation(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.isGameOver, showGameEndAnimation]);

  const handleGridClick = (worldX: number, worldY: number) => {
    if (gameState.isGameOver) return;
    
    const key = positionToKey({ x: worldX, y: worldY });
    if (gameState.board.has(key)) return;

    onMove({ x: worldX, y: worldY });
  };

  const getCurrentPlayerName = () => {
    return gameState.currentPlayer === 'X' ? playerX : playerO;
  };

  const getWinnerName = () => {
    if (gameState.winner === 'draw') return 'Ничья';
    return gameState.winner === 'X' ? playerX : playerO;
  };

  return (
    <div className="h-screen flex flex-col">

      <section className="bg-white shadow-lg p-2 sm:p-4 m-2 sm:m-4 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
              {gameState.isGameOver 
                ? `Игра окончена: ${getWinnerName()}`
                : `Ход: ${getCurrentPlayerName()} (${gameState.currentPlayer})`
              }
            </h2>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              Ходов: {gameState.moves.length}
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            {gameState.moves.length > 0 && (
                <Button 
                variant="outline" 
                size="sm"
                onClick={onNewGame}
                className="text-xs sm:text-sm flex items-center gap-1"
              >
                <ReplayIcon className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Новая игра</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="flex-1 w-full px-2 sm:px-4 overflow-hidden relative bg-gray-50">
        <GameGrid
          board={gameState.board}
          initialCenterPosition={centerPosition}
          cellSize={50}
          lineWidth={2}
          viewRadius={2}
          moveSpeed={0.18}
          onCellClick={handleGridClick}
          isInteractive={true}
          lastMovePosition={lastMovePosition}
          moves={gameState.moves}
          className={showGameEndAnimation ? 'game-end-animation' : ''}
          onCenterPositionChange={setCenterPosition}
        />
        
        <nav className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 bg-primary/75 backdrop-blur-sm text-white p-2 sm:p-3 rounded-lg transition-opacity duration-300">
          <div className="text-xs sm:text-sm space-y-1">
            <div className="sm:hidden">Зажать и тянуть</div>
            <div className="hidden sm:block">
              <li>Зажать и тянуть: перемещение</li>
              <li>Сетка расширяется автоматически</li>
              <li>Последний ход выделен зеленым</li>
            </div>
          </div>
        </nav>


      </section>

      {showGameEndAnimation && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-center">
            <div className="text-6xl sm:text-8xl mb-4 animate-bounce">
              {gameState.winner === 'draw' ? '🤝' : '🎉'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 animate-pulse">
              {gameState.winner === 'draw' ? 'Ничья!' : `Победа: ${getWinnerName()}!`}
            </h2>
            <div className="text-lg sm:text-xl text-white animate-pulse">
              Ходов: {gameState.moves.length}
            </div>
            <Button
                onClick={() => {
                  setShowGameEndAnimation(false);
                  onNewGame();
                }}
                variant="primary"
                className="flex-1 mt-4 w-full text-sm sm:text-base"
              >
                Новая игра
              </Button>
          </div>
        </div>
      )}

    </div>
  );
}; 