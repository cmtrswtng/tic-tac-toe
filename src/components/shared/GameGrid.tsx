import React, { useState, useCallback, useEffect } from 'react';
import { Player } from '../../types/game';
import { positionToKey } from '../../utils/gameLogic';
import { XIcon, OIcon, PlayIcon } from '../../assets/icons';
import { Button } from '../ui/Button';
import { useThrottle } from '../../hooks/useThrottle';

interface GameGridProps {
  board: Map<string, Player>;
  initialCenterPosition?: { x: number; y: number };
  cellSize?: number;
  lineWidth?: number;
  viewRadius?: number;
  moveSpeed?: number;
  onCellClick?: (worldX: number, worldY: number) => void;
  isInteractive?: boolean;
  lastMovePosition?: { x: number; y: number } | null;
  showMoveNumbers?: boolean;
  moves?: Array<{ position: { x: number; y: number }; player: Player }>;
  currentMoveIndex?: number;
  className?: string;
  onCenterPositionChange?: (position: { x: number; y: number }) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  board,
  initialCenterPosition = { x: 0, y: 0 },
  cellSize = 50,
  lineWidth = 2,
  viewRadius = 2,
  moveSpeed = 0.18,
  onCellClick,
  isInteractive = false,
  lastMovePosition,
  showMoveNumbers = false,
  moves = [],
  currentMoveIndex = 0,
  className = '',
  onCenterPositionChange
}) => {
  const [centerPosition, setCenterPosition] = useState(initialCenterPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const throttledCenterPosition = useThrottle(centerPosition, 50);

  useEffect(() => {
    if (!isDragging && isInteractive) {
      setCenterPosition(initialCenterPosition);
    }
  }, [initialCenterPosition, isDragging, isInteractive]);

  useEffect(() => {
    if (!isInteractive) {
      setCenterPosition(initialCenterPosition);
    }
  }, [initialCenterPosition, isInteractive]);

  useEffect(() => {
    if (!isDragging) {
      onCenterPositionChange?.(throttledCenterPosition);
    }
  }, [throttledCenterPosition, onCenterPositionChange, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const dx = Math.round((dragStart.x - e.clientX) / cellSize * moveSpeed);
    const dy = Math.round(((dragStart.y - e.clientY) / cellSize) * moveSpeed);

    if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1) {
      setCenterPosition(prev => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;
        
        if (Math.abs(newX) > Number.MAX_SAFE_INTEGER || Math.abs(newY) > Number.MAX_SAFE_INTEGER) {
          return prev;
        }
        
        return { x: newX, y: newY };
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, cellSize, moveSpeed]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    onCenterPositionChange?.(centerPosition);
  }, [centerPosition, onCenterPositionChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCenterToPosition = (x: number, y: number) => {
    if (Math.abs(x) <= Number.MAX_SAFE_INTEGER && Math.abs(y) <= Number.MAX_SAFE_INTEGER) {
      setCenterPosition({ x, y });
    }
  };

  const formatCoordinate = (coord: number) => {
    return coord.toLocaleString('ru-RU');
  };

  const renderCell = (worldX: number, worldY: number, relativeX: number, relativeY: number) => {
    const key = positionToKey({ x: worldX, y: worldY });
    const player = board.get(key);
    
    const cellX = relativeX * cellSize;
    const cellY = relativeY * cellSize;

    let isLastMove = false;
    if (showMoveNumbers) {
      isLastMove = currentMoveIndex > 0 && 
        moves[currentMoveIndex - 1] && 
        moves[currentMoveIndex - 1].position.x === worldX && 
        moves[currentMoveIndex - 1].position.y === worldY;
    } else {
      isLastMove = moves.length > 0 && 
        moves[moves.length - 1] && 
        moves[moves.length - 1].position.x === worldX && 
        moves[moves.length - 1].position.y === worldY;
    }

    const isNewSymbol = lastMovePosition && 
      lastMovePosition.x === worldX && 
      lastMovePosition.y === worldY;

    const moveIndex = showMoveNumbers ? moves.findIndex(move =>
      move.position.x === worldX && move.position.y === worldY
    ) : -1;
    const isMoveInSequence = moveIndex >= 0 && moveIndex < currentMoveIndex;

    return (
      <g key={key}>
        <rect
          x={cellX - cellSize / 2}
          y={cellY - cellSize / 2}
          width={cellSize}
          height={cellSize}
          fill={isLastMove ? '#66cd5a' : 'white'}
          stroke={'#d1d5db'}
          strokeWidth={lineWidth}
          style={{ 
            cursor: isInteractive && !player ? 'pointer' : 'default'
          }}
          onClick={isInteractive && onCellClick ? () => onCellClick(worldX, worldY) : undefined}
          onTouchStart={isInteractive && onCellClick ? () => onCellClick(worldX, worldY) : undefined}
        />
        {player && (
          <foreignObject
            x={cellX - cellSize * 0.3}
            y={cellY - cellSize * 0.3}
            width={cellSize * 0.6}
            height={cellSize * 0.6}
          >
            <div 
              className={isNewSymbol ? 'animate-scale-in' : ''}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%', 
                height: '100%',
                color: player === 'X' ? '#ef4444' : '#3b82f6'
              }}
            >
              {player === 'X' ? (
                <XIcon style={{ width: '100%', height: '100%' }} />
              ) : (
                <OIcon style={{ width: '100%', height: '100%' }} />
              )}
            </div>
          </foreignObject>
        )}
        {showMoveNumbers && isMoveInSequence && (
          <text
            x={cellX + cellSize * 0.3}
            y={cellY - cellSize * 0.3}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={cellSize * 0.25}
            fill="#6b7280"
            fontWeight="500"
          >
            {moveIndex + 1}
          </text>
        )}
      </g>
    );
  };

  const renderGrid = () => {
    const cells = [];
    
    for (let relX = -viewRadius; relX <= viewRadius; relX++) {
      for (let relY = -viewRadius; relY <= viewRadius; relY++) {
        const worldX = throttledCenterPosition.x + relX;
        const worldY = throttledCenterPosition.y + relY;
        
        if (Math.abs(worldX) <= Number.MAX_SAFE_INTEGER && Math.abs(worldY) <= Number.MAX_SAFE_INTEGER) {
          cells.push(renderCell(worldX, worldY, relX, relY));
        }
      }
    }

    return cells;
  };

  const viewBoxSize = (viewRadius * 2 + 1) * cellSize;
  const viewBoxOffset = viewBoxSize / 2;

  return (
    <>
      <svg
        width="100%"
        height={isInteractive ? "85%" : "60.5%"}
        viewBox={isInteractive 
          ? `${-viewBoxOffset} ${-viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`
          : `${-viewBoxOffset+44} ${-viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`
        }
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        className={isInteractive 
          ? `border border-gray-300 rounded-lg bg-white ${className}`
          : `bg-white border border-gray-200 rounded-lg ${className}`
        }
      >
        {renderGrid()}
      </svg>
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg p-2">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-32 h-32">
          <div/>
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 w-10 p-0 hover:bg-blue-50 border-gray-300"
              onClick={() => handleCenterToPosition(centerPosition.x, centerPosition.y - 1)}
            >
              <PlayIcon className='w-4 h-4 transform -rotate-90'/>
            </Button>
            <div/>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 w-10 p-0 hover:bg-blue-50 border-gray-300"
              onClick={() => handleCenterToPosition(centerPosition.x - 1, centerPosition.y)}
            >
              <PlayIcon className='w-4 h-4 transform rotate-180'/>
            </Button>
            <div/>
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 w-10 p-0 hover:bg-blue-50 border-gray-300"
              onClick={() => handleCenterToPosition(centerPosition.x + 1, centerPosition.y)}
            >
              <PlayIcon className='w-4 h-4 transform rotate-0'/>
            </Button>
            
            <div/>
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 w-10 p-0 hover:bg-blue-50 border-gray-300"
              onClick={() => handleCenterToPosition(centerPosition.x, centerPosition.y + 1)}
            >
              <PlayIcon className='w-4 h-4 transform rotate-90'/>
            </Button>
            <div/>
          </div>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white bg-opacity-95 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-lg">
        <div className="text-xs sm:text-sm text-gray-600 mb-2">
          <span className="hidden sm:inline">Координаты: </span>({formatCoordinate(throttledCenterPosition.x)}, {formatCoordinate(throttledCenterPosition.y)})
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => handleCenterToPosition(0, 0)}
          >
            К центру
          </Button>
          {moves.length > 0 && (
            <Button 
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                const targetMove = showMoveNumbers && currentMoveIndex > 0 
                  ? moves[currentMoveIndex - 1].position 
                  : moves[moves.length - 1].position;
                handleCenterToPosition(targetMove.x, targetMove.y);
              }}
            >
              <span className="hidden sm:inline">
                {showMoveNumbers ? 'К текущему ходу' : 'К последнему ходу'}
              </span>
              <span className="sm:hidden">К ходу</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}; 