// app/(app)/_layout.tsx
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: "Dashboard"
        }} 
      />
      <Stack.Screen 
        name="pengajuan" 
        options={{ 
          headerShown: false,
          title: "Apply Leave"
        }} 
      />
      <Stack.Screen 
        name="konversi" 
        options={{ 
          headerShown: false,
          title: "Convert Leave"
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerShown: false,
          title: "My Profile"
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          headerShown: false,
          title: "Settings"
        }} 
      />
    </Stack>
  );
}