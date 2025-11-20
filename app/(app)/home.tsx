// app/(app)/home.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import {
  Calendar,
  FileText,
  DollarSign,
  User,
  Settings,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

cssInterop(LinearGradient, { className: "style" });
cssInterop(Switch, { className: false });

const screenWidth = Dimensions.get("window").width;

type QuickAction = {
  id: number;
  title: string;
  icon: React.JSX.Element;
  link: "/pengajuan" | "/konversi" | "/profile" | "/settings";
  useLink: boolean;
};

type LeaveBalance = {
  type: string;
  days: number;
  used: number;
  color: string;
};

type ChartData = {
  value: number;
  label: string;
};

type UpcomingLeave = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  color: string;
  dateString: string;
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme } = useTheme();
  const [switchReady, setSwitchReady] = useState(false);
  const router = useRouter();

  // State for dynamic data
  const [userName, setUserName] = useState("User");
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([
    { type: "Annual", days: 12, used: 0, color: "#3B82F6" },
    { type: "Sick", days: 10, used: 0, color: "#10B981" },
    { type: "Special", days: 5, used: 0, color: "#8B5CF6" },
  ]);
  const [monthlyUsageData, setMonthlyUsageData] = useState<ChartData[]>([
      { value: 0, label: "Jan" },
      { value: 0, label: "Feb" },
      { value: 0, label: "Mar" },
      { value: 0, label: "Apr" },
      { value: 0, label: "May" },
      { value: 0, label: "Jun" },
  ]);
  const [yearlyUsageData, setYearlyUsageData] = useState<ChartData[]>([
    { value: 0, label: "Annual" },
    { value: 0, label: "Sick" },
    { value: 0, label: "Special" },
  ]);
  const [upcomingLeaves, setUpcomingLeaves] = useState<UpcomingLeave[]>([]);

  // PREFETCH
  useEffect(() => {
    const timer = setTimeout(() => {
      router.prefetch("/pengajuan");
      setTimeout(() => {
        router.prefetch("/profile");
        router.prefetch("/konversi");
      }, 1500);
      setTimeout(() => {
        router.prefetch("/settings");
      }, 3000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => setSwitchReady(true), 50);
      fetchDashboardData();
      return () => {
        setSwitchReady(false);
        clearTimeout(t);
      };
    }, [])
  );

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch Employee Data
      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (employee) {
        setUserName(employee.full_name || "User");
      }

      const employeeId = employee?.id;

      if (employeeId) {
        // Fetch Leave Requests
        const { data: requests } = await supabase
          .from('leave_requests')
          .select('*')
          .eq('employee_id', employeeId);

        // Fetch Allocation (Improvisation: assuming leave_balances has total_allocation for Annual)
        const { data: balanceData } = await supabase
          .from('leave_balances')
          .select('total_allocation')
          .eq('employee_id', employeeId)
          .single();

        const annualAllocation = balanceData?.total_allocation || 12;
        const sickAllocation = 10; // Default
        const specialAllocation = 5; // Default

        let annualUsed = 0;
        let sickUsed = 0;
        let specialUsed = 0;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyMap = new Map<string, number>();
        months.forEach(m => monthlyMap.set(m, 0));

        const currentYear = new Date().getFullYear();
        const upcoming: UpcomingLeave[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requests) {
          requests.forEach((req: any) => {
            const startDate = new Date(req.start_date);
            const endDate = new Date(req.end_date);

            // Calculate duration
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Only count Approved leaves for usage
            if (req.status === 'Disetujui') {
              if (startDate.getFullYear() === currentYear) {
                 const monthName = months[startDate.getMonth()];
                 monthlyMap.set(monthName, (monthlyMap.get(monthName) || 0) + days);
              }

              // Map DB types to UI types
              // Assuming DB uses Indonesian 'Cuti Tahunan', etc.
              const typeLower = req.leave_type.toLowerCase();
              if (typeLower.includes('tahunan') || typeLower.includes('annual')) {
                 annualUsed += days;
              } else if (typeLower.includes('sakit') || typeLower.includes('sick')) {
                 sickUsed += days;
              } else {
                 specialUsed += days;
              }
            }

            // Upcoming Leaves (Approved)
            if (req.status === 'Disetujui' && startDate > today) {
               let color = "#3B82F6"; // Annual default
               let displayType = "Annual Leave";

               const typeLower = req.leave_type.toLowerCase();
               if (typeLower.includes('sakit') || typeLower.includes('sick')) {
                 color = "#10B981";
                 displayType = "Sick Leave";
               } else if (!typeLower.includes('tahunan') && !typeLower.includes('annual')) {
                 color = "#8B5CF6";
                 displayType = req.leave_type;
               }

               const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
               const startStr = startDate.toLocaleDateString('en-GB', options);
               const endStr = endDate.toLocaleDateString('en-GB', options);

               // Determine date string format (single day vs range)
               const dateString = days > 1 ? `${startStr} - ${endStr} • ${days} days` : `${startStr} • 1 day`;

               upcoming.push({
                 id: req.id,
                 type: displayType,
                 startDate: req.start_date,
                 endDate: req.end_date,
                 days,
                 color,
                 dateString
               });
            }
          });
        }

        // Update State
        setLeaveBalances([
          { type: "Annual", days: annualAllocation, used: annualUsed, color: "#3B82F6" },
          { type: "Sick", days: sickAllocation, used: sickUsed, color: "#10B981" },
          { type: "Special", days: specialAllocation, used: specialUsed, color: "#8B5CF6" },
        ]);

        // Prepare Monthly Data (show first 6 months or dynamic?)
        // Keeping UI style: 6 bars. Let's show current month + previous 5, or Jan-Jun if early in year.
        // Actually let's just map the first 6 months for now to match the UI look
        const mData = months.slice(0, 6).map(m => ({
           value: monthlyMap.get(m) || 0,
           label: m
        }));
        setMonthlyUsageData(mData);

        setYearlyUsageData([
           { value: annualUsed, label: "Annual" },
           { value: sickUsed, label: "Sick" },
           { value: specialUsed, label: "Special" }
        ]);

        // Sort upcoming by date
        upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        setUpcomingLeaves(upcoming.slice(0, 3)); // Limit to 3
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: "Apply Leave",
      icon: <FileText color={isDarkMode ? "#F7F7F7" : "#1A1D23"} size={24} />,
      link: "/pengajuan",
      useLink: false,
    },
    {
      id: 2,
      title: "Convert Leave",
      icon: <DollarSign color={isDarkMode ? "#F7F7F7" : "#1A1D23"} size={24} />,
      link: "/konversi",
      useLink: false,
    },
    {
      id: 3,
      title: "My Profile",
      icon: <User color={isDarkMode ? "#F7F7F7" : "#1A1D23"} size={24} />,
      link: "/profile",
      useLink: true,
    },
    {
      id: 4,
      title: "Settings",
      icon: <Settings color={isDarkMode ? "#F7F7F7" : "#1A1D23"} size={24} />,
      link: "/settings",
      useLink: true,
    },
  ];

  const handleQuickActionPress = (link: QuickAction["link"]) => {
    router.push(link);
  };

  return (
    <View
      className={`${isDarkMode ? "bg-gray-900" : "bg-[#F7F7F7]"} flex-1`}
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={isDarkMode ? ["#1E3A8A", "#1E40AF"] : ["#3B82F6", "#60A5FA"]}
        className="px-6 pb-6 rounded-b-3xl"
        style={{ paddingTop: insets.top + 24 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">
              Annual & Benefit | User
            </Text>
            <Text className="text-blue-100 text-sm mt-1">
              Welcome back, {userName}!
            </Text>
          </View>

          <View className="flex-row items-center">
            {switchReady && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {isDarkMode ? (
                  <Moon color="white" size={20} />
                ) : (
                  <Sun color="white" size={20} />
                )}

                <View className="ml-2">
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ true: "#6B7280", false: "#D1D5DB" }}
                    thumbColor={isDarkMode ? "#3B82F6" : "#FFFFFF"}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="px-4 mt-6">
          {/* Leave Balances */}
          <View className="mb-6">
            <Text
              className={`${
                isDarkMode ? "text-white" : "text-[#1A1D23]"
              } text-lg font-bold mb-4`}
            >
              Leave Balances
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {leaveBalances.map((leave, index) => (
                <View
                  key={index}
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } rounded-xl p-4 flex-1 min-w-[45%] shadow-md`}
                >
                  <Text
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } text-sm`}
                  >
                    {leave.type} Leave
                  </Text>
                  <Text
                    className={`${
                      isDarkMode ? "text-white" : "text-[#1A1D23]"
                    } text-2xl font-bold mt-1`}
                  >
                    {leave.days - leave.used}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-2">
                    {leave.used} used of {leave.days} days
                  </Text>
                  <View className="mt-3">
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${(leave.used / Math.max(leave.days, 1)) * 100}%`,
                          backgroundColor: leave.color,
                        }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Charts */}
          <View className="mb-6">
            <Text
              className={`${
                isDarkMode ? "text-white" : "text-[#1A1D23]"
              } text-lg font-bold mb-4`}
            >
              Leave Usage Analytics
            </Text>

            {/* Monthly Chart */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-4 shadow-md mb-4`}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={`${
                    isDarkMode ? "text-white" : "text-[#1A1D23]"
                  } font-semibold`}
                >
                  Monthly Usage
                </Text>
                <TrendingUp
                  color={isDarkMode ? "#10B981" : "#059669"}
                  size={20}
                />
              </View>
              <BarChart
                data={monthlyUsageData}
                width={screenWidth - 60}
                height={150}
                spacing={20}
                barWidth={20}
                xAxisLabelTextStyle={{
                  color: isDarkMode ? "#9CA3AF" : "#6B7280",
                  fontSize: 10,
                }}
                yAxisTextStyle={{
                  color: isDarkMode ? "#9CA3AF" : "#6B7280",
                  fontSize: 10,
                }}
                frontColor={isDarkMode ? "#3B82F6" : "#2563EB"}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesType="solid"
                rulesColor={isDarkMode ? "#374151" : "#E5E7EB"}
                initialSpacing={10}
                endSpacing={10}
              />
            </View>

            {/* Yearly Chart */}
            <View
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-4 shadow-md`}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={`${
                    isDarkMode ? "text-white" : "text-[#1A1D23]"
                  } font-semibold`}
                >
                  Yearly Distribution
                </Text>
                <TrendingDown
                  color={isDarkMode ? "#EF4444" : "#DC2626"}
                  size={20}
                />
              </View>
              <LineChart
                data={yearlyUsageData}
                width={screenWidth - 60}
                height={150}
                spacing={40}
                curved
                initialSpacing={10}
                endSpacing={10}
                areaChart
                hideDataPoints
                thickness={3}
                color={isDarkMode ? "#10B981" : "#059669"}
                startFillColor={isDarkMode ? "#10B981" : "#059669"}
                startOpacity={0.8}
                endFillColor={isDarkMode ? "#10B981" : "#059669"}
                endOpacity={0.3}
                gradientDirection="vertical"
                hideRules
                xAxisLabelTextStyle={{
                  color: isDarkMode ? "#9CA3AF" : "#6B7280",
                  fontSize: 10,
                }}
                yAxisTextStyle={{
                  color: isDarkMode ? "#9CA3AF" : "#6B7280",
                  fontSize: 10,
                }}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text
              className={`${
                isDarkMode ? "text-white" : "text-[#1A1D23]"
              } text-lg font-bold mb-4`}
            >
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {quickActions.map((action) => {
                if (action.useLink) {
                  return (
                    <Link key={action.id} href={action.link} asChild>
                      <TouchableOpacity
                        className={`${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl p-4 flex-1 min-w-[45%] shadow-md items-center`}
                      >
                        <View
                          className={`${
                            isDarkMode ? "bg-gray-700" : "bg-blue-100"
                          } p-3 rounded-full mb-2`}
                        >
                          {action.icon}
                        </View>
                        <Text
                          className={`${
                            isDarkMode ? "text-white" : "text-[#1A1D23]"
                          } font-semibold`}
                        >
                          {action.title}
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      key={action.id}
                      onPress={() => handleQuickActionPress(action.link)}
                      className={`${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } rounded-xl p-4 flex-1 min-w-[45%] shadow-md items-center`}
                    >
                      <View
                        className={`${
                          isDarkMode ? "bg-gray-700" : "bg-blue-100"
                        } p-3 rounded-full mb-2`}
                      >
                        {action.icon}
                      </View>
                      <Text
                        className={`${
                          isDarkMode ? "text-white" : "text-[#1A1D23]"
                        } font-semibold`}
                      >
                        {action.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </View>

          {/* Upcoming Leaves */}
          <View
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl p-4 shadow-md mb-6`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className={`${
                  isDarkMode ? "text-white" : "text-[#1A1D23]"
                } text-lg font-bold`}
              >
                Upcoming Leaves
              </Text>
              <Calendar color={isDarkMode ? "#9CA3AF" : "#6B7280"} size={20} />
            </View>

            {upcomingLeaves.length > 0 ? (
              upcomingLeaves.map((leave, index) => (
                <View key={leave.id} className={`flex-row items-center ${index < upcomingLeaves.length - 1 ? 'mb-3' : ''}`}>
                  <View className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: leave.color }} />
                  <View>
                    <Text
                      className={`${
                        isDarkMode ? "text-white" : "text-[#1A1D23]"
                      } font-medium`}
                    >
                      {leave.type}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {leave.dateString}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-sm italic">No upcoming leaves</Text>
            )}

          </View>
        </View>
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        onPress={() => router.push("/pengajuan")}
        className="absolute bottom-10 right-6 bg-blue-500 p-4 rounded-full shadow-lg"
        activeOpacity={0.8}
      >
        <Calendar color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}
