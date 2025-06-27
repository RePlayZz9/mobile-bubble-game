import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Vibrate, Info, RefreshCw } from 'lucide-react-native';
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

          {/* Game Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                🎯 Tap bubbles to pop them and earn points{'\n'}
                ⚡ Different colored bubbles have different point values{'\n'}
                🎮 You have 60 seconds to get the highest score{'\n'}
                📈 Level up every 500 points for more challenge{'\n'}
                🏆 Beat your high score and compete with yourself!
              </Text>
            </View>
          </View>

          {/* Bubble Values */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bubble Values</Text>
            <View style={styles.bubbleValues}>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { backgroundColor: '#FF6B9D' }]} />
                <Text style={styles.bubblePoints}>10 pts</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { backgroundColor: '#4ECDC4' }]} />
                <Text style={styles.bubblePoints}>20 pts</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { backgroundColor: '#45B7D1' }]} />
                <Text style={styles.bubblePoints}>30 pts</Text>
              </View>
              <View style={styles.bubbleValue}>
                <View style={[styles.bubblePreview, { backgroundColor: '#FFD700' }]} />
                <Text style={styles.bubblePoints}>50 pts</Text>
              </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
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