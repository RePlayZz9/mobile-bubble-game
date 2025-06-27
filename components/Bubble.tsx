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
}

interface BubbleProps {
  bubble: BubbleData;
  onPop: (bubble: BubbleData) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function Bubble({ bubble, onPop }: BubbleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
    });

    // Floating animation
    const startFloating = () => {
      translateY.value = withSequence(
        withTiming(-10, { duration: 2000 }),
        withTiming(10, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      );
    };

    const timer = setTimeout(startFloating, Math.random() * 1000);
    const floatingInterval = setInterval(startFloating, 6000);

    return () => {
      clearTimeout(timer);
      clearInterval(floatingInterval);
    };
  }, []);

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Pop animation
    scale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(0, { duration: 200 }),
    );
    
    opacity.value = withTiming(0, { duration: 350 });

    // Call onPop after animation
    setTimeout(() => {
      runOnJS(onPop)(bubble);
    }, 350);
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
  bubbleGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});