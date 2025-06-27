import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameScore {
  score: number;
  date: string;
}

interface GameStats {
  totalBubblesPopped: number;
  totalTimePlayed: number;
}

export function useGameStore() {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [stats, setStats] = useState<GameStats>({
    totalBubblesPopped: 0,
    totalTimePlayed: 0,
  });

  // Load data from storage on mount
  useEffect(() => {
    loadScores();
    loadStats();
  }, []);

  const loadScores = async () => {
    try {
      const storedScores = await AsyncStorage.getItem('bubble_pop_scores');
      if (storedScores) {
        setScores(JSON.parse(storedScores));
      }
    } catch (error) {
      console.error('Failed to load scores:', error);
    }
  };

  const loadStats = async () => {
    try {
      const storedStats = await AsyncStorage.getItem('bubble_pop_stats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const saveScores = async (newScores: GameScore[]) => {
    try {
      await AsyncStorage.setItem('bubble_pop_scores', JSON.stringify(newScores));
    } catch (error) {
      console.error('Failed to save scores:', error);
    }
  };

  const saveStats = async (newStats: GameStats) => {
    try {
      await AsyncStorage.setItem('bubble_pop_stats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  };

  const addScore = (score: number) => {
    const newScore: GameScore = {
      score,
      date: new Date().toISOString(),
    };

    const newScores = [newScore, ...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Keep only top 50 scores

    setScores(newScores);
    saveScores(newScores);

    // Update stats
    const bubblesPopped = Math.floor(score / 10); // Rough estimate
    const newStats = {
      totalBubblesPopped: stats.totalBubblesPopped + bubblesPopped,
      totalTimePlayed: stats.totalTimePlayed + 60, // Assuming 60-second games
    };
    setStats(newStats);
    saveStats(newStats);
  };

  const getHighScore = () => {
    return scores.length > 0 ? scores[0].score : 0;
  };

  const getAllScores = () => {
    return scores;
  };

  const getGamesPlayed = () => {
    return scores.length;
  };

  const getTotalBubblesPopped = () => {
    return stats.totalBubblesPopped;
  };

  const getTotalTimePlayed = () => {
    return stats.totalTimePlayed;
  };

  const clearScores = async () => {
    setScores([]);
    setStats({ totalBubblesPopped: 0, totalTimePlayed: 0 });
    
    try {
      await AsyncStorage.removeItem('bubble_pop_scores');
      await AsyncStorage.removeItem('bubble_pop_stats');
    } catch (error) {
      console.error('Failed to clear scores:', error);
    }
  };

  return {
    addScore,
    getHighScore,
    getAllScores,
    getGamesPlayed,
    getTotalBubblesPopped,
    getTotalTimePlayed,
    clearScores,
  };
}