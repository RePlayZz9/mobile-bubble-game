import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Bubble } from './Bubble';
import { BlackBubble } from './BlackBubble';

interface BubbleData {
  id: string;
  x: number;
  y: number;
  color: string;
  points: number;
  size: number;
  type: 'normal' | 'black';
}

interface GameEngineProps {
  gameState: 'playing' | 'paused' | 'gameOver';
  score: number;
  onBubblePop: (points: number) => void;
  onBlackBubblePop: () => void;
  screenWidth: number;
  screenHeight: number;
}

const BUBBLE_COLORS = [
  { color: '#FF6B9D', points: 10 },
  { color: '#4ECDC4', points: 20 },
  { color: '#45B7D1', points: 30 },
  { color: '#FFD700', points: 50 },
];

export function GameEngine({ 
  gameState, 
  score,
  onBubblePop, 
  onBlackBubblePop,
  screenWidth, 
  screenHeight 
}: GameEngineProps) {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  // Determine if we're in speed mode (after 500 points)
  const isSpeedMode = score >= 500;

  const generateBubble = useCallback((): BubbleData => {
    const size = 40 + Math.random() * 30; // Size between 40-70
    
    // Add chance for black bubbles in speed mode
    const shouldCreateBlackBubble = isSpeedMode && Math.random() < 0.2; // 20% chance in speed mode
    
    if (shouldCreateBlackBubble) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * (screenWidth - size),
        y: Math.random() * (screenHeight - size),
        color: '#1a1a1a',
        points: 0,
        size: size,
        type: 'black',
      };
    }
    
    const colorData = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (screenWidth - size),
      y: Math.random() * (screenHeight - size),
      color: colorData.color,
      points: colorData.points,
      size: size,
      type: 'normal',
    };
  }, [screenWidth, screenHeight, isSpeedMode]);

  const removeBubble = useCallback((id: string) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
  }, []);

  const handleBubblePop = useCallback((bubble: BubbleData) => {
    if (bubble.type === 'black') {
      onBlackBubblePop();
    } else {
      onBubblePop(bubble.points);
    }
    removeBubble(bubble.id);
  }, [onBubblePop, onBlackBubblePop, removeBubble]);

  // Generate bubbles with speed-based intervals
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Speed mode: faster bubble generation
    const bubbleInterval = isSpeedMode ? 800 : 1500; // Much faster in speed mode
    const maxBubbles = isSpeedMode ? 8 : 5; // More bubbles in speed mode

    const interval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < maxBubbles) {
          return [...prev, generateBubble()];
        }
        return prev;
      });
    }, bubbleInterval);

    return () => clearInterval(interval);
  }, [gameState, isSpeedMode, generateBubble]);

  // Auto-remove bubbles with speed-based timing
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Speed mode: bubbles disappear faster
    const bubbleLifetime = isSpeedMode ? 2500 : 4000; // Much shorter in speed mode

    const cleanupInterval = setInterval(() => {
      setBubbles(prev => {
        // Remove bubbles that have been around too long
        const now = Date.now();
        return prev.filter((bubble, index) => {
          // Remove oldest bubbles first if there are too many
          const maxBubblesBeforeCleanup = isSpeedMode ? 6 : 8;
          if (prev.length > maxBubblesBeforeCleanup && index === 0) {
            return false;
          }
          return true;
        });
      });
    }, bubbleLifetime / 4); // Check more frequently

    return () => clearInterval(cleanupInterval);
  }, [gameState, isSpeedMode]);

  // Clear bubbles when game is not playing
  useEffect(() => {
    if (gameState !== 'playing') {
      setBubbles([]);
    }
  }, [gameState]);

  if (gameState !== 'playing') {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {bubbles.map(bubble => (
        bubble.type === 'black' ? (
          <BlackBubble
            key={bubble.id}
            bubble={bubble}
            onPop={handleBubblePop}
            isSpeedMode={isSpeedMode}
          />
        ) : (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onPop={handleBubblePop}
            isSpeedMode={isSpeedMode}
          />
        )
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});