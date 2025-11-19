import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { JSX, useMemo,useState } from "react";


interface LeaveItem {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: "Approved" | "Pending" | "Rejected";
  duration: string;
}

export default function LeaveHistoryScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("Semua");

  const filters = ["Semua", "Approved", "Pending", "Rejected"];

  const [leaveHistory] = useState<LeaveItem[]>([
    {
      id: 1,
      type: "Annual Leave",
      startDate: "2023-12-15",
      endDate: "2023-12-20",
      status: "Approved",
      duration: "6 days",
    },
    {
      id: 2,
      type: "Sick Leave",
      startDate: "2023-11-05",
      endDate: "2023-11-07",
      status: "Approved",
      duration: "3 days",
    },
    {
      id: 3,
      type: "Special Leave",
      startDate: "2023-10-10",
      endDate: "2023-10-12",
      status: "Pending",
      duration: "3 days",
    },
    {
      id: 4,
      type: "Annual Leave",
      startDate: "2023-09-22",
      endDate: "2023-09-25",
      status: "Approved",
      duration: "4 days",
    },
    {
      id: 5,
      type: "Annual Leave",
      startDate: "2023-08-15",
      endDate: "2023-08-20",
      status: "Rejected",
      duration: "6 days",
    },
  ]);

  // ✅ FIX: Pisahkan logic ke helper function
  const getStatusStyles = useMemo(() => {
    return (status: string) => {
      switch (status) {
        case "Approved":
          return {
            bg: "bg-green-500",
            text: "text-white",
          };
        case "Rejected":
          return {
            bg: "bg-red-500",
            text: "text-white",
          };
        case "Pending":
          return {
            bg: "bg-orange-500",
            text: "text-white",
          };
        default:
          return {
            bg: "bg-gray-500",
            text: "text-white",
          };
      }
    };
  }, []);

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "Approved":
        return <CheckCircle color="#10B981" size={20} />;
      case "Rejected":
        return <XCircle color="#EF4444" size={20} />;
      case "Pending":
        return <Clock color="#F59E0B" size={20} />;
      default:
        return <Calendar color="#6B7280" size={20} />;
    }
  };

  const filteredHistory = leaveHistory.filter((item) => {
    if (activeFilter === "Semua") return true;
    return item.status === activeFilter;
  });

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <BlurView intensity={50} className="flex-1">
        <View className="flex-1 bg-white/80 dark:bg-gray-900/80">
          <View className="flex-row items-center p-6 pt-12 border-b border-gray-200 dark:border-gray-800">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Leave History
            </Text>
          </View>

          {/* Filters */}
          <View className="px-6 py-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full mr-3 ${
                    activeFilter === filter
                      ? "bg-red-500"
                      : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`font-medium ${
                      activeFilter === filter
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* List */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {filteredHistory.length === 0 ? (
              <View className="flex-1 justify-center items-center py-20">
                <Calendar color="#9CA3AF" size={48} />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
                  No leave history found
                </Text>
              </View>
            ) : (
              filteredHistory.map((leave) => {
                const statusStyles = getStatusStyles(leave.status);
                
                return (
                  <TouchableOpacity
                    key={leave.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-700"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                          {leave.type}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {leave.startDate} to {leave.endDate}
                        </Text>
                      </View>

                      {/* ✅ FIX: Pisahkan className jadi variable */}
                      <View className={`${statusStyles.bg} px-3 py-1 rounded-full`}>
                        <Text className={`${statusStyles.text} text-xs font-medium`}>
                          {leave.status}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                      <View className="flex-row items-center flex-1">
                        {getStatusIcon(leave.status)}
                        <Text className="text-gray-600 dark:text-gray-300 ml-2">
                          Duration: {leave.duration}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </BlurView>
    </View>
  );
}