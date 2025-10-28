import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Calendar, BarChart2, Users, Shield } from 'lucide-react-native';

const LandingScreen = () => {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Calendar color="#3B82F6" size={24} />,
      title: "Easy Leave Requests",
      description: "Apply for leave in seconds with our intuitive interface"
    },
    {
      icon: <BarChart2 color="#10B981" size={24} />,
      title: "Track Usage",
      description: "Visualize your leave patterns with interactive charts"
    },
    {
      icon: <Users color="#8B5CF6" size={24} />,
      title: "Team Coordination",
      description: "See team availability and plan accordingly"
    },
    {
      icon: <Shield color="#F59E0B" size={24} />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your data"
    }
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-12 pb-6 px-6 bg-blue-50">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-blue-600">LeaveManager Pro</Text>
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="py-2 px-4 rounded-lg bg-white border border-blue-200"
          >
            <Text className="text-blue-600 font-medium">Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="px-6 pt-8 pb-12 items-center">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-4">
            Simplify Your Leave Management
          </Text>
          <Text className="text-gray-600 text-center text-lg mb-8 max-w-md">
            Track, request, and manage your leave entitlements with ease. All in one place.
          </Text>
          
          <View className="w-full h-64 rounded-2xl overflow-hidden mb-8">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/register')}
            className="w-full py-4 rounded-xl bg-blue-600 items-center mb-6"
          >
            <Text className="text-white text-lg font-bold">Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="w-full py-4 rounded-xl bg-white border border-gray-300 items-center"
          >
            <Text className="text-gray-800 text-lg font-medium">I Already Have an Account</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View className="px-6 pb-12">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why Choose LeaveManager Pro?
          </Text>
          
          <View className="flex-row flex-wrap gap-4">
            {features.map((feature, index) => (
              <View 
                key={index}
                className="flex-1 min-w-[45%] bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <View className="mb-3">
                  {feature.icon}
                </View>
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </Text>
                <Text className="text-gray-600">
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonial Section */}
        <View className="px-6 pb-12 bg-blue-50 py-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Trusted by Thousands
          </Text>
          
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-gray-600 italic mb-4">
              "LeaveManager Pro has transformed how our team handles leave requests. 
              The dashboard visualization helps us plan better than ever before."
            </Text>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
              <View>
                <Text className="font-semibold text-gray-800">Sarah Johnson</Text>
                <Text className="text-gray-600">HR Director, TechCorp</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LandingScreen;