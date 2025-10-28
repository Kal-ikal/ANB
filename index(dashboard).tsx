import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  User, 
  Settings, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Sun,
  Moon
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { cssInterop } from 'nativewind';

cssInterop(LinearGradient, {
  className: 'style',
});

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data for leave balances
  const leaveBalances = [
    { type: 'Annual', days: 15, used: 7, color: '#3B82F6' },
    { type: 'Sick', days: 10, used: 2, color: '#10B981' },
    { type: 'Special', days: 5, used: 1, color: '#8B5CF6' },
  ];

  // Mock data for charts
  const monthlyUsageData = [
    { value: 2, label: 'Jan' },
    { value: 3, label: 'Feb' },
    { value: 1, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 2, label: 'May' },
    { value: 5, label: 'Jun' },
  ];

  const yearlyUsageData = [
    { value: 10, label: 'Annual' },
    { value: 2, label: 'Sick' },
    { value: 1, label: 'Special' },
  ];

  // Quick actions
  const quickActions = [
    { id: 1, title: 'Apply Leave', icon: <FileText color={isDarkMode ? '#F7F7F7' : '#1A1D23'} size={24} />, screen: 'leave-application' },
    { id: 2, title: 'Convert Leave', icon: <DollarSign color={isDarkMode ? '#F7F7F7' : '#1A1D23'} size={24} />, screen: 'leave-conversion' },
    { id: 3, title: 'My Profile', icon: <User color={isDarkMode ? '#F7F7F7' : '#1A1D23'} size={24} />, screen: 'profile' },
    { id: 4, title: 'Settings', icon: <Settings color={isDarkMode ? '#F7F7F7' : '#1A1D23'} size={24} />, screen: 'settings' },
  ];

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View className={`${isDarkMode ? 'bg-gray-900' : 'bg-[#F7F7F7]'} flex-1`}>
      {/* Header */}
      <LinearGradient 
        colors={isDarkMode ? ["#1E3A8A", "#1E40AF"] : ["#3B82F6", "#60A5FA"]} 
        className="p-6 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center mt-10">
          <View>
            <Text className="text-white text-2xl font-bold">LeaveManager</Text>
            <Text className="text-blue-100 text-sm mt-1">Welcome back, Sarah!</Text>
          </View>
          <View className="flex-row items-center">
            {isDarkMode ? <Moon color="white" size={20} /> : <Sun color="white" size={20} />}
            <Switch 
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#6B7280' }}
              thumbColor={isDarkMode ? '#3B82F6' : '#FFFFFF'}
              className="ml-2"
            />
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4 mt-6" showsVerticalScrollIndicator={false}>
        {/* Leave Balances */}
        <View className="mb-6">
          <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold mb-4`}>
            Leave Balances
          </Text>
          <View className="flex-row flex-wrap gap-4">
            {leaveBalances.map((leave, index) => (
              <View 
                key={index} 
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 flex-1 min-w-[45%] shadow-md`}
              >
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-sm`}>
                  {leave.type} Leave
                </Text>
                <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-2xl font-bold mt-1`}>
                  {leave.days - leave.used}
                </Text>
                <Text className="text-gray-500 text-xs mt-2">
                  {leave.used} used of {leave.days} days
                </Text>
                <View className="mt-3">
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(leave.used / leave.days) * 100}%`, 
                        backgroundColor: leave.color 
                      }} 
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Charts Section */}
        <View className="mb-6">
          <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold mb-4`}>
            Leave Usage Analytics
          </Text>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-md mb-4`}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-semibold`}>
                Monthly Usage
              </Text>
              <TrendingUp color={isDarkMode ? '#10B981' : '#059669'} size={20} />
            </View>
            <BarChart
              data={monthlyUsageData}
              width={screenWidth - 60}
              height={150}
              spacing={20}
              barWidth={20}
              xAxisLabelTextStyle={{ color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
              yAxisTextStyle={{ color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
              frontColor={isDarkMode ? '#3B82F6' : '#2563EB'}
              yAxisThickness={0}
              xAxisThickness={0}
              rulesType="solid"
              rulesColor={isDarkMode ? '#374151' : '#E5E7EB'}
              initialSpacing={10}
              endSpacing={10}
            />
          </View>
          
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-md`}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-semibold`}>
                Yearly Distribution
              </Text>
              <TrendingDown color={isDarkMode ? '#EF4444' : '#DC2626'} size={20} />
            </View>
            <LineChart
              data={yearlyUsageData}
              width={screenWidth - 60}
              height={150}
              spacing={40}
              curved
              initialSpacing={10}
              endSpacing={10}
              areaChart
              hideDataPoints
              thickness={3}
              color={isDarkMode ? '#10B981' : '#059669'}
              startFillColor={isDarkMode ? '#10B981' : '#059669'}
              startOpacity={0.8}
              endFillColor={isDarkMode ? '#10B981' : '#059669'}
              endOpacity={0.3}
              gradientDirection="vertical"
              hideRules
              xAxisLabelTextStyle={{ color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
              yAxisTextStyle={{ color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 10 }}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold mb-4`}>
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap gap-4">
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 flex-1 min-w-[45%] shadow-md items-center`}
              >
                <View className="bg-blue-100 p-3 rounded-full mb-2">
                  {action.icon}
                </View>
                <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-semibold`}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Leaves */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-md mb-6`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold`}>
              Upcoming Leaves
            </Text>
            <Calendar color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </View>
          
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-500 w-3 h-3 rounded-full mr-3" />
            <View>
              <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
                Annual Leave
              </Text>
              <Text className="text-gray-500 text-sm">
                15-20 Dec 2023 • 6 days
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="bg-green-500 w-3 h-3 rounded-full mr-3" />
            <View>
              <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
                Sick Leave
              </Text>
              <Text className="text-gray-500 text-sm">
                05 Jan 2024 • 2 days
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg">
        <Plus color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}