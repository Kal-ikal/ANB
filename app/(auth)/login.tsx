import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

// Enable Tailwind for components
cssInterop(LinearGradient, { className: "style" });
cssInterop(Mail, { className: "style" });
cssInterop(Lock, { className: "style" });
cssInterop(Eye, { className: "style" });
cssInterop(EyeOff, { className: "style" });
cssInterop(CheckCircle, { className: "style" });
cssInterop(XCircle, { className: "style" });

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  // Animations
  const eyeAnim = useRef(new Animated.Value(1)).current;
  const alertAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Eye toggle animation
  const animateEye = () => {
    Animated.sequence([
      Animated.timing(eyeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.circle),
      }),
      Animated.timing(eyeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.circle),
      }),
    ]).start();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Alert animation (slide-up + scale)
  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    alertAnim.setValue(0);
    Animated.timing(alertAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Auto hide after 3.5 seconds for errors
    if (type === "error") {
      setTimeout(() => {
        Animated.timing(alertAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }).start(() => setAlert({ type: null, message: "" }));
      }, 3500);
    }
  };

  // Smooth fade-out transition with optimized delay
  const handleLogin = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        if (email === "user@example.com" && password === "password123") {
          showAlert("success", "Login successful! Redirecting...");
          
          // Optimized delay before fade out
          setTimeout(() => {
            // Smooth fade-out animation
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start(() => {
              router.replace("../(app)/home");
            });
          }, 1200); // Reduced to 1.8 seconds
        } else {
          showAlert("error", "Invalid email or password.");
        }
      }, 700); // Reduced loading time
    } else {
      showAlert("error", "Please fill in all fields correctly.");
    }
  };

  const handleForgotPassword = () => router.push("/forgot-password");

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Animated fade wrapper */}
        <Animated.View 
          style={{ 
            flex: 1, 
            opacity: fadeAnim,
          }}
        >
          <LinearGradient colors={["#3B82F6", "#60A5FA"]} className="flex-1 px-6 pt-16 pb-10">
            
            {/* Header */}
            <View className="mb-16">
              <View className="flex-row items-center mb-8">
                <TouchableOpacity
                  onPress={() => router.replace("/")}
                  className="bg-white/20 p-3 rounded-full mr-4"
                >
                  <Ionicons name="arrow-back-outline" size={28} color="white" />
                </TouchableOpacity>
                <View>
                  <Text className="text-white text-4xl font-bold">Welcome Back</Text>
                  <Text className="text-blue-100 text-xl mt-2">
                    Sign in to continue your journey
                  </Text>
                </View>
              </View>
            </View>

            {/* Login Card */}
            <View className="bg-white rounded-2xl p-6 shadow-lg shadow-black/25">
              <Text className="text-gray-800 text-2xl font-bold mb-6">Login</Text>

              {/* Email */}
              <View className="mb-5">
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <View
                  className={`flex-row items-center border rounded-lg px-4 py-3 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <Mail className="text-gray-500" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}
              </View>

              {/* Password */}
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Password</Text>
                <View
                  className={`flex-row items-center border rounded-lg px-4 py-3 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <Lock className="text-gray-500" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsPasswordVisible((prev) => !prev);
                      animateEye();
                    }}
                    className="ml-2"
                  >
                    <Animated.View
                      style={{
                        transform: [
                          {
                            scale: eyeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.7, 1],
                            }),
                          },
                        ],
                        opacity: eyeAnim,
                      }}
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="text-gray-500" size={20} />
                      ) : (
                        <Eye className="text-gray-500" size={20} />
                      )}
                    </Animated.View>
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="items-end mb-6" onPress={handleForgotPassword}>
                <Text className="text-blue-500 font-medium">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Button */}
              <TouchableOpacity
                className={`bg-blue-500 rounded-xl py-4 mb-6 items-center justify-center shadow-md shadow-black/25 ${
                  isLoading ? "opacity-70" : "active:bg-blue-600 active:scale-95"
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Animated Alert - POSITION ABSOLUTE di atas footer */}
            {alert.type && (
              <Animated.View
                style={{
                  opacity: alertAnim,
                  transform: [
                    {
                      translateY: alertAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                    {
                      scale: alertAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                  position: 'absolute',
                  bottom: 60,
                  left: 24,
                  right: 24,
                  zIndex: 999,
                }}
                className={`rounded-2xl py-4 px-5 shadow-lg shadow-black/30 flex-row items-center justify-between ${
                  alert.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <View className="flex-row items-center space-x-3 flex-1">
                  {alert.type === "success" ? (
                    <CheckCircle className="text-white" size={22} />
                  ) : (
                    <XCircle className="text-white" size={22} />
                  )}
                  <Text className="flex-1 text-white text-base font-semibold">
                    {alert.message}
                  </Text>
                </View>

                <TouchableOpacity 
                  onPress={() => {
                    Animated.timing(alertAnim, {
                      toValue: 0,
                      duration: 300,
                      easing: Easing.in(Easing.quad),
                      useNativeDriver: true,
                    }).start(() => setAlert({ type: null, message: "" }));
                  }}
                >
                  <Text className="text-white text-xl font-bold ml-2">×</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-blue-100 text-center text-sm">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}