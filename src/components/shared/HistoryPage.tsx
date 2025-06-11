import React, { useState } from 'react';
import { GameHistory } from '../../types/game';
import { GameViewer } from './GameViewer';
import { Button } from '../ui/Button';
import { CalendarIcon, CupIcon, EyeIcon, StepsIcon } from '../../assets/icons';

interface HistoryPageProps {
  history: GameHistory[];
  onBack: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onBack }) => {
  const [selectedGame, setSelectedGame] = useState<GameHistory | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const getWinnerDisplay = (game: GameHistory) => {
    if (game.winner === 'draw') {
      return <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Ничья</span>;
    }
    const winnerName = game.winner === 'X' ? game.playerX : game.playerO;
    return (
      <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full gap-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
        <p className="hidden sm:inline">Победитель:</p>
        <p className="sm:hidden"><CupIcon/></p>
        <b className="text-blue-800">{winnerName}</b>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              История игр
            </h1>
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="self-start sm:self-auto"
            >
              ← Назад
            </Button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-4">🎮</div>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                История игр пуста. Сыграйте первую игру!
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {history.map((game) => (
                <div
                  key={game.id}
                  className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-3 gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                          {game.playerX} vs {game.playerO}
                        </h3>
                        {getWinnerDisplay(game)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 text-xs sm:text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <CalendarIcon/> {formatDate(game.date)}
                        </p>
                        <p className="flex items-center gap-1">
                          <StepsIcon/> Ходов: {game.moves.length}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setSelectedGame(game)}
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto flex-shrink-0"
                    >
                      <span className="flex items-center gap-2 sm:hidden"><EyeIcon/> Смотреть</span>
                      <span className="hidden sm:inline">Просмотр</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedGame && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full h-full sm:rounded-xl sm:overflow-hidden sm:w-full sm:h-full sm:max-w-7xl sm:max-h-[95vh] flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    Просмотр: {selectedGame.playerX} vs {selectedGame.playerO}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {formatDate(selectedGame.date)} • {selectedGame.moves.length} ходов
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedGame(null)}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <span className="sm:hidden">✕</span>
                  <span className="hidden sm:inline">Закрыть</span>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <GameViewer game={selectedGame} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 