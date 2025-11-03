// hooks/useNavbar.ts
import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from '../context/ThemeContext';

export const useNavbar = () => {
  const { isDarkMode } = useTheme();

  // FIX: Tambahkan dependencies array
  const configureNavbar = useCallback(async () => {
    if (Platform.OS === "android") {
      try {
        const backgroundColor = isDarkMode ? "#111827" : "#EFF6FF";
        const buttonStyle = isDarkMode ? "light" : "dark";
        
        await NavigationBar.setBackgroundColorAsync(backgroundColor);
        await NavigationBar.setButtonStyleAsync(buttonStyle);
      } catch (error) {
        console.log("Navbar config error:", error);
      }
    }
  }, [isDarkMode]); // ✅ Tambahkan isDarkMode sebagai dependency

  // Reset navbar setiap kali screen focused
  useFocusEffect(
    useCallback(() => {
      configureNavbar();
    }, [configureNavbar]) // ✅ Tambahkan configureNavbar sebagai dependency
  );

  // Juga reset pada mount dan ketika theme berubah
  useEffect(() => {
    configureNavbar();
  }, [configureNavbar]); // ✅ Tambahkan configureNavbar sebagai dependency

  return { configureNavbar };
};