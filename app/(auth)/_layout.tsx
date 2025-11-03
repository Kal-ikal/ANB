import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    // Pengaturan ini berlaku untuk SEMUA layar di grup (auth)
    <Stack screenOptions={{ headerShown: false }}>

      {/* Pengaturan spesifik untuk 'login' */}
      <Stack.Screen
        name="login"
        options={{
          animation: 'fade',
        }}
      />

      {/* Pengaturan spesifik untuk 'forgot-password' */}
      <Stack.Screen
        name="forgot-password"
        options={{
          // Animasi ini akan slide & fade dari bawah saat masuk,
          // dan slide & fade ke bawah saat keluar (pop).
          animation: 'fade_from_bottom',
        }}
      />

    </Stack>
  );
}