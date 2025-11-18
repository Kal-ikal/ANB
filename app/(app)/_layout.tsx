//app/(app)/_layout.tsx
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Home, FileText, User, Settings, DollarSign } from 'lucide-react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        sceneStyle: styles.scene,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: styles.tabLabel,
        // Nonaktifkan animasi default tab untuk transisi yang lebih smooth
        animation: 'none',
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="pengajuan" 
        options={{ 
          title: 'Pengajuan',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="konversi" 
        options={{ 
          title: 'Konversi',
          tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E5E5',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  scene: {
    backgroundColor: '#EFF6FF',
  },
});