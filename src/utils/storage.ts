import { GameHistory } from '../types/game';

const STORAGE_KEYS = {
  GAME_HISTORY: 'tic-tac-toe-history',
  CURRENT_PLAYERS: 'tic-tac-toe-players',
} as const;

export const saveGameHistory = (games: GameHistory[]): void => {
  try {
    const serializedGames = games.map(game => ({
      ...game,
      finalBoard: Object.fromEntries(game.finalBoard),
    }));
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(serializedGames));
  } catch (error) {
    console.error('Ошибка сохранения истории игр:', error);
  }
};

export const loadGameHistory = (): GameHistory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((game: Omit<GameHistory, 'finalBoard'> & { finalBoard: Record<string, string> }) => ({
      ...game,
      finalBoard: new Map(Object.entries(game.finalBoard)),
    }));
  } catch (error) {
    console.error('Ошибка загрузки истории игр:', error);
    return [];
  }
};

export const saveCurrentPlayers = (playerX: string, playerO: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYERS, JSON.stringify({ playerX, playerO }));
  } catch (error) {
    console.error('Ошибка сохранения игроков:', error);
  }
};

export const loadCurrentPlayers = (): { playerX: string; playerO: string } | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYERS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Ошибка загрузки игроков:', error);
    return null;
  }
}; 