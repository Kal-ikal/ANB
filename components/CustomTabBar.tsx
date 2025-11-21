import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Home,
  DollarSign,
  User,
  Settings,
  Plus,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const TabIcon = ({
  name,
  color,
  focused,
}: {
  name: string;
  color: string;
  focused: boolean;
}) => {
  switch (name) {
    case 'home':
      return <Home size={24} color={color} />;
    case 'pengajuan':
      return <Plus size={28} color="#FFFFFF" />; // Prominent icon
    case 'konversi':
      return <DollarSign size={24} color={color} />;
    case 'profile':
      return <User size={24} color={color} />;
    case 'settings':
      return <Settings size={24} color={color} />;
    default:
      return <Home size={24} color={color} />;
  }
};

// Helper component to handle individual tab logic and animations
// This fixes the "React Hook called inside a callback" error
const TabItem = ({
  route,
  index,
  state,
  navigation,
}: {
  route: any;
  index: number;
  state: any;
  descriptors: any;
  navigation: any;
}) => {
  // Removed unused 'options' from destructuring
  const isFocused = state.index === index;
  const isProminent = route.name === 'pengajuan';

  const scale = useSharedValue(1);

  const onPress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Render Prominent Center Button
  if (isProminent) {
    return (
      <AnimatedTouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={[animatedStyle]}
        className="relative -top-6"
        activeOpacity={0.9}
      >
        <View
          className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-lg shadow-blue-500/50 border-4 border-[#EFF6FF] dark:border-gray-900"
        >
          <TabIcon name={route.name} color="#FFFFFF" focused={isFocused} />
        </View>
      </AnimatedTouchableOpacity>
    );
  }

  // Render Standard Tab Item
  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[animatedStyle, { flex: 1 }]}
      className="items-center justify-center h-full"
      activeOpacity={0.7}
    >
      <TabIcon
        name={route.name}
        color={isFocused ? '#2563EB' : '#9CA3AF'}
        focused={isFocused}
      />
    </AnimatedTouchableOpacity>
  );
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // Removed unused insets

  return (
    <View
      className="absolute bottom-5 left-5 right-5 flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-full shadow-xl"
      style={{
        paddingBottom: Platform.OS === 'ios' ? 0 : 0, // Insets handled by absolute positioning logic
        height: 64,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      {state.routes.map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          index={index}
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />
      ))}
    </View>
  );
}
