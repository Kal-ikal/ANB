import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Home,
  FileText,
  DollarSign,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnUI,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

// Tab configuration matching the routes
const TABS = [
  { name: "home", icon: Home, label: "Home" },
  { name: "pengajuan", icon: FileText, label: "Apply" },
  { name: "konversi", icon: DollarSign, label: "Convert" },
  { name: "profile", icon: User, label: "Profile" },
  { name: "settings", icon: Settings, label: "Settings" },
];

const FAB_SIZE = 56;
const EXPANDED_HEIGHT = 70;
const PADDING_HORIZONTAL = 20;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  // Animation State
  const isExpanded = useSharedValue(0); // 0 = collapsed, 1 = expanded

  const toggleMenu = () => {
    // Toggle between 0 and 1
    isExpanded.value = withSpring(isExpanded.value === 0 ? 1 : 0, {
      damping: 15,
      stiffness: 120,
    });
  };

  const closeMenu = () => {
    isExpanded.value = withTiming(0, { duration: 200 });
  };

  const onTabPress = (routeKey: string, routeName: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }

    // Auto collapse after navigation
    closeMenu();
  };

  // Animated Styles

  // Container animates width from FAB size to full width
  const containerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      isExpanded.value,
      [0, 1],
      [FAB_SIZE, SCREEN_WIDTH - PADDING_HORIZONTAL * 2],
      Extrapolation.CLAMP
    );

    const borderRadius = interpolate(
      isExpanded.value,
      [0, 1],
      [FAB_SIZE / 2, 20],
      Extrapolation.CLAMP
    );

    return {
      width,
      borderRadius,
    };
  });

  // FAB Icon Rotation (Menu -> X)
  const fabIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(isExpanded.value, [0, 1], [0, 90]);
    const opacity = interpolate(isExpanded.value, [0, 0.5], [1, 0]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
      opacity,
    };
  });

  // Close Icon Rotation/Opacity
  const closeIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(isExpanded.value, [0, 1], [-90, 0]);
    const opacity = interpolate(isExpanded.value, [0.5, 1], [0, 1]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
      opacity,
      position: 'absolute',
    };
  });

  // Tab Items Opacity & Translation
  const tabsContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(isExpanded.value, [0.7, 1], [0, 1]);
    const translateX = interpolate(isExpanded.value, [0, 1], [20, 0]);

    return {
      opacity,
      transform: [{ translateX }],
      // Hide completely when collapsed to avoid touch events
      display: isExpanded.value < 0.1 ? 'none' : 'flex',
    };
  });

  // Overlay to handle tap outside
  const overlayStyle = useAnimatedStyle(() => {
    return {
      display: isExpanded.value > 0.1 ? "flex" : "none",
      opacity: isExpanded.value,
    };
  });

  return (
    <>
      {/* Transparent Overlay for Tap Outside */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: Dimensions.get("window").height,
            backgroundColor: "rgba(0,0,0,0.3)", // Slight dim
            zIndex: 49,
          },
          overlayStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={closeMenu} />
      </Animated.View>

      {/* The Floating Pill / FAB */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: Platform.OS === "ios" ? insets.bottom + 10 : 20,
            right: 20,
            height: FAB_SIZE,
            backgroundColor: "#2563EB", // Primary Blue
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between", // Space between tabs and fab-toggle
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            zIndex: 50,
          },
          containerStyle,
        ]}
      >
        {/* Tab Items (Visible only when expanded) */}
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              paddingLeft: 10,
              paddingRight: FAB_SIZE + 5, // Make room for the toggle button
            },
            tabsContainerStyle
          ]}
        >
          {TABS.map((tab) => {
            const routeIndex = state.routes.findIndex(r => r.name === tab.name);
            if (routeIndex === -1) return null;

            const route = state.routes[routeIndex];
            const isFocused = state.index === routeIndex;
            const color = isFocused ? "#FFFFFF" : "rgba(255,255,255,0.6)";

            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => onTabPress(route.key, tab.name, isFocused)}
                style={{ alignItems: 'center', paddingVertical: 8 }}
              >
                <tab.icon size={20} color={color} />
                <Text style={{ color, fontSize: 10, marginTop: 2, fontWeight: isFocused ? '600' : '400' }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Toggle Button (Menu / Close) - Always Anchored Right */}
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={0.9}
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            alignItems: "center",
            justifyContent: "center",
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <Animated.View style={fabIconStyle}>
            <Menu color="white" size={24} />
          </Animated.View>
          <Animated.View style={closeIconStyle}>
            <X color="white" size={24} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
