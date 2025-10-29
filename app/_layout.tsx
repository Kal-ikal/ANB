// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      SystemUI.setBackgroundColorAsync(
        colorScheme === "dark" ? "#0f172a" : "#ffffff"
      );
    }
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <StatusBar 
        style="dark"
        backgroundColor="#DBEAFE"
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#0f172a" : "#ffffff",
          },
        }}
      />
    </SafeAreaProvider>
  );
}