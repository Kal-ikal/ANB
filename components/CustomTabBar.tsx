import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Platform,
  BackHandler,
  StyleSheet,
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
import { useTabBarStore } from "@/hooks/useTabBarStore";

// Tab configuration matching the routes
const TABS = [
  { name: "home", icon: Home, label: "Home" },
  { name: "pengajuan", icon: FileText, label: "Apply" },
  { name: "konversi", icon: DollarSign, label: "Convert" },
  { name: "profile", icon: User, label: "Profile" },
  { name: "settings", icon: Settings, label: "Settings" },
];

const FAB_SIZE = 56;
const PADDING_HORIZONTAL = 20;
const PRIMARY_COLOR = "#130057"; // Dark Navy
const SECONDARY_COLOR = "#FFFFFF"; // White

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  // Animation State
  const isExpanded = useSharedValue(0); // 0 = collapsed, 1 = expanded

  // Global Store for TabBar State (for Back Handler Coordination)
  const setGlobalExpanded = useTabBarStore((s) => s.setExpanded);

  // Toggle Menu Function
  const toggleMenu = () => {
    const nextValue = isExpanded.value === 0 ? 1 : 0;
    isExpanded.value = withSpring(nextValue, {
      damping: 15,
      stiffness: 120,
    });
    setGlobalExpanded(nextValue === 1);
  };

  const closeMenu = useCallback(() => {
    isExpanded.value = withTiming(0, { duration: 250 });
    setGlobalExpanded(false);
  }, []);

  // Back Handler to close menu if expanded
  // We use useEffect because the TabBar is always mounted and we want this listener active
  useEffect(() => {
    const onBackPress = () => {
      // We check the shared value or store.
      // Since we are in JS thread here, using the store state is safe if synced.
      // But checking shared value directly is better if possible, but reading .value on JS thread works.
      if (isExpanded.value > 0.5) {
        closeMenu();
        return true; // Handle the back press
      }
      return false; // Propagate to next listener
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [closeMenu]);

  const onTabPress = (
    routeKey: string,
    routeName: string,
    isFocused: boolean
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }

    // Auto collapse after navigation
    setTimeout(() => {
        closeMenu();
    }, 150);
  };

  // Animated Styles

  // Container animates width from FAB size to full width (minus padding)
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
      [FAB_SIZE / 2, 40],
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
      position: "absolute",
    };
  });

  // Close Icon Rotation/Opacity
  const closeIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(isExpanded.value, [0, 1], [-90, 0]);
    const opacity = interpolate(isExpanded.value, [0.5, 1], [0, 1]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
      opacity,
      position: "absolute",
    };
  });

  // Tab Items Opacity & Translation
  const tabsContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(isExpanded.value, [0.6, 1], [0, 1]);
    const translateX = interpolate(isExpanded.value, [0, 1], [20, 0]);

    return {
      opacity,
      transform: [{ translateX }],
      display: isExpanded.value < 0.1 ? "none" : "flex",
    };
  });

  // Overlay to handle tap outside
  const overlayStyle = useAnimatedStyle(() => {
    return {
      display: isExpanded.value > 0.05 ? "flex" : "none",
      opacity: isExpanded.value,
    };
  });

  return (
    <>
      {/* Transparent Overlay for Tap Outside */}
      <Animated.View
        style={[
          styles.overlay,
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
            backgroundColor: PRIMARY_COLOR,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
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
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: 10,
              paddingRight: FAB_SIZE + 5,
              height: "100%",
            },
            tabsContainerStyle,
          ]}
        >
          {TABS.map((tab, index) => {
            const routeIndex = state.routes.findIndex(
              (r) => r.name === tab.name
            );
            if (routeIndex === -1) return null;

            const route = state.routes[routeIndex];
            const isFocused = state.index === routeIndex;

            const activeBg = isFocused ? SECONDARY_COLOR : "transparent";
            const iconColor = isFocused ? PRIMARY_COLOR : SECONDARY_COLOR;
            const textColor = isFocused ? PRIMARY_COLOR : SECONDARY_COLOR;

            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => onTabPress(route.key, tab.name, isFocused)}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  backgroundColor: activeBg,
                  borderRadius: 20,
                  gap: 6,
                }}
              >
                <tab.icon size={18} color={iconColor} />
                {isFocused && (
                  <Text
                    style={{
                      color: textColor,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Toggle Button (Menu / Close) */}
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={0.8}
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <Animated.View style={fabIconStyle}>
            <Menu color={SECONDARY_COLOR} size={24} />
          </Animated.View>
          <Animated.View style={closeIconStyle}>
            <X color={SECONDARY_COLOR} size={24} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: Dimensions.get("window").height,
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 49,
    }
});
