import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import {
  Edit3,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
} from "lucide-react-native";
import { JSX } from "react/jsx-runtime";

export default function ProfileScreen(): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
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
      status: "Approved",
    },
    {
      id: 3,
      type: "Special Leave",
      startDate: "2023-10-10",
      endDate: "2023-10-12",
      status: "Pending",
    },
    {
      id: 4,
      type: "Annual Leave",
      startDate: "2023-09-22",
      endDate: "2023-09-25",
      status: "Approved",
    },
    {
      id: 5,
      type: "Annual Leave",
      startDate: "2023-08-15",
      endDate: "2023-08-20",
      status: "Rejected",
    },
  ];

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 24 }} // Menambah padding di bawah
      >
        {/* Profile Header */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-gray-800 dark:text-white">
              My Profile
            </Text>
            <TouchableOpacity
              className="bg-blue-500 rounded-full p-3"
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
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              {employeeData.name}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300">
              {employeeData.position}
            </Text>
          </View>

          <View className="flex-row justify-around border-t border-gray-200 dark:border-gray-700 pt-6">
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-800 dark:text-white">
                7.5
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Years
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-800 dark:text-white">
                Engineering
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Department
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-800 dark:text-white">
                EMP-00789
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                ID
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Personal Information
          </Text>

          <View className="space-y-4">
            <View className="flex-row items-center">
              <Mail size={20} color="#3B82F6" className="mr-3" />
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Email
                </Text>
                <Text className="text-gray-800 dark:text-white">
                  {employeeData.email}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Phone size={20} color="#3B82F6" className="mr-3" />
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Phone
                </Text>
                <Text className="text-gray-800 dark:text-white">
                  {employeeData.phone}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <MapPin size={20} color="#3B82F6" className="mr-3" />
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Address
                </Text>
                <Text className="text-gray-800 dark:text-white">
                  {employeeData.address}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Calendar size={20} color="#3B82F6" className="mr-3" />
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Join Date
                </Text>
                <Text className="text-gray-800 dark:text-white">
                  {employeeData.joinDate}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Building size={20} color="#3B82F6" className="mr-3" />
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Department
                </Text>
                <Text className="text-gray-800 dark:text-white">
                  {employeeData.department}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Leave History */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
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
                  index !== leaveHistory.length - 1
                    ? "border-b border-gray-100 dark:border-gray-700"
                    : ""
                }`}
              >
                <View>
                  <Text className="font-medium text-gray-800 dark:text-white">
                    {leave.type}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {leave.startDate} to {leave.endDate}
                  </Text>
                </View>
                <View>
                  <Text
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : leave.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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