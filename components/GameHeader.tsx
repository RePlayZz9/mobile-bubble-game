import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pause, Clock, Star, Target, Timer } from 'lucide-react-native';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  level: number;
  levelTimeLeft: number;
  requiredScore: number;
  onPause: () => void;
}

export function GameHeader({ 
  score, 
  timeLeft, 
  level, 
  levelTimeLeft, 
  requiredScore, 
  onPause 
}: GameHeaderProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (time: number) => {
    if (time <= 10) return '#FF4757';
    if (time <= 30) return '#FFA502';
    return 'white';
  };

  const getProgressColor = () => {
    const progress = score / requiredScore;
    if (progress >= 1) return '#2ed573';
    if (progress >= 0.7) return '#ffa502';
    return '#ff4757';
  };

  const getProgressPercentage = () => {
    return Math.min((score / requiredScore) * 100, 100);
  };

  return (
    <View style={styles.container}>
      {/* Top Row */}
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
            <Clock size={18} color={getTimeColor(timeLeft)} />
            <Text style={[styles.timeValue, { color: getTimeColor(timeLeft) }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>

      {/* Level Progress Row */}
      <View style={styles.levelRow}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Level {level}</Text>
          <View style={styles.levelTimer}>
            <Timer size={16} color={getTimeColor(levelTimeLeft)} />
            <Text style={[styles.levelTimeText, { color: getTimeColor(levelTimeLeft) }]}>
              {formatTime(levelTimeLeft)}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Target size={16} color={getProgressColor()} />
            <Text style={styles.progressText}>
              {score}/{requiredScore}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressColor()
                }
              ]} 
            />
          </View>
        </View>
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
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  levelTimer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelTimeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressSection: {
    flex: 1,
    marginLeft: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
});