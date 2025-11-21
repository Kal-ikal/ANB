//app/(app)/_layout.tsx
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import CustomTabBar from '@/components/CustomTabBar';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Hide default tab bar
        tabBarShowLabel: false,
        // animation: 'none', // No longer standard option, handled by custom tab
      }}
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

const styles = StyleSheet.create({
  // Styles moved to CustomTabBar or irrelevant now
});
