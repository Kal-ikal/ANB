import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Upload,
  CheckCircle,
  ArrowLeft,
} from "lucide-react-native";
import { JSX } from "react/jsx-runtime";

type LeaveType = {
  id: string;
  name: string;
};

const leaveTypes: LeaveType[] = [
  { id: "annual", name: "Annual Leave" },
  { id: "sick", name: "Sick Leave" },
  { id: "personal", name: "Personal Leave" },
  { id: "maternity", name: "Maternity Leave" },
  { id: "paternity", name: "Paternity Leave" },
];

export default function LeaveApplicationForm(): JSX.Element {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    days: 0,
    documents: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData({ ...formData, days: diffDays });
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.leaveType)
        newErrors.leaveType = "Please select a leave type";
    } else if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.endDate) newErrors.endDate = "End date is required";
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (start > end)
          newErrors.endDate = "End date must be after start date";
      }
    } else if (currentStep === 3) {
      if (!formData.reason) newErrors.reason = "Reason is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        Alert.alert(
          "Leave Application Submitted",
          "Your leave application has been successfully submitted for review.",
          [{ text: "OK", onPress: () => router.push("../(app)") }]
        );
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleDateChange = (field: string, value: string) => {
    handleInputChange(field, value);
    // Recalculate days if either date changes (and both are present)
    // Delaying calculateDays slightly if start date is set to allow state to update
    if (field === "startDate" && formData.endDate) {
      setTimeout(calculateDays, 0);
    } else if (field === "endDate" && formData.startDate) {
      setTimeout(calculateDays, 0);
    }
  };

  const handleDocumentUpload = () => {
    // Mock document upload
    const mockDocument = `document_${formData.documents.length + 1}.pdf`;
    setFormData({
      ...formData,
      documents: [...formData.documents, mockDocument],
    });
  };

  const renderStepOne = () => (
    <View className="space-y-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">
        Select Leave Type
      </Text>
      <View className="space-y-3">
        {leaveTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className={`p-4 rounded-xl border ${
              formData.leaveType === type.id
                ? "bg-blue-50 dark:bg-blue-900 border-blue-500"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
            onPress={() => handleInputChange("leaveType", type.id)}
          >
            <Text
              className={`text-base ${
                formData.leaveType === type.id
                  ? "text-blue-600 dark:text-blue-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
        {errors.leaveType && (
          <Text className="text-red-500 text-sm">{errors.leaveType}</Text>
        )}
      </View>
    </View>
  );

  const renderStepTwo = () => (
    <View className="space-y-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">
        Select Date Range
      </Text>
      <View className="space-y-4">
        {(["startDate", "endDate"] as const).map((field, index) => (
          <View key={field}>
            <Text className="text-base text-gray-700 dark:text-gray-300 mb-2">
              {index === 0 ? "Start Date" : "End Date"}
            </Text>
            <View className="flex-row items-center border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 p-3">
              <Calendar size={20} color="#3B82F6" />
              <TextInput
                className="flex-1 ml-3 text-gray-700 dark:text-gray-300"
                placeholder={`Select ${index === 0 ? "start" : "end"} date`}
                placeholderTextColor="#9CA3AF"
                value={formData[field]}
                onChangeText={(value) => handleDateChange(field, value)}
              />
            </View>
            {errors[field] && (
              <Text className="text-red-500 text-sm mt-1">{errors[field]}</Text>
            )}
          </View>
        ))}
        <View className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
          <Text className="text-base font-semibold text-blue-800 dark:text-blue-200">
            Total Leave Days: {formData.days}
          </Text>
          <Text className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Automatically calculated based on selected dates
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStepThree = () => (
    <View className="space-y-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">
        Application Details
      </Text>
      <View className="space-y-4">
        <View>
          <Text className="text-base text-gray-700 dark:text-gray-300 mb-2">
            Reason for Leave
          </Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 p-4 text-gray-700 dark:text-gray-300 h-32 text-base"
            placeholder="Please provide a detailed reason..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={formData.reason}
            onChangeText={(value) => handleInputChange("reason", value)}
          />
          {errors.reason && (
            <Text className="text-red-500 text-sm mt-1">{errors.reason}</Text>
          )}
        </View>

        <View>
          <Text className="text-base text-gray-700 dark:text-gray-300 mb-2">
            Supporting Documents
          </Text>
          <TouchableOpacity
            className="flex-row items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-gray-800"
            onPress={handleDocumentUpload}
          >
            <Upload size={24} color="#3B82F6" />
            <Text className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
              Upload Document
            </Text>
          </TouchableOpacity>

          {formData.documents.length > 0 && (
            <View className="mt-3">
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Uploaded Documents:
              </Text>
              {formData.documents.map((doc, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-2"
                >
                  <CheckCircle size={16} color="#10B981" />
                  <Text className="ml-2 text-gray-700 dark:text-gray-300">
                    {doc}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    if (currentStep === 1) return renderStepOne();
    if (currentStep === 2) return renderStepTwo();
    return renderStepThree();
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header dengan Tombol Back */}
      <View className="bg-white dark:bg-gray-800 shadow-sm p-4 pt-12">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#3B82F6" />
            <Text className="ml-2 text-blue-600 font-medium">Back</Text>
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              Leave Application
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-400 mt-1">
              Step {currentStep} of {totalSteps}
            </Text>
          </View>
          <View className="w-20" /> {/* Spacer untuk balance layout */}
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-1 bg-gray-200 dark:bg-gray-700">
        <View
          className="h-1 bg-blue-500 rounded-r"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </View>

      {/* Form */}
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          {renderCurrentStep()}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View className="flex-row justify-between p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          className={`flex-row items-center px-5 py-3 rounded-xl ${
            currentStep === 1
              ? "bg-gray-100 dark:bg-gray-700"
              : "bg-blue-500"
          }`}
          onPress={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft
            size={20}
            color={currentStep === 1 ? "#9CA3AF" : "#FFFFFF"}
          />
          <Text
            className={`ml-1 font-medium ${
              currentStep === 1
                ? "text-gray-500 dark:text-gray-400"
                : "text-white"
            }`}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-5 py-3 bg-blue-500 rounded-xl"
          onPress={handleNext}
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