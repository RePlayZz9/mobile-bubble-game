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
  isSpeedMode?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Bubble({ bubble, onPop, isSpeedMode = false }: BubbleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Entrance animation - much faster
    const springConfig = isSpeedMode 
      ? { damping: 15, stiffness: 200 }
      : { damping: 12, stiffness: 150 };
    
    scale.value = withSpring(1, springConfig);

    // Faster floating animation
    const startFloating = () => {
      const floatDistance = isSpeedMode ? 8 : 6;
      const floatDuration = isSpeedMode ? 600 : 1000;
      
      translateY.value = withSequence(
        withTiming(-floatDistance, { duration: floatDuration }),
        withTiming(floatDistance, { duration: floatDuration }),
        withTiming(0, { duration: floatDuration }),
      );
    };

    const timer = setTimeout(startFloating, Math.random() * 300);
    const floatingInterval = setInterval(startFloating, isSpeedMode ? 1800 : 3000);

    // Auto-fade effect for faster disappearance
    const fadeDelay = isSpeedMode ? 800 : 1500; // Start fading much earlier
    const fadeTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: isSpeedMode ? 400 : 500 });
    }, fadeDelay);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
      clearInterval(floatingInterval);
    };
  }, [isSpeedMode]);

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Very fast pop animation
    const popDuration = isSpeedMode ? 80 : 100;
    const fadeDuration = isSpeedMode ? 150 : 200;
    
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
        isSpeedMode && styles.speedModeBubble,
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
      
      {/* Speed mode glow effect */}
      {isSpeedMode && (
        <Animated.View
          style={[
            styles.speedGlow,
            {
              width: bubble.size + 8,
              height: bubble.size + 8,
              borderRadius: (bubble.size + 8) / 2,
              top: -4,
              left: -4,
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
    shadowColor: '#ff4757',
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
    borderWidth: 2,
    borderColor: 'rgba(255, 71, 87, 0.4)',
  },
});