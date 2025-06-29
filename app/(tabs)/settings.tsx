import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Vibrate, Info, Skull, Timer, Zap, Target } from 'lucide-react-native';
import { useSettingsStore } from '@/hooks/useSettingsStore';

export default function SettingsScreen() {
  const {
    soundEnabled,
    hapticsEnabled,
    setSoundEnabled,
    setHapticsEnabled,
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
                🚀 Every 500 points increases speed level{'\n'}
                ⚡ Higher levels = faster spawning & disappearing{'\n'}
                💀 Avoid black skull bubbles - they end the game!{'\n'}
                🏆 Unlimited speed progression - how far can you go?
              </Text>
            </View>
          </View>

          {/* Progressive Speed System */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progressive Speed System</Text>
            <View style={styles.speedCard}>
              <View style={styles.speedHeader}>
                <Zap size={24} color="#ff4757" />
                <Text style={styles.speedTitle}>Every 500 Points = Faster Action!</Text>
              </View>
              <View style={styles.speedList}>
                <Text style={styles.speedText}>🎯 Level 0 (0-499): Normal Mode</Text>
                <Text style={styles.speedText}>🚀 Level 1 (500+): Speed Mode + Skulls</Text>
                <Text style={styles.speedText}>⚡ Level 2 (1000+): Turbo Mode</Text>
                <Text style={styles.speedText}>💥 Level 3 (1500+): Hyper Mode</Text>
                <Text style={styles.speedText}>🔥 Level 4 (2000+): Ultra Mode</Text>
                <Text style={styles.speedText}>💀 Level 5+ (2500+): Insane Mode</Text>
              </View>
              <Text style={styles.speedNote}>
                Each level increases bubble spawn rate, disappearing speed, and adds more bubbles on screen!
              </Text>
            </View>
          </View>

          {/* Bubble Values */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bubble Values</Text>
            <View style={styles.bubbleValues}>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#FF6B9D',
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                }]} />
                <Text style={styles.bubblePoints}>10 pts</Text>
                <Text style={styles.bubbleSize}>Pink</Text>
                <Text style={styles.bubbleTime}>+1s</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#4ECDC4',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                }]} />
                <Text style={styles.bubblePoints}>20 pts</Text>
                <Text style={styles.bubbleSize}>Teal</Text>
                <Text style={styles.bubbleTime}>+1s</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#45B7D1',
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                }]} />
                <Text style={styles.bubblePoints}>30 pts</Text>
                <Text style={styles.bubbleSize}>Blue</Text>
                <Text style={styles.bubbleTime}>+1s</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { 
                  backgroundColor: '#FFD700',
                  width: 21,
                  height: 21,
                  borderRadius: 10.5,
                }]} />
                <Text style={styles.bubblePoints}>50 pts</Text>
                <Text style={styles.bubbleSize}>Gold</Text>
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
                Starting at Speed Level 1 (500+ points), dangerous black bubbles appear. 
                They spawn faster and disappear quicker at higher speed levels. 
                One touch = instant game over!
              </Text>
              <View style={styles.skullPreview}>
                <View style={styles.blackBubblePreview}>
                  <Skull size={16} color="#ff4757" strokeWidth={2} />
                </View>
                <Text style={styles.dangerLabel}>GAME OVER!</Text>
              </View>
            </View>
          </View>

          {/* Strategy Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pro Strategy Tips</Text>
            <View style={styles.strategyCard}>
              <View style={styles.strategyHeader}>
                <Target size={24} color="#4ECDC4" />
                <Text style={styles.strategyTitle}>Master the Speed Levels</Text>
              </View>
              <Text style={styles.strategyText}>
                • Build up time in early levels before speed increases{'\n'}
                • Focus on higher-value bubbles when action gets intense{'\n'}
                • Use both thumbs for better coverage at high speeds{'\n'}
                • Stay calm - panic leads to skull bubble hits{'\n'}
                • Each speed level requires faster reflexes{'\n'}
                • Practice precision - more bubbles appear simultaneously{'\n'}
                • Plan your moves - higher levels are unforgiving!
              </Text>
            </View>
          </View>

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
    marginBottom: 12,
  },
  speedText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
  },
  speedNote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    textAlign: 'center',
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
    width: 32,
    height: 32,
    borderRadius: 16,
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