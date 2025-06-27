import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pause, Clock, Star } from 'lucide-react-native';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  level: number;
  onPause: () => void;
}

export function GameHeader({ score, timeLeft, level, onPause }: GameHeaderProps) {
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

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.statItem}>
          <Star size={20} color="#FFD700" />
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <Text style={styles.statLabel}>Score</Text>
      </View>

      <View style={styles.centerSection}>
        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Pause size={24} color="white" fill="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.timeContainer}>
          <View style={styles.statItem}>
            <Clock size={20} color={getTimeColor()} />
            <Text style={[styles.timeValue, { color: getTimeColor() }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Text style={styles.levelText}>Level {level}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  leftSection: {
    alignItems: 'center',
    flex: 1,
  },
  centerSection: {
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  levelText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});