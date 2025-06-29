import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedGameState {
  score: number;
  timeLeft: number;
  speedLevel: number;
  savedAt: string;
}

const SAVED_GAME_KEY = 'bubble_pop_saved_game';

export function useGameSave() {
  const [savedGame, setSavedGame] = useState<SavedGameState | null>(null);

  // Load saved game on mount
  useEffect(() => {
    loadSavedGame();
  }, []);

  const loadSavedGame = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_GAME_KEY);
      if (saved) {
        const gameState = JSON.parse(saved);
        // Check if saved game is not too old (e.g., within 24 hours)
        const savedTime = new Date(gameState.savedAt).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setSavedGame(gameState);
        } else {
          // Remove old saved game
          await clearSavedGame();
        }
      }
    } catch (error) {
      console.error('Failed to load saved game:', error);
    }
  };

  const saveGame = async (score: number, timeLeft: number) => {
    try {
      const gameState: SavedGameState = {
        score,
        timeLeft,
        speedLevel: Math.floor(score / 500),
        savedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(SAVED_GAME_KEY, JSON.stringify(gameState));
      setSavedGame(gameState);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const clearSavedGame = async () => {
    try {
      await AsyncStorage.removeItem(SAVED_GAME_KEY);
      setSavedGame(null);
    } catch (error) {
      console.error('Failed to clear saved game:', error);
    }
  };

  const hasSavedGame = () => {
    return savedGame !== null;
  };

  const getSavedGame = () => {
    return savedGame;
  };

  return {
    saveGame,
    clearSavedGame,
    hasSavedGame,
    getSavedGame,
    loadSavedGame,
  };
}