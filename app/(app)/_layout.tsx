//app/(app)/_layout.tsx
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import CustomTabBar from '@/components/CustomTabBar';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Hide default tab bar since we render our custom overlay FAB
        tabBarShowLabel: false,
        // Ensure the standard tab bar is hidden completely layout-wise
        tabBarStyle: { display: 'none' },
      }}
      // We pass a function that renders the custom tab bar overlay.
      // Note: Expo Router / React Navigation puts this component at the bottom of the screen container.
      // Because our CustomTabBar uses absolute positioning and portals (effectively via absolute),
      // it will float correctly.
      tabBar={(props) => <CustomTabBar />}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home',
        }} 
      />
      <Tabs.Screen 
        name="pengajuan" 
        options={{ 
          title: 'Pengajuan',
        }} 
      />
      <Tabs.Screen 
        name="konversi" 
        options={{ 
          title: 'Konversi',
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
        }} 
      />
    </Tabs>
  );
}
