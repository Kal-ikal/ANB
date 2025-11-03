import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  Edit3,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  ChevronLeft,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
// 👈 1. IMPORT Insets dan Status Bar
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

cssInterop(LinearGradient, { className: "style" });

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // 👈 2. DAPATKAN nilai insets
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDarkMode] = useState(false); // atau dari context/global state

  const employeeData = {
    name: "Alex Morgan",
    position: "Senior Software Engineer",
    department: "Engineering",
    employeeId: "EMP-00789",
    email: "alex.morgan@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, San Francisco, CA",
    joinDate: "January 15, 2020",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%DAl",
  };

  const leaveHistory = [
    {
      id: 1,
      type: "Annual Leave",
      startDate: "2023-12-15",
      endDate: "2023-12-20",
      status: "Approved",
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "2023-11-05",
      endDate: "2023-11-07",
      status: "Rejected",
    },
    {
      id: 3,
      type: "Special Leave",
      startDate: "2023-10-10",
      endDate: "2023-10-12",
      status: "Pending",
    },
    // ... data lainnya
  ];

  return (
    // 👈 3. GANTI View statis dengan View dinamis + insets
    <View 
      className={`${isDarkMode ? "bg-gray-900" : "bg-[#F7F7F7]"} flex-1`}
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {/* 👈 4. TAMBAHKAN Status Bar */}
      <StatusBar style="light" />

      {/* Header dengan Back Button */}
      <LinearGradient
        colors={isDarkMode ? ["#1E3A8A", "#1E40AF"] : ["#3B82F6", "#60A5FA"]}
        // 👈 5. UBAH `p-6` menjadi `px-6 pb-6` dan TAMBAHKAN style
        className="px-6 pb-6 rounded-b-3xl"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: insets.top + 24 }}
      >
        {/* 👈 6. HAPUS `mt-10` */}
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">
              My Profile
            </Text>
            <Text className="text-blue-100 text-sm mt-1">
              Personal information and leave history
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-4 mt-6"
        showsVerticalScrollIndicator={false}
        // 👈 7. HAPUS `contentContainerStyle` statis
      >
        {/* Profile Header */}
        <View className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 mb-6 shadow-md`}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              My Profile
            </Text>
            <TouchableOpacity
              className={`${isDarkMode ? "bg-blue-600" : "bg-blue-500"} rounded-full p-3`}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit3 size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-6">
            <Image
              source={{ uri: employeeData.avatar }}
              className="w-24 h-24 rounded-full mb-4 border-4 border-blue-500"
            />
            <Text className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {employeeData.name}
            </Text>
            <Text className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {employeeData.position}
            </Text>
          </View>

          <View className="flex-row justify-around border-t pt-6" style={{ borderColor: isDarkMode ? "#374151" : "#E5E7EB" }}>
            <View className="items-center">
              <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                7.5
              </Text>
              <Text className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Years
              </Text>
            </View>
            <View className="items-center">
              <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Engineering
              </Text>
              <Text className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Department
              </Text>
            </View>
            <View className="items-center">
              <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                EMP-00789
              </Text>
              <Text className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                ID
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 mb-6 shadow-md`}>
          <Text className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Personal Information
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center">
              <Mail size={20} color="#3B82F6" style={{ marginRight: 12 }} />
              <View>
                <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Email
                </Text>
                <Text className={isDarkMode ? "text-white" : "text-gray-800"}>
                  {employeeData.email}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Phone size={20} color="#3B82F6" style={{ marginRight: 12 }} />
              <View>
                <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Phone
                </Text>
                <Text className={isDarkMode ? "text-white" : "text-gray-800"}>
                  {employeeData.phone}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <MapPin size={20} color="#3B82F6" style={{ marginRight: 12 }} />
              <View>
                <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Address
                </Text>
                <Text className={isDarkMode ? "text-white" : "text-gray-800"}>
                  {employeeData.address}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Calendar size={20} color="#3B82F6" style={{ marginRight: 12 }} />
              <View>
                <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Join Date
                </Text>
                <Text className={isDarkMode ? "text-white" : "text-gray-800"}>
                  {employeeData.joinDate}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Building size={20} color="#3B82F6" style={{ marginRight: 12 }} />
              <View>
                <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Department
                </Text>
                <Text className={isDarkMode ? "text-white" : "text-gray-800"}>
                  {employeeData.department}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Leave History */}
        <View className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 mb-6 shadow-md`}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Leave History
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            {leaveHistory.map((leave, index) => (
              <View
                key={leave.id}
                className={`flex-row justify-between items-center pb-4 ${
                  index !== leaveHistory.length - 1 ? "border-b" : ""
                }`}
                style={{ borderColor: isDarkMode ? "#374151" : "#E5E7EB" }}
              >
                <View>
                  <Text className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {leave.type}
                  </Text>
                  <Text className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {leave.startDate} to {leave.endDate}
                  </Text>
                </View>
                <View>
                  <Text
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      leave.status === "Approved"
                        ? isDarkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"
                        : leave.status === "Pending"
                        ? isDarkMode ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"
                        : isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {leave.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}