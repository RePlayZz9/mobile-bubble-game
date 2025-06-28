import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
  level: number;
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
  level, 
  onBubblePop, 
  onBlackBubblePop,
  screenWidth, 
  screenHeight 
}: GameEngineProps) {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  const generateBubble = useCallback((): BubbleData => {
    const size = 40 + Math.random() * 30; // Size between 40-70
    
    // After level 5, add chance for black bubbles
    const shouldCreateBlackBubble = level >= 5 && Math.random() < 0.15; // 15% chance
    
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
  }, [screenWidth, screenHeight, level]);

  const addBubble = useCallback(() => {
    setBubbles(prev => [...prev, generateBubble()]);
  }, [generateBubble]);

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

  // Generate bubbles based on level with increasing speed
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Speed increases with each level - starts at 2000ms, decreases by 150ms per level, minimum 300ms
    const bubbleInterval = Math.max(2000 - (level * 150), 300);
    
    // More bubbles as level increases - starts with 3, adds 1 per level, max 10
    const maxBubbles = Math.min(3 + level, 10);

    const interval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < maxBubbles) {
          return [...prev, generateBubble()];
        }
        return prev;
      });
    }, bubbleInterval);

    return () => clearInterval(interval);
  }, [gameState, level, generateBubble]);

  // Auto-remove bubbles after some time (faster removal at higher levels)
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Cleanup interval decreases with level for more challenge
    const cleanupTime = Math.max(4000 - (level * 200), 2000);

    const cleanupInterval = setInterval(() => {
      setBubbles(prev => {
        // Remove oldest bubble if there are too many
        const maxBubblesBeforeCleanup = Math.min(6 + Math.floor(level / 2), 12);
        if (prev.length > maxBubblesBeforeCleanup) {
          return prev.slice(1); // Remove first (oldest) bubble
        }
        return prev;
      });
    }, cleanupTime);

    return () => clearInterval(cleanupInterval);
  }, [gameState, level]);

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
          />
        ) : (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onPop={handleBubblePop}
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