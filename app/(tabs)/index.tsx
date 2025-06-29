import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GameEngine } from '@/components/GameEngine';
import { GameOverModal } from '@/components/GameOverModal';
import { PauseModal } from '@/components/PauseModal';
import { GameHeader } from '@/components/GameHeader';
import { useGameStore } from '@/hooks/useGameStore';
import { updateGlobalGameState } from './_layout';

const { width, height } = Dimensions.get('window');

export default function GameScreen() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOverReason, setGameOverReason] = useState<'time' | 'blackBubble'>('time');
  const { addScore, getHighScore, getGamesPlayed } = useGameStore();

  // Update global game state whenever local state changes
  useEffect(() => {
    updateGlobalGameState(gameState);
  }, [gameState]);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setGameOverReason('time');
    triggerHaptic();
  };

  const pauseGame = () => {
    setGameState('paused');
    triggerHaptic();
  };

  const resumeGame = () => {
    setGameState('playing');
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
    setGameOverReason('time');
  };

  const onBubblePop = (points: number) => {
    setScore(prev => prev + points);
    // Add only 1 second for each bubble popped
    setTimeLeft(prev => prev + 1);
    triggerHaptic();
  };

  const onBlackBubblePop = () => {
    // Strong haptic feedback for game over
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    endGame('blackBubble');
  };

  // Main game timer
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

  const getSpeedLevel = () => Math.floor(score / 500);
  const speedLevel = getSpeedLevel();

  const getSpeedDescription = () => {
    if (speedLevel === 0) return "Pop bubbles to extend your time!";
    if (speedLevel === 1) return "Speed Mode activated! Skulls appear!";
    if (speedLevel === 2) return "Turbo Mode! Even faster gameplay!";
    if (speedLevel === 3) return "Hyper Mode! Lightning speed!";
    if (speedLevel === 4) return "Ultra Mode! Maximum challenge!";
    return `Insane Mode x${speedLevel}! Impossible speed!`;
  };

  // Dynamic styles based on game state
  const containerStyle = [
    styles.container,
    gameState !== 'menu' && styles.gameActiveContainer
  ];

  const safeAreaStyle = gameState === 'menu' ? styles.safeArea : styles.gameActiveSafeArea;

  if (gameState === 'menu') {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={safeAreaStyle}>
          <View style={styles.menuContainer}>
            <Text style={styles.title}>Bubble Pop</Text>
            <Text style={styles.subtitle}>{getSpeedDescription()}</Text>
            
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>Progressive Speed System:</Text>
              <Text style={styles.ruleText}>🎯 Pop bubbles to earn points (+1 second each)</Text>
              <Text style={styles.ruleText}>🚀 Every 500 points = faster speed level</Text>
              <Text style={styles.ruleText}>⚡ Higher levels = smaller, faster bubbles</Text>
              <Text style={styles.ruleText}>💀 Skulls appear at 500+ points</Text>
              <Text style={styles.ruleText}>🔥 Unlimited speed progression!</Text>
            </View>

            <View style={styles.speedLevels}>
              <Text style={styles.speedTitle}>Speed Levels:</Text>
              <Text style={styles.speedLevel}>🎯 0-499: Normal Mode</Text>
              <Text style={styles.speedLevel}>🚀 500+: Speed Mode</Text>
              <Text style={styles.speedLevel}>⚡ 1000+: Turbo Mode</Text>
              <Text style={styles.speedLevel}>💥 1500+: Hyper Mode</Text>
              <Text style={styles.speedLevel}>🔥 2000+: Ultra Mode</Text>
              <Text style={styles.speedLevel}>💀 2500+: Insane Mode</Text>
            </View>
            
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
      style={containerStyle}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={safeAreaStyle}>
        <GameHeader 
          score={score}
          timeLeft={timeLeft}
          onPause={pauseGame}
        />
        
        <GameEngine
          gameState={gameState}
          score={score}
          onBubblePop={onBubblePop}
          onBlackBubblePop={onBlackBubblePop}
          screenWidth={width}
          screenHeight={height - 120} // Adjusted for full screen during gameplay
        />

        <PauseModal
          visible={gameState === 'paused'}
          score={score}
          timeLeft={timeLeft}
          speedLevel={speedLevel}
          onResume={resumeGame}
          onMainMenu={resetGame}
        />

        <GameOverModal
          visible={gameState === 'gameOver'}
          score={score}
          highScore={getHighScore()}
          reason={gameOverReason}
          speedLevel={speedLevel}
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
  gameActiveContainer: {
    // Full screen when game is active
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
  },
  gameActiveSafeArea: {
    flex: 1,
    paddingBottom: 0, // Remove bottom padding when game is active
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
    marginBottom: 24,
  },
  rulesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    textAlign: 'center',
  },
  speedLevels: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  speedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff4757',
    marginBottom: 10,
  },
  speedLevel: {
    fontSize: 12,
    color: 'white',
    marginBottom: 4,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
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