import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Skull } from 'lucide-react-native';

interface BubbleData {
  id: string;
  x: number;
  y: number;
  color: string;
  points: number;
  size: number;
  type: 'normal' | 'black';
}

interface BlackBubbleProps {
  bubble: BubbleData;
  onPop: (bubble: BubbleData) => void;
  isSpeedMode?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function BlackBubble({ bubble, onPop, isSpeedMode = false }: BlackBubbleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Entrance animation - faster in speed mode
    const springConfig = isSpeedMode 
      ? { damping: 12, stiffness: 150 }
      : { damping: 8, stiffness: 100 };
    
    scale.value = withSpring(1, springConfig);

    // Menacing floating animation - more aggressive in speed mode
    const startFloating = () => {
      const floatDistance = isSpeedMode ? 20 : 15;
      const floatDuration = isSpeedMode ? 800 : 1500;
      
      translateY.value = withSequence(
        withTiming(-floatDistance, { duration: floatDuration }),
        withTiming(floatDistance, { duration: floatDuration }),
        withTiming(0, { duration: floatDuration }),
      );
    };

    // Pulsing effect - faster and more intense in speed mode
    const pulseDuration = isSpeedMode ? 400 : 800;
    const pulseIntensity = isSpeedMode ? 1.2 : 1.1;
    
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(pulseIntensity, { duration: pulseDuration }),
        withTiming(1, { duration: pulseDuration })
      ),
      -1,
      true
    );

    const timer = setTimeout(startFloating, Math.random() * 500);
    const floatingInterval = setInterval(startFloating, isSpeedMode ? 2500 : 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(floatingInterval);
    };
  }, [isSpeedMode]);

  const handlePress = () => {
    // Strong haptic feedback for danger
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Dramatic pop animation - faster in speed mode
    const popDuration = isSpeedMode ? 150 : 200;
    const fadeDuration = isSpeedMode ? 300 : 500;
    
    scale.value = withSequence(
      withTiming(1.5, { duration: popDuration }),
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
      { scale: scale.value * pulseScale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

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
        isSpeedMode && styles.speedModeBlackBubble,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#2c2c2c', '#1a1a1a', '#000000']}
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
      >
        <Skull 
          size={bubble.size * 0.4} 
          color="#ff4757" 
          strokeWidth={2.5}
        />
      </LinearGradient>
      
      {/* Dark shine effect */}
      <Animated.View
        style={[
          styles.shine,
          {
            width: bubble.size * 0.25,
            height: bubble.size * 0.25,
            borderRadius: bubble.size * 0.125,
            top: bubble.size * 0.2,
            left: bubble.size * 0.25,
          },
        ]}
      />
      
      {/* Red glow border - more intense in speed mode */}
      <Animated.View
        style={[
          styles.glowBorder,
          {
            width: bubble.size + (isSpeedMode ? 8 : 4),
            height: bubble.size + (isSpeedMode ? 8 : 4),
            borderRadius: (bubble.size + (isSpeedMode ? 8 : 4)) / 2,
            top: isSpeedMode ? -4 : -2,
            left: isSpeedMode ? -4 : -2,
          },
          isSpeedMode && styles.speedModeGlow,
        ]}
      />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    shadowColor: '#ff4757',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  speedModeBlackBubble: {
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 16,
  },
  bubbleGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff4757',
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  glowBorder: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  speedModeGlow: {
    borderWidth: 2,
    borderColor: 'rgba(255, 71, 87, 0.6)',
  },
});