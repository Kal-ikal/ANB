import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { X, Bell, Calendar } from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Leave Approved",
      message: "Your annual leave request for Dec 15-20 has been approved",
      time: "2 hours ago",
      read: false,
      type: "approved",
    },
    {
      id: 2,
      title: "New Policy Update",
      message: "Leave policy has been updated. Please review the changes",
      time: "1 day ago",
      read: true,
      type: "info",
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50" edges={["top"]}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Notifications</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X color="#6B7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View className="flex-row justify-between items-center px-6 py-3 bg-white">
        <TouchableOpacity onPress={markAllAsRead}>
          <Text className="text-blue-500 font-medium">Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearAll}>
          <Text className="text-red-500 font-medium">Clear all</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Bell color="#9CA3AF" size={48} />
            <Text className="text-gray-500 mt-4 text-center">
              No notifications yet
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className={`${
                notification.read ? "bg-white" : "bg-blue-100"
              } rounded-xl p-4 mb-3 shadow-sm border border-gray-200`}
              onPress={() => markAsRead(notification.id)}
            >
              <View className="flex-row">
                <View className="p-3 rounded-full bg-blue-100 mr-3">
                  <Calendar color="#3B82F6" size={20} />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-gray-900">
                      {notification.title}
                    </Text>
                    {!notification.read && (
                      <View className="bg-blue-500 w-2 h-2 rounded-full mt-2" />
                    )}
                  </View>
                  <Text className="text-gray-600 mt-1">
                    {notification.message}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-2">
                    {notification.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
