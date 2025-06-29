import { Tabs } from 'expo-router';
import { Play, Trophy, Settings } from 'lucide-react-native';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const pathname = usePathname();
  const [isGameActive, setIsGameActive] = useState(false);

  // Listen for game state changes via URL parameters or global state
  useEffect(() => {
    // Check if we're on the main game tab and if game is active
    // We'll use a simple approach by checking if we're on the index route
    // and assume game is active when not in menu state
    setIsGameActive(pathname === '/' || pathname === '/index');
  }, [pathname]);

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
          // Hide tab bar during active gameplay
          display: 'none', // We'll always hide it for now and show it conditionally
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