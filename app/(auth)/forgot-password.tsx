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
import { Mail } from "lucide-react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleResetPassword = () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulasi API
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    router.push("../(auth)/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 pt-16 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center max-w-md mx-auto w-full">
          {/* 🧩 Header */}
          <View className="mb-12">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Reset Password
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 text-center">
              Enter your email and we&apos;ll send you instructions to reset your password
            </Text>
          </View>

          {/* 🧩 Form atau pesan sukses */}
          {!isSuccess ? (
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Email Address
                </Text>

                {/* 🧩 Wrapper Input */}
                <View
                  className="flex-row items-center border rounded-lg px-3"
                  style={{
                    borderColor: error ? "#ef4444" : "#d1d5db", // merah saat error
                    backgroundColor: "#1f2937", // dark:bg-gray-800
                  }}
                >
                  {/* 🧩 Ikon Mail, tidak absolute lagi */}
                  <Mail size={20} color="#94a3b8" style={{ marginRight: 8 }} />

                  {/* 🧩 Input email */}
                  <TextInput
                    className="flex-1 py-3 text-base text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {error ? (
                  <Text className="text-red-500 text-sm mt-1">{error}</Text>
                ) : null}
              </View>

              {/* 🧩 Tombol kirim */}
              <TouchableOpacity
                className={`py-3.5 rounded-xl items-center justify-center mb-4 ${
                  isLoading
                    ? "bg-blue-400 dark:bg-blue-500"
                    : "bg-blue-600 dark:bg-blue-500"
                }`}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text className="text-white font-semibold text-base">
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-gray-600 dark:text-gray-300">
                  Remember your password?{" "}
                </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text className="text-blue-600 dark:text-blue-400 font-medium">
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // 🧩 Tampilan sukses
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 items-center space-y-4">
              <View className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Text className="text-green-600 dark:text-green-400 text-3xl">✓</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Check Your Email
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 text-center">
                We&apos;ve sent password reset instructions to {email}. Please check your inbox or spam folder.
              </Text>
              <TouchableOpacity
                className="w-full py-3.5 rounded-xl items-center justify-center bg-blue-600 dark:bg-blue-500 mt-2"
                onPress={handleBackToLogin}
              >
                <Text className="text-white font-semibold text-base">Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 🧩 Footer */}
          <View className="mt-8">
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
              Didn&apos;t receive the email? Check your spam folder or{"\n"}
              <Text className="text-blue-600 dark:text-blue-400">
                contact support
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
