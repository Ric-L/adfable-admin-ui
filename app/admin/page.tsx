"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetQuery } from "@/hooks/react-query/hooks/queryHooks";
import { queryConfig } from "@/hooks/react-query/queryConfig";
import { Users, BookOpen, UserCheck, Video, TrendingUp, Clock, Award, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Define interfaces for the data structures
interface EnrollmentRequest {
  id: number;
  student_name: string;
  course_title: string;
  status: string;
  requested_at: string;
  original_price: number;
  discounted_price: number;
}

interface Enrollment {
  enrollment_id: number;
  student_name: string;
  course_title: string;
  enrolled_at: string;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  result?: {
    count?: number;
    list: T[];
  };
  message?: string;
}

interface DashboardData {
  total_students?: number;
  total_courses?: number;
  total_enrollments?: number;
  enrollment_request_stats?: {
    approved: number;
    cancelled: number;
    pending: number;
    rejected: number;
  };
  recent_enrollment_requests?: EnrollmentRequest[];
  recent_enrollments?: Enrollment[];
}

interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Activity {
  id: number;
  action: string;
  details: string;
  time: string;
  type: "enrollment" | "class" | "course" | "approval";
}

export default function AdminDashboard() {
  const {
    data: dashboardData,
    isLoading,
    isFetched,
  } = useGetQuery({
    key: queryConfig.useGetDashboardData.queryKeys,
    func: queryConfig.useGetDashboardData.queryFn,
    params: { offset: 0, limit: 100 },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!isFetched || !dashboardData || !dashboardData.success || !dashboardData.result?.list?.[0]) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">{dashboardData?.message || "Failed to load dashboard data"}</p>
      </div>
    );
  }

  // Extract the actual dashboard data from the nested structure
  const data = dashboardData.result.list[0];

  const stats: Stat[] = [
    {
      title: "Total Students",
      value: (data.total_students ?? 0).toLocaleString(),
      change: "+0%",
      changeType: "neutral",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Courses",
      value: (data.total_courses ?? 0).toLocaleString(),
      change: "+0",
      changeType: "neutral",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Pending Requests",
      value: (data.enrollment_request_stats?.pending ?? 0).toLocaleString(),
      change: "0",
      changeType: "neutral",
      icon: UserCheck,
      color: "bg-orange-500",
    },
    {
      title: "Live Classes Today",
      value: "0",
      change: "0",
      changeType: "neutral",
      icon: Video,
      color: "bg-purple-500",
    },
  ];

  const recentActivity: Activity[] = (data.recent_enrollments ?? []).map((enrollment: any) => ({
    id: enrollment.enrollment_id,
    action: "New student enrolled",
    details: `${enrollment.student_name} enrolled in ${enrollment.course_title}`,
    time: formatDistanceToNow(new Date(enrollment.enrolled_at), { addSuffix: true }),
    type: "enrollment",
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at Afdable Classes today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : stat.changeType === "negative" ? "text-red-600" : "text-gray-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "enrollment"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "class"
                        ? "bg-purple-100 text-purple-600"
                        : activity.type === "course"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {activity.type === "enrollment" && <UserCheck className="h-4 w-4" />}
                    {activity.type === "class" && <Video className="h-4 w-4" />}
                    {activity.type === "course" && <BookOpen className="h-4 w-4" />}
                    {activity.type === "approval" && <Award className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Completion Rate</span>
                  <span className="text-sm text-gray-900">N/A</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Student Satisfaction</span>
                  <span className="text-sm text-gray-900">N/A</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Revenue</span>
                  <span className="text-sm text-gray-900">N/A</span>
                </div>
                <div className="flex items-center mt-1">
                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">N/A</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
