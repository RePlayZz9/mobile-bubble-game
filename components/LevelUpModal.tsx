import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Zap, Skull } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface LevelUpModalProps {
  visible: boolean;
  level: number;
}

export function LevelUpModal({ visible, level }: LevelUpModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      );
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getLevelMessage = () => {
    if (level === 5) {
      return "Danger Zone! Black skulls appear!";
    } else if (level >= 10) {
      return `Master Level! Need ${400 + (level * 100)} points!`;
    } else if (level >= 7) {
      return `Expert Level! Need ${400 + (level * 100)} points!`;
    } else if (level >= 5) {
      return `Advanced Level! Need ${400 + (level * 100)} points!`;
    } else if (level >= 3) {
      return `Getting faster! Need ${400 + (level * 100)} points!`;
    }
    return `Speed increasing! Need ${400 + (level * 100)} points!`;
  };

  const getIcon = () => {
    if (level === 5) {
      return <Skull size={32} color="#ff4757" />;
    } else if (level >= 5) {
      return <Zap size={32} color="#FFD700" />;
    }
    return <Trophy size={32} color="#FFD700" />;
  };

  const getColors = () => {
    if (level === 5) {
      return ['#ff4757', '#ff3742'];
    } else if (level >= 10) {
      return ['#a55eea', '#8b5cf6'];
    } else if (level >= 7) {
      return ['#26de81', '#20bf6b'];
    }
    return ['#FFD700', '#FFA502'];
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <LinearGradient
            colors={getColors()}
            style={styles.modalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {getIcon()}
            <Text style={styles.levelUpTitle}>Level {level}!</Text>
            <Text style={styles.levelUpMessage}>{getLevelMessage()}</Text>
            <Text style={styles.timerText}>1 minute to reach target!</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalGradient: {
    padding: 24,
    alignItems: 'center',
  },
  levelUpTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  levelUpMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
});