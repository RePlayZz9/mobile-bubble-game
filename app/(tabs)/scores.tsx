import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Star, Target, Clock } from 'lucide-react-native';
import { useGameStore } from '@/hooks/useGameStore';

export default function ScoresScreen() {
  const { 
    getHighScore, 
    getAllScores, 
    getGamesPlayed, 
    getTotalBubblesPopped,
    getTotalTimePlayed,
    clearScores 
  } = useGameStore();

  const scores = getAllScores();
  const highScore = getHighScore();
  const gamesPlayed = getGamesPlayed();
  const totalBubbles = getTotalBubblesPopped();
  const totalTime = getTotalTimePlayed();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Statistics</Text>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Trophy size={32} color="#FFD700" />
              <Text style={styles.statValue}>{highScore}</Text>
              <Text style={styles.statLabel}>High Score</Text>
            </View>
            
            <View style={styles.statCard}>
              <Target size={32} color="#FF6B9D" />
              <Text style={styles.statValue}>{gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            
            <View style={styles.statCard}>
              <Star size={32} color="#4ECDC4" />
              <Text style={styles.statValue}>{totalBubbles}</Text>
              <Text style={styles.statLabel}>Bubbles Popped</Text>
            </View>
            
            <View style={styles.statCard}>
              <Clock size={32} color="#45B7D1" />
              <Text style={styles.statValue}>{formatTime(totalTime)}</Text>
              <Text style={styles.statLabel}>Time Played</Text>
            </View>
          </View>

          {/* Recent Scores */}
          <View style={styles.scoresSection}>
            <Text style={styles.sectionTitle}>Recent Scores</Text>
            {scores.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No games played yet!</Text>
                <Text style={styles.emptySubtext}>Play your first game to see scores here</Text>
              </View>
            ) : (
              <View style={styles.scoresList}>
                {scores.slice(0, 10).map((score, index) => (
                  <View key={index} style={styles.scoreItem}>
                    <View style={styles.scoreRank}>
                      <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                    <View style={styles.scoreInfo}>
                      <Text style={styles.scoreValue}>{score.score}</Text>
                      <Text style={styles.scoreDate}>
                        {new Date(score.date).toLocaleDateString()}
                      </Text>
                    </View>
                    {index === 0 && (
                      <Trophy size={20} color="#FFD700" />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Clear Scores Button */}
          {scores.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearScores}>
              <Text style={styles.clearButtonText}>Clear All Scores</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  scoresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  scoresList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },
  clearButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
});