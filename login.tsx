import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
import { cssInterop } from "nativewind";

cssInterop(LinearGradient, {
  className: "style",
});

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/"); // Navigate to dashboard
    }, 1500);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={["#3B82F6", "#60A5FA"]}
          className="flex-1 px-6 pt-20 pb-10"
        >
          {/* Header */}
          <View className="mb-16">
            <Text className="text-white text-4xl font-bold mb-2">Welcome Back</Text>
            <Text className="text-blue-100 text-lg">
              Sign in to continue your journey
            </Text>
          </View>

          {/* Login Form */}
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-gray-800 text-2xl font-bold mb-6">Login</Text>
            
            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                <Mail color="#6B7280" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            
            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                <Lock color="#6B7280" size={20} className="mr-3" />
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeOff color="#6B7280" size={20} />
                  ) : (
                    <Eye color="#6B7280" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Forgot Password */}
            <TouchableOpacity 
              className="items-end mb-6"
              onPress={handleForgotPassword}
            >
              <Text className="text-blue-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
            
            {/* Login Button */}
            <TouchableOpacity
              className="bg-blue-500 rounded-xl py-4 mb-6 items-center justify-center shadow-md"
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-lg font-bold">
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
            
            {/* Register Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text className="text-blue-500 font-bold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-blue-100 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}