import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Home,
  FileText,
  DollarSign,
  User,
  Settings,
} from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
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

const TAB_HEIGHT = 60;
const TAB_MARGIN = 20;
const PRIMARY_COLOR = "#130057"; // Dark Navy for active indicator
const INACTIVE_COLOR = "#94A3B8"; // Slate 400

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Use Zustand store instead of Context
  const isVisible = useTabBarStore((state) => state.isVisible);

  // Shared Value for animation
  const translateY = useSharedValue(0);

  // React to visibility changes
  useEffect(() => {
    // If visible -> 0 (show)
    // If hidden -> 100 + insets.bottom (hide below screen)
    const hideValue = 100 + insets.bottom;
    translateY.value = withTiming(isVisible ? 0 : hideValue, {
      duration: 300,
    });
  }, [isVisible, insets.bottom]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

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
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
            bottom: Platform.OS === 'ios' ? insets.bottom : 20,
        },
        animatedStyle,
      ]}
    >
      {TABS.map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        // If route not found in navigator, skip rendering
        if (routeIndex === -1) return null;

        const route = state.routes[routeIndex];
        const isFocused = state.index === routeIndex;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabPress(route.key, tab.name, isFocused)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <tab.icon size={24} color={isFocused ? "#FFFFFF" : INACTIVE_COLOR} />
            </View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: TAB_MARGIN,
    right: TAB_MARGIN,
    height: TAB_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 50, // Above content
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },
  activeIconContainer: {
      backgroundColor: PRIMARY_COLOR,
  },
});
