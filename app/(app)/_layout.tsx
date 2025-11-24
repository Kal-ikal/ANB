import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        // Ensure the default tab bar is completely hidden from layout
        tabBarStyle: { display: 'none' },
      }}
      // Pass props to CustomTabBar to handle navigation state
      tabBar={(props) => <CustomTabBar {...props} />}
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
