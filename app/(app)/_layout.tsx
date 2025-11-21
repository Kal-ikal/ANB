import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import CustomTabBar from '@/components/CustomTabBar';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home',
        }} 
      />
      <Tabs.Screen 
        name="konversi"
        options={{ 
          title: 'Konversi',
        }} 
      />
      <Tabs.Screen 
        name="pengajuan"
        options={{ 
          title: 'Pengajuan',
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
