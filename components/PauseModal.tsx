import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Chrome as Home, Pause, Clock, Star, Zap } from 'lucide-react-native';

interface PauseModalProps {
  visible: boolean;
  score: number;
  timeLeft: number;
  speedLevel: number;
  onResume: () => void;
  onMainMenu: () => void;
}

export function PauseModal({ 
  visible, 
  score, 
  timeLeft, 
  speedLevel,
  onResume, 
  onMainMenu 
}: PauseModalProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSpeedInfo = () => {
    if (speedLevel === 0) {
      return { text: 'NORMAL', color: '#4ECDC4', icon: '🎯' };
    } else if (speedLevel === 1) {
      return { text: 'SPEED MODE', color: '#ff4757', icon: '🚀' };
    } else if (speedLevel === 2) {
      return { text: 'TURBO MODE', color: '#ff6b35', icon: '⚡' };
    } else if (speedLevel === 3) {
      return { text: 'HYPER MODE', color: '#ff9500', icon: '💥' };
    } else if (speedLevel === 4) {
      return { text: 'ULTRA MODE', color: '#ffcc00', icon: '🔥' };
    } else {
      return { text: `INSANE x${speedLevel}`, color: '#ff0080', icon: '💀' };
    }
  };

  const speedInfo = getSpeedInfo();
  const nextMilestone = (speedLevel + 1) * 500;
  const pointsToNext = nextMilestone - score;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={styles.modalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Pause Icon */}
            <View style={styles.iconContainer}>
              <Pause size={40} color="white" fill="white" />
            </View>

            {/* Title */}
            <Text style={styles.pauseTitle}>Game Paused</Text>
            <Text style={styles.pauseSubtitle}>Take a breather!</Text>

            {/* Current Game Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Star size={20} color="#FFD700" />
                  <Text style={styles.statValue}>{score}</Text>
                  <Text style={styles.statLabel}>Score</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Clock size={20} color="#4ECDC4" />
                  <Text style={styles.statValue}>{formatTime(timeLeft)}</Text>
                  <Text style={styles.statLabel}>Time Left</Text>
                </View>
              </View>

              {/* Speed Level Indicator */}
              <View style={[styles.speedIndicator, { borderColor: speedInfo.color }]}>
                <Text style={styles.speedIcon}>{speedInfo.icon}</Text>
                <Text style={[styles.speedText, { color: speedInfo.color }]}>
                  {speedInfo.text}
                </Text>
                {speedLevel > 0 && (
                  <Zap size={16} color={speedInfo.color} style={styles.zapIcon} />
                )}
              </View>

              {/* Progress to Next Level */}
              {speedLevel < 10 && (
                <Text style={styles.progressText}>
                  {pointsToNext} points to next speed level
                </Text>
              )}
            </View>

            {/* Game Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipText}>• Each bubble adds +1 second</Text>
                <Text style={styles.tipText}>• Avoid black skull bubbles</Text>
                <Text style={styles.tipText}>• Speed increases every 500 points</Text>
                {speedLevel > 0 && (
                  <Text style={styles.tipText}>• Higher levels = smaller bubbles</Text>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resumeButton} onPress={onResume}>
                <LinearGradient
                  colors={['#4ECDC4', '#44A08D']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Play size={20} color="white" fill="white" />
                  <Text style={styles.buttonText}>Resume Game</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuButton} onPress={onMainMenu}>
                <View style={styles.menuButtonContent}>
                  <Home size={20} color="white" />
                  <Text style={styles.menuButtonText}>Main Menu</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Warning for Main Menu */}
            <Text style={styles.warningText}>
              ⚠️ Returning to main menu will end your current game
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 380,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 30,
    padding: 12,
    marginBottom: 16,
  },
  pauseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  pauseSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    minWidth: 100,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  speedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    marginBottom: 12,
  },
  speedIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  speedText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  zapIcon: {
    marginLeft: 6,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipsList: {
    gap: 4,
  },
  tipText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  resumeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menuButton: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});