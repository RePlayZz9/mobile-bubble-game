import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pause, Clock, Star, Zap } from 'lucide-react-native';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  onPause: () => void;
}

export function GameHeader({ score, timeLeft, onPause }: GameHeaderProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 10) return '#FF4757';
    if (timeLeft <= 30) return '#FFA502';
    return 'white';
  };

  const getSpeedLevel = () => Math.floor(score / 500);
  const speedLevel = getSpeedLevel();

  const getSpeedIndicator = () => {
    if (speedLevel === 0) {
      return {
        text: 'NORMAL',
        color: '#4ECDC4',
        icon: '🎯'
      };
    } else if (speedLevel === 1) {
      return {
        text: 'SPEED MODE',
        color: '#ff4757',
        icon: '🚀'
      };
    } else if (speedLevel === 2) {
      return {
        text: 'TURBO MODE',
        color: '#ff6b35',
        icon: '⚡'
      };
    } else if (speedLevel === 3) {
      return {
        text: 'HYPER MODE',
        color: '#ff9500',
        icon: '💥'
      };
    } else if (speedLevel === 4) {
      return {
        text: 'ULTRA MODE',
        color: '#ffcc00',
        icon: '🔥'
      };
    } else {
      return {
        text: `INSANE x${speedLevel}`,
        color: '#ff0080',
        icon: '💀'
      };
    }
  };

  const speedInfo = getSpeedIndicator();
  const nextMilestone = (speedLevel + 1) * 500;
  const pointsToNext = nextMilestone - score;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.scoreSection}>
          <View style={styles.statItem}>
            <Star size={18} color="#FFD700" />
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <Text style={styles.statLabel}>Score</Text>
        </View>

        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Pause size={20} color="white" fill="white" />
        </TouchableOpacity>

        <View style={styles.timeSection}>
          <View style={styles.statItem}>
            <Clock size={18} color={getTimeColor()} />
            <Text style={[styles.timeValue, { color: getTimeColor() }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Text style={styles.statLabel}>Time Left</Text>
        </View>
      </View>

      <View style={styles.speedRow}>
        <View style={[styles.speedIndicator, { borderColor: speedInfo.color }]}>
          <Text style={styles.speedIcon}>{speedInfo.icon}</Text>
          <Text style={[styles.speedText, { color: speedInfo.color }]}>
            {speedInfo.text}
          </Text>
          {speedLevel > 0 && (
            <Zap size={16} color={speedInfo.color} style={styles.zapIcon} />
          )}
        </View>
        
        {speedLevel < 10 && (
          <Text style={styles.nextMilestone}>
            {pointsToNext} points to next speed level
          </Text>
        )}
        
        {speedLevel >= 5 && (
          <Text style={styles.insaneWarning}>
            ⚠️ MAXIMUM DIFFICULTY REACHED!
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreSection: {
    alignItems: 'center',
    flex: 1,
  },
  timeSection: {
    alignItems: 'center',
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 6,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pauseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  speedRow: {
    alignItems: 'center',
  },
  speedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    marginBottom: 8,
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
  nextMilestone: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 4,
  },
  insaneWarning: {
    fontSize: 11,
    color: '#ff0080',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});