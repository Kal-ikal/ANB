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
          // Force navigation bar to be visible, absolute (floating), and transparent
          await NavigationBar.setPositionAsync('absolute');
          await NavigationBar.setVisibilityAsync('visible');
          await NavigationBar.setBehaviorAsync('inset-touch');
          await NavigationBar.setBackgroundColorAsync("#00000000"); // Transparent

          // Adaptive Icons (usually Light/White on Dark content, or Dark on Light content)
          // Since we have a bottom tab bar, let's stick to 'light' or 'dark' based on general theme?
          // User requirement: "System UI Strategy (Absolute & Safe)"
          // The tab bar is floating, so the background behind the nav bar will be the app content.
          // Let's set button style to light by default for better visibility on dark backgrounds,
          // or we can adjust based on theme if needed later. For now, stick to standard/light.
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
             NavigationBar.setPositionAsync('absolute');
             NavigationBar.setBackgroundColorAsync("#00000000");
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
            {/* Transparent status bar for edge-to-edge look */}
            <StatusBar translucent backgroundColor="transparent" style="dark" />
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
