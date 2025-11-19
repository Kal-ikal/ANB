import { View, TouchableOpacity, Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface TabItem {
  name: string;
  route: string;
  label: string;
}

const tabs: TabItem[] = [
  { name: "home", route: "/home", label: "Home" },
  { name: "pengajuan", route: "/pengajuan", label: "Pengajuan" },
  { name: "konversi", route: "/konversi", label: "Konversi" },
  { name: "settings", route: "/settings", label: "Settings" },
  { name: "profile", route: "/profile", label: "Profile" },
];

function getIconByRouteName(routeName: string, color: string) {
  switch (routeName) {
    case "home":
      return <Feather name="home" size={18} color={color} />;
    case "pengajuan":
      return <MaterialIcons name="autorenew" size={24} color={color} />;
    case "konversi":
      return <Feather name="refresh-cw" size={18} color={color} />;
    case "settings":
      return <Ionicons name="settings-outline" size={18} color={color} />;
    case "profile":
      return <FontAwesome6 name="circle-user" size={18} color={color} />;
    default:
      return <Feather name="home" size={18} color={color} />;
  }
}

export default function CustomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Determine active tab name
  const getActiveTab = () => {
    // Normalize pathname, remove casting from expo-router
    const cleanPath = pathname.replace(/^\//, "").split("/")[0];

    // Handle root route
    if (cleanPath === "" || cleanPath === "(app)") return "home" as const;

    const matchedTab = tabs.find((tab) => cleanPath === tab.name);
    return matchedTab ? matchedTab.name : "home";
  };

  const activeTab = getActiveTab();

  return (
    <View
      className="absolute left-0 right-0 flex items-center justify-center px-10"
      style={{
        bottom: Platform.OS === "ios" ? insets.bottom + 20 : 40,
      }}
    >
      <LinearGradient
        colors={["#3B82F6", "#1D4ED8", "#1E40AF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row justify-center items-center rounded-full px-3 py-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        {tabs.map((tab) => {
          const isFocused = activeTab === tab.name;

          const onPress = () => {
            router.push(tab.route as any);
          };

          return (
            <AnimatedTouchableOpacity
              layout={LinearTransition.springify().mass(0.5)}
              key={tab.name}
              onPress={onPress}
              className={`flex-row justify-center items-center h-9 px-3.5 rounded-full ${
                isFocused ? "bg-white" : "bg-transparent"
              }`}
              activeOpacity={0.7}
            >
              {getIconByRouteName(
                tab.name,
                isFocused ? "#1E40AF" : "#FFFFFF"
              )}
              {isFocused && (
                <Animated.Text
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  className="text-blue-900 ml-2 font-medium"
                >
                  {tab.label}
                </Animated.Text>
              )}
            </AnimatedTouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}
