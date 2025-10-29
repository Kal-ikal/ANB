import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Info,
  DollarSign,
  Calculator,
  CheckCircle,
} from "lucide-react-native";

// DIPERBAIKI: Gunakan 'expo-linear-gradient' agar kompatibel dengan Expo Router/Expo Go
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";

// DIPERBAIKI: Arahkan cssInterop ke komponen yang benar dari Expo
cssInterop(LinearGradient, { className: "style" });

export default function LeaveConversionScreen() {
  const router = useRouter();
  const [isDarkMode] = useState(false); // Akan dihubungkan ke global theme nanti
  const [conversionRequested, setConversionRequested] = useState(false);

  // Data saldo cuti (mock)
  const leaveBalances = [
    { type: "Annual", days: 15, used: 7, eligible: 8, rate: 150 },
    { type: "Sick", days: 10, used: 2, eligible: 0, rate: 100 },
    { type: "Special", days: 5, used: 1, eligible: 2, rate: 200 },
  ];

  // Data pajak (mock)
  const taxBrackets = [
    { min: 0, max: 5000, rate: 10 },
    { min: 5001, max: 10000, rate: 15 },
    { min: 10001, max: 20000, rate: 20 },
    { min: 20001, max: "∞", rate: 25 },
  ];

  // Hitung total eligible dan nilai uang
  const totalEligibleDays = leaveBalances.reduce(
    (sum, leave) => sum + leave.eligible,
    0
  );
  const totalAmountBeforeTax = leaveBalances.reduce(
    (sum, leave) => sum + leave.eligible * leave.rate,
    0
  );
  const taxAmount = totalAmountBeforeTax * 0.15; // 15% pajak demo
  const netAmount = totalAmountBeforeTax - taxAmount;

  const handleRequestConversion = () => {
    Alert.alert(
      "Leave Conversion Request",
      // DIPERBAIKI: Menggunakan backticks (`) untuk template literal
      `You are requesting to convert ${totalEligibleDays} days for a net amount of $${netAmount.toFixed(
        2
      )}. This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setConversionRequested(true);
            Alert.alert(
              "Conversion Requested",
              "Your leave conversion request has been submitted successfully. You will receive a confirmation email shortly.",
              [{ text: "OK", onPress: () => router.push("/") }]
            );
          },
        },
      ]
    );
  };

  return (
    <View
      // DIPERBAIKI: Menggunakan backticks (`) untuk template literal
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-[#F7F7F7]"
      } flex-1`}
    >
      {/* Header */}
      <LinearGradient
        colors={
          isDarkMode ? ["#1E3A8A", "#1E40AF"] : ["#3B82F6", "#60A5FA"]
        }
        className="p-6 rounded-b-3xl"
        // Tambahkan start dan end point untuk konsistensi di semua platform
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-row items-center mt-10">
          <TouchableOpacity onPress={() => router.push("/")} className="mr-4">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">
              Leave Conversion
            </Text>
            <Text className="text-blue-100 text-sm mt-1">
              Convert unused leave days to cash
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-4 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }} // Menambah padding di bawah
      >
        {/* Eligible Days */}
        <View
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-5 shadow-md mb-6`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`${
                isDarkMode ? "text-white" : "text-[#1A1D23]"
              } text-lg font-bold`}
            >
              Eligible Days for Conversion
            </Text>
            <Info color={isDarkMode ? "#9CA3AF" : "#6B7280"} size={20} />
          </View>

          <View className="flex-row flex-wrap gap-4 mb-6">
            {leaveBalances.map((leave, index) => (
              <View
                key={index}
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg p-4 flex-1 min-w-[45%]`}
              >
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } text-sm mb-1`}
                >
                  {leave.type} Leave
                </Text>
                <Text
                  className={`${
                    isDarkMode ? "text-white" : "text-[#1A1D23]"
                  } text-2xl font-bold`}
                >
                  {leave.eligible}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {leave.used} used / {leave.days} total
                </Text>
              </View>
            ))}
          </View>

          <View className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
            <View className="flex-row justify-between">
              <Text className="text-blue-800 dark:text-blue-200 font-medium">
                Total Eligible Days
              </Text>
              <Text className="text-blue-800 dark:text-blue-200 font-bold text-lg">
                {totalEligibleDays} days
              </Text>
            </View>
          </View>
        </View>

        {/* Monetary Value */}
        <View
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-5 shadow-md mb-6`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`${
                isDarkMode ? "text-white" : "text-[#1A1D23]"
              } text-lg font-bold`}
            >
              Monetary Value
            </Text>
            <DollarSign color={isDarkMode ? "#10B981" : "#059669"} size={20} />
          </View>

          <View className="mb-4">
            <View className="flex-row justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <Text
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Gross Amount
              </Text>
              <Text
                className={`${
                  isDarkMode ? "text-white" : "text-[#1A1D23]"
                } font-medium`}
              >
                ${totalAmountBeforeTax.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <Text
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                Tax Deduction
              </Text>
              <Text
                className={`${
                  isDarkMode ? "text-white" : "text-[#1A1D23]"
                } font-medium`}
              >
                -${taxAmount.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between py-3">
              <Text
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } font-bold`}
              >
                Net Amount
              </Text>
              <Text
                className={`${
                  isDarkMode ? "text-white" : "text-[#1A1D23]"
                } font-bold text-lg`}
              >
                ${netAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
            <View className="flex-row justify-between">
              <Text className="text-green-800 dark:text-green-200 font-medium">
                Conversion Rate
              </Text>
              <Text className="text-green-800 dark:text-green-200 font-bold">
                $150 per day
              </Text>
            </View>
          </View>
        </View>

        {/* Tax Info */}
        <View
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-5 shadow-md mb-6`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`${
                isDarkMode ? "text-white" : "text-[#1A1D23]"
              } text-lg font-bold`}
            >
              Tax Information
            </Text>
            <Calculator color={isDarkMode ? "#9CA3AF" : "#6B7280"} size={20} />
          </View>

          <Text
            className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}
          >
            The tax deduction is calculated based on your current tax bracket.
            Unused leave days are treated as additional income.
          </Text>

          <Text
            className={`${
              isDarkMode ? "text-white" : "text-[#1A1D23]"
            } font-medium mb-3`}
          >
            Your Tax Bracket: 15%
          </Text>

          <View
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            } rounded-lg p-4`}
          >
            <Text
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } text-sm mb-2`}
            >
              Current Tax Brackets
            </Text>
            {taxBrackets.map((bracket, index) => (
              <View key={index} className="flex-row justify-between py-2">
                <Text
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-sm`}
                >
                  ${bracket.min} - {bracket.max}
                </Text>
                <Text
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-sm`}
                >
                  {bracket.rate}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Eligibility */}
        <View
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl p-5 shadow-md mb-6`}
        >
          <Text
            className={`${
              isDarkMode ? "text-white" : "text-[#1A1D23]"
            } text-lg font-bold mb-4`}
          >
            Eligibility Criteria
          </Text>

          <View className="space-y-3">
            {[
              "Annual leave days must be unused for at least 6 months",
              "Maximum 10 days can be converted per calendar year",
              "Conversion requests are processed within 5 business days",
              "Converted amounts will be added to your next paycheck",
            ].map((text, i) => (
              <View key={i} className="flex-row items-start">
                <CheckCircle
                  color={isDarkMode ? "#10B981" : "#059669"}
                  size={20}
                  className="mt-0.5"
                />
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } ml-3`}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          className={`rounded-xl p-4 mb-6 ${
            conversionRequested ? "bg-green-500" : "bg-blue-500"
          } shadow-md`}
          onPress={handleRequestConversion}
          disabled={conversionRequested}
        >
          <Text className="text-white text-center font-bold text-lg">
            {conversionRequested
              ? "Conversion Requested"
              : "Request Conversion"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}