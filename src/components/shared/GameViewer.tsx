import React, { useState, useEffect } from 'react';
import { GameHistory, Player } from '../../types/game';
import { positionToKey } from '../../utils/gameLogic';
import { Button } from '../ui/Button';
import { PauseIcon, PlayIcon, NextIcon, PrevIcon, SkipNextIcon, SkipPrevIcon, StepsIcon } from '../../assets/icons';
import { GameGrid } from './GameGrid';

interface GameViewerProps {
  game: GameHistory;
}

export const GameViewer: React.FC<GameViewerProps> = ({ game }) => {
  const [currentMove, setCurrentMove] = useState(game.moves.length);
  const [isPlaying, setIsPlaying] = useState(false);
  const [centerPosition, setCenterPosition] = useState({ x: 0, y: 0 });
  const [showMovesList, setShowMovesList] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentMove(prev => {
        if (prev >= game.moves.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, game.moves.length]);

  const getBoardAtMove = (moveIndex: number) => {
    const board = new Map<string, Player>();
    for (let i = 0; i < moveIndex; i++) {
      const move = game.moves[i];
      board.set(positionToKey(move.position), move.player);
    }
    return board;
  };

  const currentBoard = getBoardAtMove(currentMove);

  useEffect(() => {
    if (currentMove > 0 && currentMove <= game.moves.length) {
      const lastMove = game.moves[currentMove - 1];
      setCenterPosition({ x: lastMove.position.x, y: lastMove.position.y });
    }
  }, [currentMove, game.moves]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMove(parseInt(e.target.value));
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (currentMove >= game.moves.length) {
      setCurrentMove(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepBack = () => {
    setCurrentMove(Math.max(0, currentMove - 1));
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    setCurrentMove(Math.min(game.moves.length, currentMove + 1));
    setIsPlaying(false);
  };

  const handleFastBack = () => {
    setCurrentMove(Math.max(0, currentMove - 10));
    setIsPlaying(false);
  };

  const handleFastForward = () => {
    setCurrentMove(Math.min(game.moves.length, currentMove + 10));
    setIsPlaying(false);
  };

  const getCurrentPlayer = () => {
    if (currentMove === 0) return 'X';
    return currentMove % 2 === 1 ? 'X' : 'O';
  };

  const getCurrentPlayerName = () => {
    return getCurrentPlayer() === 'X' ? game.playerX : game.playerO;
  };



  const formatCoordinate = (coord: number) => {
    return coord.toLocaleString('ru-RU');
  };

  const handleGoToMove = (moveIndex: number) => {
    setCurrentMove(moveIndex + 1);
    setIsPlaying(false);
    setShowMovesList(false);
    if (moveIndex >= 0) {
      const move = game.moves[moveIndex];
      setCenterPosition({ x: move.position.x, y: move.position.y });
    }
  };



  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-xl overflow-hidden">
      <div className="bg-white shadow-sm border-b border-gray-200 p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
              {game.playerX} vs {game.playerO}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              Ход {currentMove} из {game.moves.length} | {new Date(game.date).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm sm:text-lg font-semibold text-gray-700 leading-tight">
              {currentMove === 0 ? 'Начало игры' : 
               currentMove >= game.moves.length ? `Победа: ${game.winner === 'draw' ? 'Ничья' : game.winner === 'X' ? game.playerX : game.playerO}` :
               `Ходит: ${getCurrentPlayerName()}`}
            </div>
            {currentMove > 0 && currentMove <= game.moves.length && (
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                Последний ход: ({formatCoordinate(game.moves[currentMove - 1].position.x)}, {formatCoordinate(game.moves[currentMove - 1].position.y)})
              </div>
            )}
          </div>
        </div>

        <div className="mb-2 sm:mb-4">
          <input
            type="range"
            min={0}
            max={game.moves.length}
            value={currentMove}
            onChange={handleSliderChange}
            className="w-full h-2 sm:h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-black"
            style={{
              background: `linear-gradient(to right, #000000 0%, #000000 ${(currentMove / game.moves.length) * 100}%, #e5e7eb ${(currentMove / game.moves.length) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 sm:mt-2">
            <span>Начало</span>
            <span className="hidden sm:inline">Ход {Math.floor(game.moves.length / 2)}</span>
            <span>Конец</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-2 mb-2 sm:mb-4">
          <div className="flex justify-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFastBack}
              disabled={currentMove === 0}  
              title="Назад на 10 ходов"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <SkipPrevIcon />
            </Button>
            <Button
              size="sm"
              onClick={handleStepBack}
              disabled={currentMove === 0}
              title="Предыдущий ход"
              variant="outline"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <PrevIcon />
            </Button>
            <Button
              size="sm"
              onClick={handlePlayPause}
              variant="primary"
              title={isPlaying ? "Пауза" : "Воспроизвести"}
              className="px-3 sm:px-6 text-xs sm:text-sm flex items-center gap-1"
            >
              {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlaying ? 'Пауза' : 'Играть'}</span>
            </Button>
            <Button
              size="sm"
              onClick={handleStepForward}
              disabled={currentMove >= game.moves.length}
              variant="outline"
              title="Следующий ход"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <NextIcon />
            </Button>
            <Button
              size="sm"
              onClick={handleFastForward}
              disabled={currentMove >= game.moves.length}
              variant="outline"
              title="Вперед на 10 ходов"
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <SkipNextIcon />
            </Button>
          </div>

          <div className="flex gap-2 sm:hidden">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMovesList(!showMovesList)}
              className="flex-1 text-xs"
            >
              <StepsIcon/> Ходы
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 relative h-56 lg:h-auto p-2 sm:p-4">
          <GameGrid
            board={currentBoard}
            initialCenterPosition={centerPosition}
            cellSize={40}
            lineWidth={1.5}
            viewRadius={3}
            moveSpeed={0.2}
            isInteractive={false}
            showMoveNumbers={true}
            moves={game.moves}
            currentMoveIndex={currentMove}
            className="bg-white border border-gray-200 rounded-lg"
            onCenterPositionChange={setCenterPosition}
          />

          <nav className="absolute bottom-2 left-2 bg-primary/75 backdrop-blur-sm text-white p-2 rounded-lg transition-opacity duration-300">
            <div className="text-xs sm:text-sm space-y-1">
              <div className="hidden sm:block">
                <li>Зажать и тянуть: перемещение</li>
                <li>Сетка расширяется автоматически</li>
                <li>Последний ход выделен зеленым</li>
              </div>
            </div>
          </nav>


        </div>

        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h4 className="font-semibold text-gray-800 mb-3">История ходов</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {game.moves.map((move, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${index === currentMove - 1
                    ? 'bg-blue-100 border-2 border-blue-300'
                    : index < currentMove
                      ? 'bg-gray-50 hover:bg-gray-100'
                      : 'bg-gray-25 text-gray-400'
                  }`}
                onClick={() => handleGoToMove(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Ход {index + 1}: {move.player}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({formatCoordinate(move.position.x)}, {formatCoordinate(move.position.y)})
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {move.player === 'X' ? game.playerX : game.playerO}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showMovesList && (
          <div className="lg:hidden absolute inset-x-0 bottom-0 top-0 bg-white border-t border-gray-200 z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800">История ходов</h4>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowMovesList(false)}
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {game.moves.map((move, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${index === currentMove - 1
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : index < currentMove
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'bg-gray-25 text-gray-400'
                      }`}
                      onClick={() => {
                        handleGoToMove(index)
                      }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        Ход {index + 1}: {move.player}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({formatCoordinate(move.position.x)}, {formatCoordinate(move.position.y)})
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {move.player === 'X' ? game.playerX : game.playerO}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 