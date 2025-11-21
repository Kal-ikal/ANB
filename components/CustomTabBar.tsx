import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnUI,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import {
  Menu,
  X,
  Home,
  FileText,
  DollarSign,
  User,
  Settings,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define menu items
const MENU_ITEMS = [
  { name: "Home", route: "/home", icon: Home, color: "#3B82F6" },
  { name: "Pengajuan", route: "/pengajuan", icon: FileText, color: "#10B981" },
  { name: "Konversi", route: "/konversi", icon: DollarSign, color: "#F59E0B" },
  { name: "Profile", route: "/profile", icon: User, color: "#8B5CF6" },
  { name: "Settings", route: "/settings", icon: Settings, color: "#6B7280" },
];

const FAB_SIZE = 56;
const ITEM_SIZE = 48;
const RADIUS = 100; // Distance from FAB center when expanded

// Reanimated Component wrappers
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Shared Values
  const isOpen = useSharedValue(0); // 0 = closed, 1 = open

  const toggleMenu = useCallback(() => {
    // Strict use of runOnUI for performance is handled by Reanimated automatically for shared value updates
    // but logic is simple here.
    isOpen.value = withSpring(isOpen.value === 0 ? 1 : 0, {
      mass: 0.5,
      damping: 12,
      stiffness: 100,
    });
  }, []);

  const closeMenu = useCallback(() => {
    isOpen.value = withSpring(0, { mass: 0.5, damping: 12 });
  }, []);

  const handleNavigation = useCallback(
    (route: string) => {
      closeMenu();
      // Small delay to allow animation to start before navigation (prevents stutter)
      setTimeout(() => {
        router.push(route as any);
      }, 50);
    },
    [closeMenu, router]
  );

  // Animated Styles
  const fabStyle = useAnimatedStyle(() => {
    const rotate = interpolate(isOpen.value, [0, 1], [0, 45], Extrapolation.CLAMP);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const blurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen.value, { duration: 200 }),
      zIndex: isOpen.value === 0 ? -1 : 50, // Hide when closed
    };
  });

  // Calculate menu item position (Fan out animation)
  const getMenuItemStyle = (index: number, total: number) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAnimatedStyle(() => {
      // Fan out angles: typically from 180 (left) to 90 (up) or similar.
      // Let's do a fan out from bottom-right corner.
      // Angles: 180 (Left) to 90 (Up).
      // Total arc = 90 degrees.
      // Step = 90 / (total - 1).

      const startAngle = 180;
      const endAngle = 270; // 270 is Top (0 is Right, 90 Down, 180 Left, 270 Up) in standard math, but screen coords y is down.
      // Using radians for sin/cos. 0 is right (x+), PI/2 is down (y+).
      // We want Up (y-) and Left (x-).
      // Angles between 180 deg (PI) and 270 deg (1.5 PI).

      const angleStep = (270 - 180) / (total - 1);
      const angleDeg = 270 - (index * angleStep); // Spread from top down to left
      const angleRad = (angleDeg * Math.PI) / 180;

      const radius = interpolate(isOpen.value, [0, 1], [0, RADIUS], Extrapolation.CLAMP);
      const scale = interpolate(isOpen.value, [0, 1], [0.5, 1], Extrapolation.CLAMP);
      const opacity = interpolate(isOpen.value, [0, 0.5, 1], [0, 0, 1], Extrapolation.CLAMP);

      const translateX = Math.cos(angleRad) * radius;
      const translateY = Math.sin(angleRad) * radius;

      return {
        transform: [
          { translateX },
          { translateY },
          { scale },
        ],
        opacity,
      };
    });
  };

  return (
    <>
      {/* Full Screen Blur Overlay */}
      <AnimatedBlurView
        intensity={30}
        tint="light"
        style={[
          {
            position: "absolute",
            top: -Dimensions.get("window").height, // Cover entire screen
            left: 0,
            right: 0,
            bottom: 0,
            height: Dimensions.get("window").height * 2, // Ensure coverage
          },
          blurStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={closeMenu} />
      </AnimatedBlurView>

      {/* Floating Action Button Container */}
      <View
        style={{
          position: "absolute",
          bottom: Platform.OS === "ios" ? insets.bottom + 20 : 20,
          right: 20,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100, // Above content
        }}
      >
        {/* Menu Items */}
        {MENU_ITEMS.map((item, index) => {
          const isActive = pathname.startsWith(item.route);
          const animatedStyle = getMenuItemStyle(index, MENU_ITEMS.length);

          return (
            <AnimatedPressable
              key={item.name}
              onPress={() => handleNavigation(item.route)}
              style={[
                {
                  position: "absolute",
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  borderRadius: ITEM_SIZE / 2,
                  backgroundColor: isActive ? item.color : "white",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                },
                animatedStyle,
              ]}
            >
              <item.icon
                size={20}
                color={isActive ? "white" : item.color}
              />
              {/* Optional Label (fade in?) - keeping clean icon only for now to match spec "Navigation buttons" */}
            </AnimatedPressable>
          );
        })}

        {/* Main FAB */}
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={0.9}
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
            backgroundColor: "#2563EB",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <Animated.View style={fabStyle}>
            <Menu color="white" size={28} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
}
