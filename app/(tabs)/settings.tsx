import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Vibrate, Info, RefreshCw, Skull, Timer, Zap, Target } from 'lucide-react-native';
import { useSettingsStore } from '@/hooks/useSettingsStore';

export default function SettingsScreen() {
  const {
    soundEnabled,
    hapticsEnabled,
    setSoundEnabled,
    setHapticsEnabled,
    resetSettings,
  } = useSettingsStore();

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Settings</Text>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Game Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                {soundEnabled ? (
                  <Volume2 size={24} color="#4ECDC4" />
                ) : (
                  <VolumeX size={24} color="#8A8A8E" />
                )}
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>
                    Play sound effects during gameplay
                  </Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#767577', true: '#4ECDC4' }}
                thumbColor={soundEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Vibrate size={24} color={hapticsEnabled ? '#FF6B9D' : '#8A8A8E'} />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Vibrate when popping bubbles
                  </Text>
                </View>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: '#767577', true: '#FF6B9D' }}
                thumbColor={hapticsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Game Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                🎯 Tap bubbles to pop them and earn points{'\n'}
                ⏰ Each bubble adds 1 second to your timer{'\n'}
                🎪 Smaller bubbles = higher points (harder to hit!){'\n'}
                🚀 Game speeds up after reaching 500 points{'\n'}
                💀 Avoid black skull bubbles - they end the game!{'\n'}
                🏆 Keep popping to extend your time and beat your high score!
              </Text>
            </View>
          </View>

          {/* Risk vs Reward */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk vs Reward</Text>
            <View style={styles.riskCard}>
              <View style={styles.riskHeader}>
                <Target size={24} color="#FFD700" />
                <Text style={styles.riskTitle}>Bubble Difficulty</Text>
              </View>
              <Text style={styles.riskDescription}>
                Higher value bubbles are smaller and harder to hit, but give more points! 
                Choose your strategy: go for easy points or risk it for the big scores.
              </Text>
            </View>
          </View>

          {/* Speed Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Speed Mode</Text>
            <View style={styles.speedCard}>
              <View style={styles.speedHeader}>
                <Zap size={24} color="#ff4757" />
                <Text style={styles.speedTitle}>Activated at 500 Points</Text>
              </View>
              <View style={styles.speedList}>
                <Text style={styles.speedText}>⚡ Bubbles appear much faster</Text>
                <Text style={styles.speedText}>⏱️ Bubbles disappear very quickly</Text>
                <Text style={styles.speedText}>💀 Black skull bubbles start appearing</Text>
                <Text style={styles.speedText}>🎯 More bubbles on screen at once</Text>
              </View>
            </View>
          </View>

          {/* Bubble Values */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bubble Values & Sizes</Text>
            <View style={styles.bubbleValues}>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#FF6B9D',
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                }]} />
                <Text style={styles.bubblePoints}>10 pts</Text>
                <Text style={styles.bubbleSize}>Large</Text>
                <Text style={styles.bubbleTime}>+1s</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#4ECDC4',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }]} />
                <Text style={styles.bubblePoints}>20 pts</Text>
                <Text style={styles.bubbleSize}>Medium</Text>
                <Text style={styles.bubbleTime}>+1s</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#45B7D1',
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                }]} />
                <Text style={styles.bubblePoints}>30 pts</Text>
                <Text style={styles.bubbleSize}>Small</Text>
                <Text style={styles.bubbleTime}>+1s</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#FFD700',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                }]} />
                <Text style={styles.bubblePoints}>50 pts</Text>
                <Text style={styles.bubbleSize}>Tiny</Text>
                <Text style={styles.bubbleTime}>+1s</Text>
              </View>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <View style={styles.dangerCard}>
              <View style={styles.dangerHeader}>
                <Skull size={24} color="#ff4757" />
                <Text style={styles.dangerTitle}>Black Skull Bubbles</Text>
              </View>
              <Text style={styles.dangerText}>
                In Speed Mode (500+ points), dangerous black bubbles with skulls will appear. 
                Touching these will immediately end your game! They disappear very quickly, so stay alert.
              </Text>
              <View style={styles.skullPreview}>
                <View style={styles.blackBubblePreview}>
                  <Skull size={20} color="#ff4757" strokeWidth={2} />
                </View>
                <Text style={styles.dangerLabel}>GAME OVER!</Text>
              </View>
            </View>
          </View>

          {/* Time Strategy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strategy Tips</Text>
            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <Timer size={24} color="#4ECDC4" />
                <Text style={styles.strategyTitle}>Pro Tips</Text>
              </View>
              <Text style={styles.strategyText}>
                • Start with large bubbles to build up time{'\n'}
                • Go for small bubbles when you have time buffer{'\n'}
                • Each bubble only gives 1 second - be efficient{'\n'}
                • In Speed Mode, prioritize survival over high scores{'\n'}
                • Build up time before reaching 500 points{'\n'}
                • Stay calm when skull bubbles appear{'\n'}
                • Risk vs reward: small bubbles = big points!
              </Text>
            </View>
          </View>

          {/* Reset Settings */}
          <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
            <RefreshCw size={20} color="#FF6B9D" />
            <Text style={styles.resetButtonText}>Reset Settings</Text>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Info size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.appInfoText}>
              Bubble Pop v1.0.0 • Built with Expo
            </Text>
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  infoText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 22,
  },
  riskCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  riskDescription: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  speedCard: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  speedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  speedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4757',
    marginLeft: 8,
  },
  speedList: {
    gap: 8,
  },
  speedText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  bubbleValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  bubbleValue: {
    alignItems: 'center',
  },
  bubblePreview: {
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bubblePoints: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  bubbleSize: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  bubbleTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dangerCard: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4757',
    marginLeft: 8,
  },
  dangerText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    marginBottom: 16,
  },
  skullPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackBubblePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff4757',
    marginRight: 12,
  },
  dangerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff4757',
  },
  strategyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  strategyText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.3)',
  },
  resetButtonText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  appInfoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 8,
  },
});