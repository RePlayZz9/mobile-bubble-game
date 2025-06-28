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
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function BlackBubble({ bubble, onPop }: BlackBubbleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Entrance animation
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
    });

    // Menacing floating animation
    const startFloating = () => {
      translateY.value = withSequence(
        withTiming(-15, { duration: 1500 }),
        withTiming(15, { duration: 1500 }),
        withTiming(0, { duration: 1500 }),
      );
    };

    // Pulsing effect to make it look dangerous
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );

    const timer = setTimeout(startFloating, Math.random() * 1000);
    const floatingInterval = setInterval(startFloating, 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(floatingInterval);
    };
  }, []);

  const handlePress = () => {
    // Strong haptic feedback for danger
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Dramatic pop animation
    scale.value = withSequence(
      withTiming(1.5, { duration: 200 }),
      withTiming(0, { duration: 300 }),
    );
    
    opacity.value = withTiming(0, { duration: 500 });

    // Call onPop after animation
    setTimeout(() => {
      runOnJS(onPop)(bubble);
    }, 500);
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
      
      {/* Red glow border */}
      <Animated.View
        style={[
          styles.glowBorder,
          {
            width: bubble.size + 4,
            height: bubble.size + 4,
            borderRadius: (bubble.size + 4) / 2,
            top: -2,
            left: -2,
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
});