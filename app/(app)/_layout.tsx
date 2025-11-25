import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';
import { useTheme } from '@/context/ThemeContext';

export default function AppLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        // Ensure the default tab bar is completely hidden from layout
        tabBarStyle: { display: 'none' },
        // Fix white flash by matching background to theme
        sceneStyle: {
            backgroundColor: isDarkMode ? '#111827' : '#F7F7F7' // gray-900 or gray-50
        },
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
