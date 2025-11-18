/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, Image as ImageIcon } from "lucide-react-native";

export default function EditProfilePhoto() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const selectImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Permission to access camera is required!"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  };

  const handleSave = () => {
    Alert.alert("Success", "Profile photo updated successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-blue-500 py-4 px-4">
        <Text className="text-white text-xl font-bold text-center">
          Edit Profile Photo
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6 py-8">
        {/* Profile Image Preview */}
        <View className="mb-10">
          <View className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-200 bg-gray-200 dark:bg-gray-700 items-center justify-center">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <ImageIcon size={48} color="#9CA3AF" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2">
                  No photo selected
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-4">
          {/* Camera Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-blue-100 dark:bg-blue-900 py-3 rounded-xl"
            onPress={openCamera}
          >
            <Camera color="#3B82F6" size={20} />
            <Text className="text-blue-600 dark:text-blue-300 font-semibold ml-2">
              Take Photo
            </Text>
          </TouchableOpacity>

          {/* Gallery Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-blue-100 dark:bg-blue-900 py-3 rounded-xl"
            onPress={selectImage}
          >
            <ImageIcon color="#3B82F6" size={20} />
            <Text className="text-blue-600 dark:text-blue-300 font-semibold ml-2">
              Choose from Gallery
            </Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-xl"
            onPress={handleSave}
          >
            <Text className="text-white text-center font-bold">Save</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            className="bg-gray-300 dark:bg-gray-700 py-4 rounded-xl"
            onPress={() => router.back()}
          >
            <Text className="text-gray-700 dark:text-gray-200 text-center font-bold">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}