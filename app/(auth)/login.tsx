import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail, CheckCircle, XCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { Ionicons } from '@expo/vector-icons';

// Enable Tailwind support for components
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
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: null, message: '' });
    }, 2250
  );
  };

  const handleLogin = () => {
    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        
        // Mock login logic - replace with actual API call
        if (email === "user@example.com" && password === "password123") {
          showAlert('success', 'Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            router.replace("../(app)/home");
          }, 500);
        } else {
          showAlert('error', 'Invalid email or password. Please try again.');
        }
      }, 1500);
    } else {
      showAlert('error', 'Please fill in all fields correctly.');
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
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
          className="flex-1 px-6 pt-16 pb-10"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header Section dengan back button yang sejajar */}
          <View className="mb-16">
            <View className="flex-row items-center mb-8">
              <TouchableOpacity 
                onPress={() => router.replace("/")}
                className="bg-white/20 p-3 rounded-full mr-4"
              >
                <Ionicons name="arrow-back-outline" size={28} color="white" />
              </TouchableOpacity>
              <View>
                <Text className="text-white text-4xl font-bold">
                  Welcome Back
                </Text>
                <Text className="text-blue-100 text-xl mt-2">
                  Sign in to continue your journey
                </Text>
              </View>
            </View>
          </View>

          {/* Login Card */}
          <View className="bg-white rounded-2xl p-6 shadow-lg shadow-black/25">
            <Text className="text-gray-800 text-2xl font-bold mb-6">Login</Text>

            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <View className={`flex-row items-center border rounded-lg px-4 py-3 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}>
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
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className={`flex-row items-center border rounded-lg px-4 py-3 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}>
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
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="ml-2"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="text-gray-500" size={20} />
                  ) : (
                    <Eye className="text-gray-500" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              className="items-end mb-6"
              onPress={handleForgotPassword}
            >
              <Text className="text-blue-500 font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`bg-blue-500 rounded-xl py-4 mb-6 items-center justify-center shadow-md shadow-black/25 ${
                isLoading ? 'opacity-70' : 'active:bg-blue-600 active:scale-95'
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-lg font-semibold">
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Alert Notification */}
          {alert.type && (
            <View 
              className={`mt-6 mx-6 p-4 rounded-xl border-l-4 shadow-lg shadow-black/25 flex-row items-center space-x-3 ${
                alert.type === 'success' 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}
              >
              {alert.type === 'success' ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <Text 
                className={`flex-1 text-base font-medium ${
                  alert.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {alert.message}
              </Text>
              <TouchableOpacity 
                onPress={() => setAlert({ type: null, message: '' })}
                className="p-1"
              >
                <Text className={`text-lg font-bold ${
                  alert.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-blue-100 text-center text-sm">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}