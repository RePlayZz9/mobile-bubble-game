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
  createdAt: number;
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
  { color: '#FF6B9D', points: 10, baseSize: 45 },  // Reduced from 60 to 45
  { color: '#4ECDC4', points: 20, baseSize: 38 },  // Reduced from 50 to 38
  { color: '#45B7D1', points: 30, baseSize: 32 },  // Reduced from 42 to 32
  { color: '#FFD700', points: 50, baseSize: 26 },  // Reduced from 35 to 26
];

// Bottom margin to prevent bubbles from appearing at the very bottom
const BOTTOM_MARGIN = 80; // Pixels from bottom where bubbles won't spawn

export function GameEngine({ 
  gameState, 
  score,
  onBubblePop, 
  onBlackBubblePop,
  screenWidth, 
  screenHeight 
}: GameEngineProps) {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  // Calculate speed level based on score (every 500 points)
  const getSpeedLevel = () => Math.floor(score / 500);
  const speedLevel = getSpeedLevel();
  const isSpeedMode = speedLevel > 0;

  // Calculate effective play area (excluding bottom margin)
  const effectiveHeight = screenHeight - BOTTOM_MARGIN;

  const generateBubble = useCallback((): BubbleData => {
    // Black bubbles appear starting from speed level 1 (500+ points)
    // Chance increases with each speed level
    const blackBubbleChance = isSpeedMode ? Math.min(0.15 + (speedLevel * 0.05), 0.35) : 0;
    const shouldCreateBlackBubble = Math.random() < blackBubbleChance;
    
    if (shouldCreateBlackBubble) {
      // Black bubbles get smaller at higher speed levels
      const baseSize = Math.max(35 - (speedLevel * 2), 25);
      const size = baseSize + Math.random() * 8;
      return {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * (screenWidth - size),
        y: Math.random() * (effectiveHeight - size), // Use effective height
        color: '#1a1a1a',
        points: 0,
        size: size,
        type: 'black',
        createdAt: Date.now(),
      };
    }
    
    const colorData = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    
    // Size gets smaller with each speed level
    const sizeReduction = speedLevel * 1.5; // Reduce by 1.5px per speed level
    const sizeVariation = Math.random() * 6 - 3; // ±3 pixels variation
    const size = Math.max(colorData.baseSize - sizeReduction + sizeVariation, 15); // Minimum size of 15
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (screenWidth - size),
      y: Math.random() * (effectiveHeight - size), // Use effective height
      color: colorData.color,
      points: colorData.points,
      size: size,
      type: 'normal',
      createdAt: Date.now(),
    };
  }, [screenWidth, effectiveHeight, speedLevel, isSpeedMode]);

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

  // Generate bubbles with progressive speed increases
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Progressive speed: gets faster every 500 points
    // Base interval: 1500ms, reduces by 200ms per speed level, minimum 300ms
    const bubbleInterval = Math.max(1500 - (speedLevel * 200), 300);
    
    // More bubbles at higher speed levels
    const maxBubbles = Math.min(5 + speedLevel, 12);

    const interval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < maxBubbles) {
          return [...prev, generateBubble()];
        }
        return prev;
      });
    }, bubbleInterval);

    return () => clearInterval(interval);
  }, [gameState, speedLevel, generateBubble]);

  // Auto-remove bubbles with progressive speed
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Progressive bubble lifetime: gets shorter every 500 points
    // Base lifetime: 2000ms, reduces by 250ms per speed level, minimum 800ms
    const bubbleLifetime = Math.max(2000 - (speedLevel * 250), 800);

    const cleanupInterval = setInterval(() => {
      setBubbles(prev => {
        const now = Date.now();
        return prev.filter(bubble => {
          // Remove bubbles that have exceeded their lifetime
          return (now - bubble.createdAt) < bubbleLifetime;
        });
      });
    }, 200); // Check every 200ms for precise timing

    return () => clearInterval(cleanupInterval);
  }, [gameState, speedLevel]);

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
    <View style={[styles.container, { height: effectiveHeight }]}>
      {bubbles.map(bubble => (
        bubble.type === 'black' ? (
          <BlackBubble
            key={bubble.id}
            bubble={bubble}
            onPop={handleBubblePop}
            speedLevel={speedLevel}
          />
        ) : (
          <Bubble
            key={bubble.id}
            bubble={bubble}
            onPop={handleBubblePop}
            speedLevel={speedLevel}
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