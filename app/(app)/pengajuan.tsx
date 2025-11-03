import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Appearance,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Upload,
  CheckCircle,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import * as NavigationBar from "expo-navigation-bar";

cssInterop(LinearGradient, { className: "style" });

type FormData = {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
  documents: string[];
};

const leaveTypes = [
  { id: "annual", name: "Annual Leave" },
  { id: "sick", name: "Sick Leave" },
  { id: "personal", name: "Personal Leave" },
  { id: "maternity", name: "Maternity Leave" },
  { id: "paternity", name: "Paternity Leave" },
];

export default function LeaveApplicationForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // === THEME MODE (sementara, nanti bisa diganti ke ThemeContext) ===
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme?.();
    if (colorScheme === "dark") setIsDarkMode(true);
  }, []);

  // === Set warna navbar bawah Android ===
  useEffect(() => {
    if (Platform.OS === "android") {
      const bgColor = isDarkMode ? "#000000" : "#FFFFFF";
      const buttonStyle = isDarkMode ? "light" : "dark";
      NavigationBar.setBackgroundColorAsync(bgColor);
      NavigationBar.setButtonStyleAsync(buttonStyle);
    }
  }, [isDarkMode]);

  // === FORM STATE ===
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    days: 0,
    documents: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState<"start" | "end">("start");
  const [tempDate, setTempDate] = useState(new Date());
  const totalSteps = 3;

  // === HITUNG JUMLAH HARI CUTI (n-1) ===
  const calculateDays = useCallback(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // n-1
      setFormData((prev) => ({ ...prev, days: diffDays }));
    } else {
      setFormData((prev) => ({ ...prev, days: 0 }));
    }
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    calculateDays();
  }, [calculateDays]);

  // === HANDLERS ===
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value } as FormData));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1 && !formData.leaveType)
      newErrors.leaveType = "Please select a leave type";
    if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.endDate) newErrors.endDate = "End date is required";
      if (formData.startDate && formData.endDate) {
        const s = new Date(formData.startDate);
        const e = new Date(formData.endDate);
        if (s > e) newErrors.endDate = "End date must be after start date";
      }
    }
    if (currentStep === 3 && !formData.reason)
      newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
      else
        Alert.alert(
          "Leave Application Submitted",
          "Your leave application has been submitted.",
          [{ text: "OK", onPress: () => router.push("/(app)/home") }]
        );
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const showPicker = (field: "start" | "end") => {
    setDatePickerField(field);
    const fd: "startDate" | "endDate" = field === "start" ? "startDate" : "endDate";
    setTempDate(formData[fd] ? new Date(formData[fd]) : new Date());
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const fieldName: keyof FormData =
        datePickerField === "start" ? "startDate" : "endDate";
      handleInputChange(fieldName, dateString);
    }
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const name = asset.name ?? "document.pdf";
        const max = 2 * 1024 * 1024;
        if (asset.size && asset.size > max) {
          Alert.alert("File too large", "File must be under 2MB");
          return;
        }
        setFormData((p) => ({ ...p, documents: [...p.documents, name] }));
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Could not pick document.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // === STEP RENDERERS ===
  const renderStepOne = () => (
    <View className="space-y-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">
        Select Leave Type
      </Text>
      {leaveTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          className={`p-4 rounded-xl border ${
            formData.leaveType === type.id
              ? "bg-blue-50 border-blue-500"
              : "bg-white border-gray-200"
          }`}
          onPress={() => handleInputChange("leaveType", type.id)}
        >
          <Text
            className={`text-base ${
              formData.leaveType === type.id
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
          >
            {type.name}
          </Text>
        </TouchableOpacity>
      ))}
      {errors.leaveType ? (
        <Text className="text-red-500 text-sm">{errors.leaveType}</Text>
      ) : null}
    </View>
  );

  const renderStepTwo = () => (
    <View className="space-y-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">
        Select Date Range
      </Text>

      {/* START DATE */}
      <View>
        <Text className="mb-2 text-gray-700 dark:text-gray-300">Start Date</Text>
        <TextInput
          className="border rounded-xl p-3 mb-2 bg-white border-gray-300 text-gray-700"
          placeholder="YYYY-MM-DD"
          value={formData.startDate}
          onChangeText={(text) => handleInputChange("startDate", text)}
        />
        <TouchableOpacity
          onPress={() => showPicker("start")}
          className="flex-row items-center border rounded-xl p-3 bg-white border-gray-300"
        >
          <Calendar size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700">
            {formData.startDate
              ? formatDate(formData.startDate)
              : "Select start date"}
          </Text>
        </TouchableOpacity>
        {errors.startDate ? (
          <Text className="text-red-500 text-sm mt-1">{errors.startDate}</Text>
        ) : null}
      </View>

      {/* END DATE */}
      <View>
        <Text className="mb-2 text-gray-700 dark:text-gray-300">End Date</Text>
        <TextInput
          className="border rounded-xl p-3 mb-2 bg-white border-gray-300 text-gray-700"
          placeholder="YYYY-MM-DD"
          value={formData.endDate}
          onChangeText={(text) => handleInputChange("endDate", text)}
        />
        <TouchableOpacity
          onPress={() => showPicker("end")}
          className="flex-row items-center border rounded-xl p-3 bg-white border-gray-300"
        >
          <Calendar size={20} color="#3B82F6" />
          <Text className="ml-3 text-gray-700">
            {formData.endDate ? formatDate(formData.endDate) : "Select end date"}
          </Text>
        </TouchableOpacity>
        {errors.endDate ? (
          <Text className="text-red-500 text-sm mt-1">{errors.endDate}</Text>
        ) : null}
      </View>

      <View className="rounded-xl p-4 bg-blue-50">
        <Text className="text-base font-semibold text-blue-800">
          Total Leave Days: {formData.days}
        </Text>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          minimumDate={
            datePickerField === "end" && formData.startDate
              ? new Date(formData.startDate)
              : undefined
          }
        />
      )}
    </View>
  );

  const renderStepThree = () => (
    <View className="space-y-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">
        Application Details
      </Text>

      <View>
        <Text className="mb-2 text-gray-700 dark:text-gray-300">
          Reason for Leave
        </Text>
        <TextInput
          multiline
          textAlignVertical="top"
          className="border rounded-xl p-4 h-32 bg-white border-gray-300 text-gray-700"
          placeholder="Write your reason..."
          placeholderTextColor="#9CA3AF"
          value={formData.reason}
          onChangeText={(v) => handleInputChange("reason", v)}
        />
        {errors.reason ? (
          <Text className="text-red-500 text-sm mt-1">{errors.reason}</Text>
        ) : null}
      </View>

      <View>
        <Text className="mb-2 text-gray-700 dark:text-gray-300">
          Supporting Documents
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-center border-2 border-dashed rounded-xl p-6 bg-white border-gray-300"
          onPress={handleDocumentUpload}
        >
          <Upload size={24} color="#3B82F6" />
          <Text className="ml-2 text-blue-600 font-medium">
            Upload Document
          </Text>
        </TouchableOpacity>

        {formData.documents.length > 0 && (
          <View className="mt-3">
            <Text className="text-sm text-gray-600 mb-2">
              Uploaded Documents:
            </Text>
            {formData.documents.map((doc, i) => (
              <View
                key={i}
                className="flex-row items-center bg-gray-100 rounded-lg p-3 mb-2"
              >
                <CheckCircle size={16} color="#10B981" />
                <Text className="ml-2 text-gray-700">{doc}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    if (currentStep === 1) return renderStepOne();
    if (currentStep === 2) return renderStepTwo();
    return renderStepThree();
  };

  return (
    <View
      className="flex-1 bg-gray-50"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={isDarkMode ? "#000" : "#fff"}
      />

      <LinearGradient
        colors={["#3B82F6", "#60A5FA"]}
        className="px-6 pb-6 rounded-b-3xl pt-12"
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">
              Leave Application
            </Text>
            <Text className="text-blue-100 text-sm mt-1">
              Step {currentStep} of {totalSteps}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View className="h-1 bg-gray-200">
        <View
          className="h-1 bg-blue-500 rounded-r"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <View className="rounded-2xl p-5 bg-white shadow-sm">
            {renderCurrentStep()}
          </View>
        </View>
      </ScrollView>

      <View className="flex-row justify-between p-4 border-t bg-white border-gray-200">
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentStep === 1}
          className={`flex-row items-center px-5 py-3 rounded-xl ${
            currentStep === 1 ? "bg-gray-100" : "bg-blue-500"
          }`}
        >
          <ChevronLeft
            size={20}
            color={currentStep === 1 ? "#9CA3AF" : "#FFFFFF"}
          />
          <Text
            className={`ml-1 font-medium ${
              currentStep === 1 ? "text-gray-500" : "text-white"
            }`}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="flex-row items-center px-5 py-3 bg-blue-500 rounded-xl"
        >
          <Text className="font-medium text-white">
            {currentStep === totalSteps ? "Submit" : "Next"}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
