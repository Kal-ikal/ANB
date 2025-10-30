import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="konversi" />
        <Stack.Screen name="pengajuan" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
      </Stack>
    </SafeAreaProvider>
  );
}
