import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, RotateCcw, Chrome as Home, Skull, Clock, Zap } from 'lucide-react-native';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  highScore: number;
  reason: 'time' | 'blackBubble';
  speedLevel?: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export function GameOverModal({ 
  visible, 
  score, 
  highScore, 
  reason,
  speedLevel = 0,
  onPlayAgain, 
  onMenu 
}: GameOverModalProps) {
  const isNewHighScore = score === highScore && score > 0;
  const isBlackBubbleGameOver = reason === 'blackBubble';

  const getGameOverMessage = () => {
    if (isBlackBubbleGameOver) {
      return "You hit a skull bubble!";
    }
    return "Time's up!";
  };

  const getGameOverColors = () => {
    if (isBlackBubbleGameOver) {
      return ['#ff4757', '#ff3742'];
    }
    return ['#667eea', '#764ba2'];
  };

  const getIcon = () => {
    if (isBlackBubbleGameOver) {
      return <Skull size={40} color="white" strokeWidth={2.5} />;
    }
    return <Clock size={40} color="white" strokeWidth={2.5} />;
  };

  const getSpeedAchievement = () => {
    if (speedLevel === 0) return null;
    
    const achievements = [
      { level: 1, name: "Speed Mode", icon: "🚀", color: "#ff4757" },
      { level: 2, name: "Turbo Mode", icon: "⚡", color: "#ff6b35" },
      { level: 3, name: "Hyper Mode", icon: "💥", color: "#ff9500" },
      { level: 4, name: "Ultra Mode", icon: "🔥", color: "#ffcc00" },
      { level: 5, name: "Insane Mode", icon: "💀", color: "#ff0080" },
    ];
    
    const achievement = achievements.find(a => a.level === speedLevel) || 
                      { level: speedLevel, name: `Insane x${speedLevel}`, icon: "💀", color: "#ff0080" };
    
    return (
      <View style={[styles.achievementBadge, { borderColor: achievement.color + '50' }]}>
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <Text style={[styles.achievementText, { color: achievement.color }]}>
          {achievement.name} Reached!
        </Text>
        <Zap size={16} color={achievement.color} />
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={getGameOverColors()}
            style={styles.modalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              {getIcon()}
            </View>

            {isNewHighScore && !isBlackBubbleGameOver && (
              <View style={styles.newHighScoreBadge}>
                <Trophy size={20} color="#FFD700" />
                <Text style={styles.newHighScoreText}>NEW HIGH SCORE!</Text>
              </View>
            )}

            {getSpeedAchievement()}

            <Text style={styles.gameOverTitle}>Game Over</Text>
            <Text style={styles.gameOverMessage}>{getGameOverMessage()}</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Final Score</Text>
              <Text style={styles.finalScore}>{score}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{highScore}</Text>
                  <Text style={styles.statLabel}>High Score</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>Level {speedLevel}</Text>
                  <Text style={styles.statLabel}>Speed Reached</Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain}>
                <LinearGradient
                  colors={['#FF6B9D', '#C44569']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <RotateCcw size={20} color="white" />
                  <Text style={styles.buttonText}>Play Again</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuButton} onPress={onMenu}>
                <View style={styles.menuButtonContent}>
                  <Home size={20} color="white" />
                  <Text style={styles.menuButtonText}>Menu</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 350,
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
  newHighScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  newHighScoreText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  achievementIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  gameOverMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  playAgainButton: {
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
});