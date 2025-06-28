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
  createdAt: number;
}

interface BlackBubbleProps {
  bubble: BubbleData;
  onPop: (bubble: BubbleData) => void;
  speedLevel?: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function BlackBubble({ bubble, onPop, speedLevel = 0 }: BlackBubbleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Entrance animation - gets much faster with speed level
    const springConfig = {
      damping: Math.min(10 + speedLevel * 3, 25),
      stiffness: Math.min(150 + speedLevel * 30, 300)
    };
    
    scale.value = withSpring(1, springConfig);

    // Faster and more aggressive floating at higher speed levels
    const startFloating = () => {
      const floatDistance = Math.min(10 + speedLevel * 2, 20);
      const floatDuration = Math.max(800 - speedLevel * 100, 300);
      
      translateY.value = withSequence(
        withTiming(-floatDistance, { duration: floatDuration }),
        withTiming(floatDistance, { duration: floatDuration }),
        withTiming(0, { duration: floatDuration }),
      );
    };

    // Much faster and more intense pulsing at higher speed levels
    const pulseDuration = Math.max(400 - speedLevel * 50, 150);
    const pulseIntensity = Math.min(1.15 + speedLevel * 0.05, 1.4);
    
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(pulseIntensity, { duration: pulseDuration }),
        withTiming(1, { duration: pulseDuration })
      ),
      -1,
      true
    );

    const timer = setTimeout(startFloating, Math.random() * 200);
    const floatingInterval = setInterval(startFloating, Math.max(2500 - speedLevel * 300, 800));

    // Progressive auto-fade - gets extremely fast at higher speed levels
    const fadeDelay = Math.max(1500 - speedLevel * 250, 500);
    const fadeTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: Math.max(500 - speedLevel * 60, 150) });
    }, fadeDelay);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
      clearInterval(floatingInterval);
    };
  }, [speedLevel]);

  const handlePress = () => {
    // Strong haptic feedback for danger
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Very fast dramatic pop animation at higher speed levels
    const popDuration = Math.max(150 - speedLevel * 15, 75);
    const fadeDuration = Math.max(300 - speedLevel * 30, 150);
    
    scale.value = withSequence(
      withTiming(1.4, { duration: popDuration }),
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

  const getSpeedGlowIntensity = () => {
    if (speedLevel === 0) return { borderWidth: 2, borderColor: 'rgba(255, 71, 87, 0.3)' };
    
    // Progressive glow intensity
    const borderWidth = Math.min(2 + speedLevel * 0.5, 4);
    const opacity = Math.min(0.3 + speedLevel * 0.1, 0.8);
    
    return {
      borderWidth,
      borderColor: `rgba(255, 71, 87, ${opacity})`,
    };
  };

  const glowStyle = getSpeedGlowIntensity();

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
        speedLevel > 0 && {
          ...styles.speedModeBlackBubble,
          shadowRadius: Math.min(12 + speedLevel * 2, 20),
          elevation: Math.min(12 + speedLevel * 2, 20),
        },
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
      
      {/* Progressive red glow border */}
      <Animated.View
        style={[
          styles.glowBorder,
          {
            width: bubble.size + (4 + speedLevel * 2),
            height: bubble.size + (4 + speedLevel * 2),
            borderRadius: (bubble.size + (4 + speedLevel * 2)) / 2,
            top: -(2 + speedLevel),
            left: -(2 + speedLevel),
            ...glowStyle,
          },
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
  },
});