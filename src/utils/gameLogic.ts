import { Player, Position } from '../types/game';

export const positionToKey = (position: Position): string => `${position.x},${position.y}`;

export const keyToPosition = (key: string): Position => {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
};

export const checkWinner = (board: Map<string, Player>, lastMove: Position): Player => {
  const directions = [
    [1, 0],   // горизонталь
    [0, 1],   // вертикаль
    [1, 1],   // диагональ \
    [1, -1],  // диагональ /
  ];

  const player = board.get(positionToKey(lastMove));
  if (!player) return null;

  for (const [dx, dy] of directions) {
    let count = 1;

    let x = lastMove.x + dx;
    let y = lastMove.y + dy;
    while (board.get(positionToKey({ x, y })) === player) {
      count++;
      x += dx;
      y += dy;
    }

    x = lastMove.x - dx;
    y = lastMove.y - dy;
    while (board.get(positionToKey({ x, y })) === player) {
      count++;
      x -= dx;
      y -= dy;
    }

    if (count >= 5) {
      return player;
    }
  }

  return null;
};

export const getVisibleCells = (board: Map<string, Player>, centerX = 0, centerY = 0, radius = 10) => {
  const cells: { position: Position; player: Player }[] = [];
  
  for (let x = centerX - radius; x <= centerX + radius; x++) {
    for (let y = centerY - radius; y <= centerY + radius; y++) {
      const key = positionToKey({ x, y });
      const player = board.get(key) || null;
      cells.push({ position: { x, y }, player });
    }
  }
  
  return cells;
};

export const getBoardBounds = (board: Map<string, Player>) => {
  if (board.size === 0) {
    return { minX: -5, maxX: 5, minY: -5, maxY: 5 };
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  for (const key of board.keys()) {
    const { x, y } = keyToPosition(key);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const padding = 3;
  return {
    minX: minX - padding,
    maxX: maxX + padding,
    minY: minY - padding,
    maxY: maxY + padding,
  };
}; 