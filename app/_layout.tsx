import { useEffect } from "react";
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

function NavigationBarConfig() {
  useEffect(() => {
    const configNav = async () => {
      if (Platform.OS === "android") {
        try {
          // Force navigation bar to be visible and consistent
          await NavigationBar.setVisibilityAsync('visible');
          await NavigationBar.setBehaviorAsync('inset-touch');
          // Always Black Background as per requirement
          await NavigationBar.setBackgroundColorAsync("#000000");
          // Adaptive Icons (usually Light/White on Black bg)
          await NavigationBar.setButtonStyleAsync("light");
        } catch (e) {
          console.error("Failed to configure navigation bar:", e);
        }
      }
    };

    configNav();
  }, []);

  // Re-apply on AppState change to fix "disappearing" bug (Android quirk)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
         if (Platform.OS === "android") {
             NavigationBar.setVisibilityAsync('visible');
             // Re-enforce black bg just in case
             NavigationBar.setBackgroundColorAsync("#000000");
         }
      }
    });
    return () => subscription.remove();
  }, []);

  return null;
}

export default function RootLayout() {
  useCustomBackHandler();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <NavigationBarConfig />
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
