import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GameEngine } from '@/components/GameEngine';
import { GameOverModal } from '@/components/GameOverModal';
import { GameHeader } from '@/components/GameHeader';
import { LevelUpModal } from '@/components/LevelUpModal';
import { useGameStore } from '@/hooks/useGameStore';

const { width, height } = Dimensions.get('window');

export default function GameScreen() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'time' | 'blackBubble'>('time');
  const { addScore, getHighScore, getGamesPlayed } = useGameStore();

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    setGameOverReason('time');
    triggerHaptic();
  };

  const endGame = (reason: 'time' | 'blackBubble' = 'time') => {
    setGameState('gameOver');
    setGameOverReason(reason);
    addScore(score);
    triggerHaptic();
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    setGameOverReason('time');
  };

  const onBubblePop = (points: number) => {
    setScore(prev => prev + points);
    triggerHaptic();
  };

  const onBlackBubblePop = () => {
    // Strong haptic feedback for game over
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    endGame('blackBubble');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame('time');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  useEffect(() => {
    // Level up every 500 points
    const newLevel = Math.floor(score / 500) + 1;
    if (newLevel > level && gameState === 'playing') {
      setLevel(newLevel);
      setShowLevelUp(true);
      
      // Strong haptic feedback for level up
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Hide level up modal after 2 seconds
      setTimeout(() => {
        setShowLevelUp(false);
      }, 2000);
    }
  }, [score, level, gameState]);

  if (gameState === 'menu') {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.menuContainer}>
            <Text style={styles.title}>Bubble Pop</Text>
            <Text style={styles.subtitle}>Tap the bubbles to pop them!</Text>
            <Text style={styles.warningText}>⚠️ Avoid the black skulls after level 5!</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getHighScore()}</Text>
                <Text style={styles.statLabel}>High Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{getGamesPlayed()}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.playButton} onPress={startGame}>
              <LinearGradient
                colors={['#FF6B9D', '#C44569']}
                style={styles.playButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.playButtonText}>Start Game</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <GameHeader 
          score={score}
          timeLeft={timeLeft}
          level={level}
          onPause={() => setGameState('paused')}
        />
        
        <GameEngine
          gameState={gameState}
          level={level}
          onBubblePop={onBubblePop}
          onBlackBubblePop={onBlackBubblePop}
          screenWidth={width}
          screenHeight={height - 200}
        />

        <LevelUpModal
          visible={showLevelUp}
          level={level}
        />

        <GameOverModal
          visible={gameState === 'gameOver'}
          score={score}
          highScore={getHighScore()}
          reason={gameOverReason}
          onPlayAgain={startGame}
          onMenu={resetGame}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#ff4757',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 48,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: 120,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  playButton: {
    width: 200,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});