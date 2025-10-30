import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Upload,
  CheckCircle,
  ArrowLeft,
} from "lucide-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

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

export default function LeaveApplicationForm() {
  const router = useRouter();
  const [isDarkMode] = useState(false);
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
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [datePickerField, setDatePickerField] = useState<'start' | 'end'>('start');

  const totalSteps = 3;

  // FIX: Gunakan useCallback untuk calculateDays
  const calculateDays = useCallback(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      setFormData(prev => ({ ...prev, days: diffDays }));
    } else {
      setFormData(prev => ({ ...prev, days: 0 }));
    }
  }, [formData.startDate, formData.endDate]);

  // Fix: Hitung hari otomatis ketika startDate atau endDate berubah
  useEffect(() => {
    calculateDays();
  }, [calculateDays]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
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
          [{ text: "OK", onPress: () => router.push("/(app)/home") }]
        );
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // FIX: Improved date picker logic
  const showDatePickerModal = (type: 'start' | 'end') => {
    const currentDate = type === 'start' ? formData.startDate : formData.endDate;
    setTempDate(currentDate ? new Date(currentDate) : new Date());
    setDatePickerField(type);
    setShowDatePicker(type);
  };

  // FIX: Proper date selection handling
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
    }
    
    if (event.type === 'set' && selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      // FIX: Only update the field that was originally clicked
      handleInputChange(datePickerField === 'start' ? 'startDate' : 'endDate', dateString);
    } else if (event.type === 'dismissed') {
      setShowDatePicker(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDocumentUpload = () => {
    const mockDocument = `document_${formData.documents.length + 1}.pdf`;
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, mockDocument],
    }));
  };

  const renderStepOne = () => (
    <View className="space-y-6">
      <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Select Leave Type
      </Text>
      <View className="space-y-3">
        {leaveTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className={`p-4 rounded-xl border ${
              formData.leaveType === type.id
                ? isDarkMode 
                  ? "bg-blue-900 border-blue-500" 
                  : "bg-blue-50 border-blue-500"
                : isDarkMode 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-200"
            }`}
            onPress={() => handleInputChange("leaveType", type.id)}
          >
            <Text
              className={`text-base ${
                formData.leaveType === type.id
                  ? isDarkMode 
                    ? "text-blue-300 font-semibold" 
                    : "text-blue-600 font-semibold"
                  : isDarkMode 
                    ? "text-gray-300" 
                    : "text-gray-700"
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
      <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Select Date Range
      </Text>
      <View className="space-y-4">
        <View>
          <Text className={`text-base mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Start Date
          </Text>
          <TouchableOpacity
            className={`flex-row items-center border rounded-xl p-3 ${
              isDarkMode 
                ? "bg-gray-800 border-gray-600" 
                : "bg-white border-gray-300"
            }`}
            onPress={() => showDatePickerModal('start')}
          >
            <Calendar size={20} color="#3B82F6" />
            <Text className={`flex-1 ml-3 ${
              formData.startDate 
                ? isDarkMode ? "text-white" : "text-gray-700" 
                : isDarkMode ? "text-gray-400" : "text-gray-400"
            }`}>
              {formData.startDate ? formatDate(formData.startDate) : 'Select start date'}
            </Text>
          </TouchableOpacity>
          {errors.startDate && (
            <Text className="text-red-500 text-sm mt-1">{errors.startDate}</Text>
          )}
        </View>

        <View>
          <Text className={`text-base mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            End Date
          </Text>
          <TouchableOpacity
            className={`flex-row items-center border rounded-xl p-3 ${
              isDarkMode 
                ? "bg-gray-800 border-gray-600" 
                : "bg-white border-gray-300"
            }`}
            onPress={() => showDatePickerModal('end')}
          >
            <Calendar size={20} color="#3B82F6" />
            <Text className={`flex-1 ml-3 ${
              formData.endDate 
                ? isDarkMode ? "text-white" : "text-gray-700" 
                : isDarkMode ? "text-gray-400" : "text-gray-400"
            }`}>
              {formData.endDate ? formatDate(formData.endDate) : 'Select end date'}
            </Text>
          </TouchableOpacity>
          {errors.endDate && (
            <Text className="text-red-500 text-sm mt-1">{errors.endDate}</Text>
          )}
        </View>

        <View className={`rounded-xl p-4 ${
          isDarkMode ? "bg-blue-900" : "bg-blue-50"
        }`}>
          <Text className={`text-base font-semibold ${
            isDarkMode ? "text-blue-200" : "text-blue-800"
          }`}>
            Total Leave Days: {formData.days}
          </Text>
          <Text className={`text-sm mt-1 ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}>
            Automatically calculated based on selected dates
          </Text>
        </View>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={datePickerField === 'end' && formData.startDate ? new Date(formData.startDate) : new Date()}
        />
      )}
    </View>
  );

  const renderStepThree = () => (
    <View className="space-y-6">
      <Text className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        Application Details
      </Text>
      <View className="space-y-4">
        <View>
          <Text className={`text-base mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Reason for Leave
          </Text>
          <TextInput
            className={`border rounded-xl p-4 h-32 text-base ${
              isDarkMode 
                ? "bg-gray-800 border-gray-600 text-white" 
                : "bg-white border-gray-300 text-gray-700"
            }`}
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
          <Text className={`text-base mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Supporting Documents
          </Text>
          <TouchableOpacity
            className={`flex-row items-center justify-center border-2 border-dashed rounded-xl p-6 ${
              isDarkMode 
                ? "bg-gray-800 border-gray-600" 
                : "bg-white border-gray-300"
            }`}
            onPress={handleDocumentUpload}
          >
            <Upload size={24} color="#3B82F6" />
            <Text className="ml-2 text-blue-600 font-medium">
              Upload Document
            </Text>
          </TouchableOpacity>

          {formData.documents.length > 0 && (
            <View className="mt-3">
              <Text className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Uploaded Documents:
              </Text>
              {formData.documents.map((doc, index) => (
                <View
                  key={index}
                  className={`flex-row items-center rounded-lg p-3 mb-2 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <CheckCircle size={16} color="#10B981" />
                  <Text className={`ml-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
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
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`} edges={['top']}>
      {/* Header dengan Tombol Back */}
      <View className={`p-4 pt-2 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#3B82F6" />
            <Text className="ml-2 text-blue-600 font-medium">Back</Text>
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Leave Application
            </Text>
            <Text className={`text-center mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Step {currentStep} of {totalSteps}
            </Text>
          </View>
          <View className="w-20" />
        </View>
      </View>

      {/* Progress Bar */}
      <View className={`h-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
        <View
          className="h-1 bg-blue-500 rounded-r"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </View>

      {/* Form */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-4">
          <View className={`rounded-2xl p-5 shadow-sm ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            {renderCurrentStep()}
          </View>
        </View>
      </ScrollView>

      {/* Navigation */}
      <View className={`flex-row justify-between p-4 border-t ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <TouchableOpacity
          className={`flex-row items-center px-5 py-3 rounded-xl ${
            currentStep === 1
              ? isDarkMode ? "bg-gray-700" : "bg-gray-100"
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
                ? isDarkMode ? "text-gray-400" : "text-gray-500"
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
    </SafeAreaView>
  );
}