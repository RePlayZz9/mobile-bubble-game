import { Tabs } from 'expo-router';
import { Play, Trophy, Settings } from 'lucide-react-native';
import { useEffect, useState } from 'react';

// Global game state for tab bar visibility
let globalGameState: 'menu' | 'playing' | 'paused' | 'gameOver' = 'menu';
let tabLayoutUpdateCallback: ((state: string) => void) | null = null;

// Export function to update game state from other components
export const updateGlobalGameState = (state: 'menu' | 'playing' | 'paused' | 'gameOver') => {
  globalGameState = state;
  if (tabLayoutUpdateCallback) {
    tabLayoutUpdateCallback(state);
  }
};

export default function TabLayout() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');

  useEffect(() => {
    // Set up callback to receive game state updates
    tabLayoutUpdateCallback = (state: string) => {
      setGameState(state as 'menu' | 'playing' | 'paused' | 'gameOver');
    };

    // Initialize with current global state
    setGameState(globalGameState);

    return () => {
      tabLayoutUpdateCallback = null;
    };
  }, []);

  // Determine if tab bar should be visible
  const shouldShowTabBar = gameState === 'menu' || gameState === 'gameOver';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(20, 20, 30, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          // Conditionally show/hide tab bar
          display: shouldShowTabBar ? 'flex' : 'none',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#8A8A8E',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarIcon: ({ size, color }) => (
            <Play size={size} color={color} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scores"
        options={{
          title: 'Scores',
          tabBarIcon: ({ size, color }) => (
            <Trophy size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}