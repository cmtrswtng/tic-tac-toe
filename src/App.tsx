import { useState, useCallback } from 'react';
import { LoginPage } from './components/shared/LoginPage';
import { GameBoard } from './components/shared/GameBoard';
import { HistoryPage } from './components/shared/HistoryPage';
import type { Players, GameState, Position, GameHistory, Move } from './types/game';
import { positionToKey, checkWinner } from './utils/gameLogic';
import { saveGameHistory, loadGameHistory } from './utils/storage';
import { Button } from './components/ui/Button';
import { MenuIcon, GameIcon } from './assets/icons';

type AppState = 'login' | 'game' | 'history';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [players, setPlayers] = useState<Players | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>(() => loadGameHistory());
  const [gameState, setGameState] = useState<GameState>({
    board: new Map(),
    currentPlayer: 'X',
    winner: null,
    moves: [],
    isGameOver: false,
  });

  const handleNewGame = useCallback(() => {
    setGameState({
      board: new Map(),
      currentPlayer: 'X',
      winner: null,
      moves: [],
      isGameOver: false,
    });
  }, []);

  const handlePlayersSet = useCallback((newPlayers: Players) => {
    setPlayers(newPlayers);
    setAppState('game');
    handleNewGame();
  }, [handleNewGame]);

  const handleMove = useCallback((position: Position) => {
    if (gameState.isGameOver) return;

    const key = positionToKey(position);
    if (gameState.board.has(key)) return;

    const newBoard = new Map(gameState.board);
    newBoard.set(key, gameState.currentPlayer);

    const move: Move = {
      position,
      player: gameState.currentPlayer,
      timestamp: Date.now(),
    };

    const newMoves = [...gameState.moves, move];
    
    const winner = checkWinner(newBoard, position);
    const isGameOver = winner !== null;

    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      moves: newMoves,
      isGameOver,
    };

    setGameState(newGameState);

    if (isGameOver && players) {
      const gameHistoryEntry: GameHistory = {
        id: Date.now().toString(),
        playerX: players.playerX,
        playerO: players.playerO,
        winner,
        date: new Date().toISOString(),
        moves: newMoves,
        finalBoard: new Map(newBoard),
      };

      const updatedHistory = [gameHistoryEntry, ...gameHistory];
      setGameHistory(updatedHistory);
      saveGameHistory(updatedHistory);
    }
  }, [gameState, players, gameHistory]);

  const handleShowHistory = () => {
    setAppState('history');
  };

  const handleBackToGame = () => {
    setAppState('game');
  };

  const handleBackToLogin = () => {
    setAppState('login');
    setPlayers(null);
    handleNewGame();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {appState !== 'login' && (
        <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50 border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex-1 min-w-0">
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                  <span className="hidden sm:inline">Крестики-нолики - 5 в ряд</span>
                  <span className="sm:hidden">Крестики-нолики</span>
                </h1>
                {players && (
                  <div className="text-xs sm:text-sm text-gray-600 truncate sm:hidden">
                    {players.playerX} vs {players.playerO}
                  </div>
                )}
              </div>
              
              {players && (
                <span className="hidden sm:inline text-sm text-gray-600 mx-4 truncate">
                  {players.playerX} vs {players.playerO}
                </span>
              )}
              
              <div className="flex items-center gap-1 sm:gap-4">
                {appState === 'game' && (
                  <Button
                    onClick={handleShowHistory}
                    variant="primary"
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-1"
                  >
                    <MenuIcon className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">История</span>
                  </Button>
                )}
                {appState === 'history' && (
                  <Button
                    onClick={handleBackToGame}
                    variant="primary"
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-1"
                  >
                    <GameIcon className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Игра</span>
                  </Button>
                )}
                <Button
                  onClick={handleBackToLogin}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="sm:hidden">←</span>
                  <span className="hidden sm:inline">Выход</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="h-full pt-14 sm:pt-16">
        {appState === 'login' && (
          <LoginPage onPlayersSet={handlePlayersSet} />
        )}

        {appState === 'game' && players && (
          <GameBoard
            gameState={gameState}
            onMove={handleMove}
            onNewGame={handleNewGame}
            playerX={players.playerX}
            playerO={players.playerO}
          />
        )}

        {appState === 'history' && (
          <HistoryPage
            history={gameHistory}
            onBack={handleBackToGame}
          />
        )}
      </main>
    </div>
  );
}

export default App;
