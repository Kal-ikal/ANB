import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, AppState } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import "./global.css";

export default function RootLayout() {
  useEffect(() => {
    const configureNavbar = async () => {
      if (Platform.OS === "android") {
        try {
          await NavigationBar.setBackgroundColorAsync("#EFF6FF");
          await NavigationBar.setButtonStyleAsync("dark");
        } catch (error) {
          console.log("Navbar config error:", error);
        }
      }
    };

    configureNavbar();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        setTimeout(configureNavbar, 100);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        style="dark"
        backgroundColor="#EFF6FF"
        translucent={false}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right", // default untuk semua
          contentStyle: { backgroundColor: "#EFF6FF" },
        }}
      >
        {/* Halaman utama (index.tsx / landing) */}
        <Stack.Screen
          name="index"
          options={{ animation: "slide_from_left" }}
        />

        {/* Grup (auth) - animasi masuk dari kiri */}
        <Stack.Screen
          name="(auth)"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
