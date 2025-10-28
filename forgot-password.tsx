import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleResetPassword = () => {
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      Alert.alert(
        'Reset Instructions Sent',
        'Please check your email for password reset instructions. If you don\'t see the email, check your spam folder.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login')
          }
        ]
      );
    }, 1500);
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        className="px-6 pt-16 pb-8"
      >
        <View className="flex-1 justify-center max-w-md mx-auto w-full">
          <View className="mb-12">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Reset Password
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 text-center">
              Enter your email and we'll send you instructions to reset your password
            </Text>
          </View>

          {!isSuccess ? (
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Email Address
                </Text>
                <View className="relative">
                  <Mail 
                    size={20} 
                    color="#94a3b8" 
                    className="absolute left-3 top-3.5" 
                  />
                  <TextInput
                    className={`flex-1 pl-10 pr-4 py-3 rounded-lg border ${
                      error 
                        ? 'border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
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

              <TouchableOpacity
                className={`py-3.5 rounded-xl items-center justify-center mb-4 ${
                  isLoading 
                    ? 'bg-blue-400 dark:bg-blue-500' 
                    : 'bg-blue-600 dark:bg-blue-500'
                }`}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text className="text-white font-semibold text-base">
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-gray-600 dark:text-gray-300">
                  Remember your password?{' '}
                </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text className="text-blue-600 dark:text-blue-400 font-medium">
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 items-center">
              <View className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center mb-6">
                <Text className="text-green-600 dark:text-green-400 text-2xl">
                  ✓
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Check Your Email
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 text-center mb-6">
                We've sent password reset instructions to {email}
              </Text>
              <TouchableOpacity
                className="w-full py-3.5 rounded-xl items-center justify-center bg-blue-600 dark:bg-blue-500 mb-4"
                onPress={() => router.push('/login')}
              >
                <Text className="text-white font-semibold text-base">
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="mt-8">
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
              Didn't receive the email? Check your spam folder or{'\n'}
              <Text className="text-blue-600 dark:text-blue-400">contact support</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}