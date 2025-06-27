import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Bubble } from './Bubble';

interface BubbleData {
  id: string;
  x: number;
  y: number;
  color: string;
  points: number;
  size: number;
}

interface GameEngineProps {
  gameState: 'playing' | 'paused' | 'gameOver';
  level: number;
  onBubblePop: (points: number) => void;
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
  screenWidth, 
  screenHeight 
}: GameEngineProps) {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  const generateBubble = useCallback((): BubbleData => {
    const colorData = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    const size = 40 + Math.random() * 30; // Size between 40-70
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (screenWidth - size),
      y: Math.random() * (screenHeight - size),
      color: colorData.color,
      points: colorData.points,
      size: size,
    };
  }, [screenWidth, screenHeight]);

  const addBubble = useCallback(() => {
    setBubbles(prev => [...prev, generateBubble()]);
  }, [generateBubble]);

  const removeBubble = useCallback((id: string) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
  }, []);

  const handleBubblePop = useCallback((bubble: BubbleData) => {
    onBubblePop(bubble.points);
    removeBubble(bubble.id);
  }, [onBubblePop, removeBubble]);

  // Generate bubbles based on level
  useEffect(() => {
    if (gameState !== 'playing') return;

    const bubbleInterval = Math.max(2000 - (level * 200), 500); // Faster spawn as level increases
    const maxBubbles = Math.min(3 + level, 8); // More bubbles as level increases

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

  // Auto-remove bubbles after some time
  useEffect(() => {
    if (gameState !== 'playing') return;

    const cleanupInterval = setInterval(() => {
      setBubbles(prev => {
        // Remove random bubble if there are too many
        if (prev.length > 6) {
          const randomIndex = Math.floor(Math.random() * prev.length);
          return prev.filter((_, index) => index !== randomIndex);
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(cleanupInterval);
  }, [gameState]);

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
        <Bubble
          key={bubble.id}
          bubble={bubble}
          onPop={handleBubblePop}
        />
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