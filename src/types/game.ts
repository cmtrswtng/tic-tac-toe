export type Player = 'X' | 'O' | null;

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  position: Position;
  player: Player;
  timestamp: number;
}

export interface GameState {
  board: Map<string, Player>;
  currentPlayer: Player;
  winner: Player | 'draw';
  moves: Move[];
  isGameOver: boolean;
}

export interface GameHistory {
  id: string;
  playerX: string;
  playerO: string;
  winner: Player | 'draw';
  date: string;
  moves: Move[];
  finalBoard: Map<string, Player>;
}

export interface Players {
  playerX: string;
  playerO: string;
} 