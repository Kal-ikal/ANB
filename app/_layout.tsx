import { useEffect, useState, useCallback } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Platform, AppState } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { enableScreens, enableFreeze } from "react-native-screens";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCustomBackHandler } from '../hooks/useCustomBackHandler';
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { AuthGuard } from "../components/AuthGuard";
import "./global.css";

// ✅ Optimize screen performance
enableScreens(true);
enableFreeze(true);

export default function RootLayout() {
  useCustomBackHandler();

  useEffect(() => {
    const configNav = async () => {
      if (Platform.OS === "android") {
        try {
          // Force navigation bar to be visible and consistent with Black background
          await NavigationBar.setVisibilityAsync('visible');
          await NavigationBar.setBehaviorAsync('inset-touch');
          await NavigationBar.setBackgroundColorAsync("#000000"); // Black background
          await NavigationBar.setButtonStyleAsync("light"); // Light icons
        } catch (e) {
          console.error("Failed to configure navigation bar:", e);
        }
      }
    };

    // Initial config
    configNav();

    // Re-apply on AppState change to fix "disappearing" bug
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        setTimeout(configNav, 100);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <StatusBar style="dark" backgroundColor="#EFF6FF" />
            <AuthGuard />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#EFF6FF" },
                freezeOnBlur: true,
                animation: "slide_from_right",
                animationDuration: 300,
                gestureEnabled: true,
                gestureDirection: "horizontal",
                fullScreenGestureEnabled: true,
              }}
            >
              <Stack.Screen name="index" options={{ animation: "fade", gestureEnabled: false }} />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(modals)" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
