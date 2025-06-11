import React, { useState, useEffect } from 'react';
import { Players } from '../../types/game';
import { saveCurrentPlayers, loadCurrentPlayers } from '../../utils/storage';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';

interface LoginPageProps {
  onPlayersSet: (players: Players) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onPlayersSet }) => {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedPlayers = loadCurrentPlayers();
    if (savedPlayers) {
      setPlayerX(savedPlayers.playerX);
      setPlayerO(savedPlayers.playerO);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerX.trim() || !playerO.trim()) {
      setError('Пожалуйста, введите имена обоих игроков');
      return;
    }

    if (playerX.trim() === playerO.trim()) {
      setError('Имена игроков должны отличаться');
      return;
    }

    const players = { playerX: playerX.trim(), playerO: playerO.trim() };
    saveCurrentPlayers(players.playerX, players.playerO);
    onPlayersSet(players);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Крестики-нолики
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            <span className="hidden sm:inline">5 в ряд на большой плоскости</span>
            <span className="sm:hidden">5 в ряд</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="playerX" className="block text-sm font-semibold text-gray-700 mb-2">
              Игрок X
            </label>
            <TextInput
              id="playerX"
              type="text"
              value={playerX}
              onChange={(e) => {
                setPlayerX(e.target.value);
                setError('');
              }}
              placeholder="Введите имя первого игрока"
              autoFocus
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label htmlFor="playerO" className="block text-sm font-semibold text-gray-700 mb-2">
              Игрок O
            </label>
            <TextInput
              id="playerO"
              type="text"
              value={playerO}
              onChange={(e) => {
                setPlayerO(e.target.value);
                setError('');
              }}
              placeholder="Введите имя второго игрока"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 sm:mt-6 text-sm sm:text-base py-3 sm:py-4"
          >
            Начать игру
          </Button>
        </form>
      </div>
    </div>
  );
}; 