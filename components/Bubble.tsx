import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface BubbleData {
  id: string;
  x: number;
  y: number;
  color: string;
  points: number;
  size: number;
  createdAt: number;
}

interface BubbleProps {
  bubble: BubbleData;
  onPop: (bubble: BubbleData) => void;
  speedLevel?: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Bubble({ bubble, onPop, speedLevel = 0 }: BubbleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Entrance animation - gets faster with speed level
    const springConfig = {
      damping: Math.min(8 + speedLevel * 2, 20),
      stiffness: Math.min(100 + speedLevel * 25, 250)
    };
    
    scale.value = withSpring(1, springConfig);

    // Faster floating animation at higher speed levels
    const startFloating = () => {
      const floatDistance = Math.max(10 - speedLevel, 4);
      const floatDuration = Math.max(1000 - speedLevel * 150, 400);
      
      translateY.value = withSequence(
        withTiming(-floatDistance, { duration: floatDuration }),
        withTiming(floatDistance, { duration: floatDuration }),
        withTiming(0, { duration: floatDuration }),
      );
    };

    const timer = setTimeout(startFloating, Math.random() * 300);
    const floatingInterval = setInterval(startFloating, Math.max(3000 - speedLevel * 400, 1000));

    // Progressive auto-fade - gets much faster at higher speed levels
    const fadeDelay = Math.max(1500 - speedLevel * 200, 600);
    const fadeTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: Math.max(500 - speedLevel * 50, 200) });
    }, fadeDelay);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
      clearInterval(floatingInterval);
    };
  }, [speedLevel]);

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Very fast pop animation at higher speed levels
    const popDuration = Math.max(100 - speedLevel * 10, 50);
    const fadeDuration = Math.max(200 - speedLevel * 20, 100);
    
    scale.value = withSequence(
      withTiming(1.2, { duration: popDuration }),
      withTiming(0, { duration: fadeDuration - popDuration }),
    );
    
    opacity.value = withTiming(0, { duration: fadeDuration });

    // Call onPop after animation
    setTimeout(() => {
      runOnJS(onPop)(bubble);
    }, fadeDuration);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const getGradientColors = (baseColor: string) => {
    // Create lighter and darker versions of the base color
    const lighter = baseColor + '99'; // Add alpha for lighter effect
    const darker = baseColor + 'CC';  // Add alpha for darker effect
    return [lighter, baseColor, darker];
  };

  const getSpeedGlowIntensity = () => {
    if (speedLevel === 0) return null;
    
    // Different glow colors for different speed levels
    const glowColors = [
      '#ff4757', // Level 1 (500+)
      '#ff6b35', // Level 2 (1000+)
      '#ff9500', // Level 3 (1500+)
      '#ffcc00', // Level 4 (2000+)
      '#ff0080', // Level 5+ (2500+)
    ];
    
    const colorIndex = Math.min(speedLevel - 1, glowColors.length - 1);
    return glowColors[colorIndex];
  };

  const speedGlowColor = getSpeedGlowIntensity();

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.bubble,
        {
          left: bubble.x,
          top: bubble.y,
          width: bubble.size,
          height: bubble.size,
          borderRadius: bubble.size / 2,
        },
        animatedStyle,
        speedLevel > 0 && styles.speedModeBubble,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors(bubble.color)}
        style={[
          styles.bubbleGradient,
          {
            width: bubble.size,
            height: bubble.size,
            borderRadius: bubble.size / 2,
          },
        ]}
        start={{ x: 0.3, y: 0.3 }}
        end={{ x: 0.8, y: 0.8 }}
      />
      
      {/* Shine effect */}
      <Animated.View
        style={[
          styles.shine,
          {
            width: bubble.size * 0.3,
            height: bubble.size * 0.3,
            borderRadius: bubble.size * 0.15,
            top: bubble.size * 0.15,
            left: bubble.size * 0.2,
          },
        ]}
      />
      
      {/* Progressive speed glow effect */}
      {speedGlowColor && (
        <Animated.View
          style={[
            styles.speedGlow,
            {
              width: bubble.size + (4 + speedLevel * 2),
              height: bubble.size + (4 + speedLevel * 2),
              borderRadius: (bubble.size + (4 + speedLevel * 2)) / 2,
              top: -(2 + speedLevel),
              left: -(2 + speedLevel),
              borderColor: speedGlowColor + '60', // Add transparency
              borderWidth: Math.min(1 + speedLevel * 0.5, 3),
            },
          ]}
        />
      )}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  speedModeBubble: {
    shadowOpacity: 0.5,
    elevation: 12,
  },
  bubbleGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  speedGlow: {
    position: 'absolute',
  },
});