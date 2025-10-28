import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Bell, 
  User, 
  Shield, 
  FileText, 
  Sun, 
  Moon,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { cssInterop } from 'nativewind';

cssInterop(LinearGradient, {
  className: 'style',
});

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  // Mock user data
  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Marketing',
    employeeId: 'EMP-00789',
    joinDate: 'Jan 15, 2020',
  };

  // Mock leave policy data
  const leavePolicy = [
    { type: 'Annual Leave', days: 15, carryOver: 5, maxConsecutive: 10 },
    { type: 'Sick Leave', days: 10, carryOver: 0, maxConsecutive: 5 },
    { type: 'Special Leave', days: 5, carryOver: 0, maxConsecutive: 3 },
    { type: 'Maternity Leave', days: 90, carryOver: 0, maxConsecutive: 90 },
    { type: 'Paternity Leave', days: 10, carryOver: 0, maxConsecutive: 10 },
  ];

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    Alert.alert(
      'Theme Changed',
      `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      [{ text: 'OK' }]
    );
  };

  // Toggle notification preferences
  const toggleNotification = (type: 'email' | 'push' | 'sms') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => router.push('/'),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View className={`${isDarkMode ? 'bg-gray-900' : 'bg-[#F7F7F7]'} flex-1`}>
      {/* Header */}
      <LinearGradient 
        colors={isDarkMode ? ["#1E3A8A", "#1E40AF"] : ["#3B82F6", "#60A5FA"]} 
        className="p-6 rounded-b-3xl"
      >
        <View className="flex-row items-center mt-10">
          <TouchableOpacity 
            onPress={() => router.push('/')} 
            className="mr-4"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">Settings</Text>
            <Text className="text-blue-100 text-sm mt-1">Manage your preferences</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4 mt-6" showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-md mb-6`}>
          <View className="flex-row items-center mb-4">
            <User color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold ml-2`}>
              Account
            </Text>
          </View>
          
          <View className="mb-4">
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-1`}>
              Name
            </Text>
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              {userData.name}
            </Text>
          </View>
          
          <View className="mb-4">
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-1`}>
              Email
            </Text>
            <View className="flex-row items-center">
              <Mail color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={16} className="mr-2" />
              <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
                {userData.email}
              </Text>
            </View>
          </View>
          
          <View className="mb-4">
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-1`}>
              Phone
            </Text>
            <View className="flex-row items-center">
              <Phone color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={16} className="mr-2" />
              <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
                {userData.phone}
              </Text>
            </View>
          </View>
          
          <View className="mb-4">
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-1`}>
              Department
            </Text>
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              {userData.department}
            </Text>
          </View>
          
          <View>
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-1`}>
              Employee ID
            </Text>
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              {userData.employeeId}
            </Text>
          </View>
        </View>

        {/* Appearance Section */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-md mb-6`}>
          <View className="flex-row items-center mb-4">
            <Sun color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold ml-2`}>
              Appearance
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              {isDarkMode ? <Moon color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} /> : <Sun color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />}
              <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium ml-3`}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch 
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: '#6B7280' }}
              thumbColor={isDarkMode ? '#3B82F6' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-md mb-6`}>
          <View className="flex-row items-center mb-4">
            <Bell color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold ml-2`}>
              Notifications
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              Email Notifications
            </Text>
            <Switch 
              value={notifications.email}
              onValueChange={() => toggleNotification('email')}
              trackColor={{ false: '#D1D5DB', true: '#6B7280' }}
              thumbColor={notifications.email ? '#3B82F6' : '#FFFFFF'}
            />
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              Push Notifications
            </Text>
            <Switch 
              value={notifications.push}
              onValueChange={() => toggleNotification('push')}
              trackColor={{ false: '#D1D5DB', true: '#6B7280' }}
              thumbColor={notifications.push ? '#3B82F6' : '#FFFFFF'}
            />
          </View>
          
          <View className="flex-row justify-between items-center py-3">
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              SMS Notifications
            </Text>
            <Switch 
              value={notifications.sms}
              onValueChange={() => toggleNotification('sms')}
              trackColor={{ false: '#D1D5DB', true: '#6B7280' }}
              thumbColor={notifications.sms ? '#3B82F6' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Leave Policy Section */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-md mb-6`}>
          <View className="flex-row items-center mb-4">
            <FileText color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold ml-2`}>
              Leave Policy
            </Text>
          </View>
          
          <View className="mb-4">
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>
              Company leave entitlements and rules:
            </Text>
            
            {leavePolicy.map((policy, index) => (
              <View 
                key={index} 
                className={`py-3 ${index !== leavePolicy.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
              >
                <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium mb-1`}>
                  {policy.type}
                </Text>
                <View className="flex-row">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Calendar color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={14} className="mr-2" />
                      <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        {policy.days} days/year
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={14} className="mr-2" />
                      <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        Max {policy.maxConsecutive} consecutive days
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <MapPin color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={14} className="mr-2" />
                    <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                      Carry over: {policy.carryOver} days
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Security Section */}
        <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-md mb-6`}>
          <View className="flex-row items-center mb-4">
            <Shield color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={20} />
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} text-lg font-bold ml-2`}>
              Security
            </Text>
          </View>
          
          <TouchableOpacity className="py-3">
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              Change Password
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="py-3 border-t border-gray-200 dark:border-gray-700">
            <Text className={`${isDarkMode ? 'text-white' : 'text-[#1A1D23]'} font-medium`}>
              Two-Factor Authentication
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className={`rounded-xl p-4 mb-6 flex-row justify-center items-center ${isDarkMode ? 'bg-red-700' : 'bg-red-500'} shadow-md`}
          onPress={handleLogout}
        >
          <LogOut color="white" size={20} className="mr-2" />
          <Text className="text-white text-center font-bold text-lg">
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}