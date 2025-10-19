"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Check, X, Clock, CircleAlert as AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useGetQuery, useMutationQuery } from "@/hooks/react-query/hooks/queryHooks";
import { queryConfig } from "@/hooks/react-query/queryConfig";
import { showNotification } from "@/lib/utils";

interface EnrollmentRequest {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  student_grade: string;
  student_board_type: string;
  course_id: number;
  promo_code_id: number | null;
  original_price: number;
  discounted_price: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  student_notes: string | null;
  requested_at: string;
  processed_at: string | null;
  processed_by: number | null;
}

interface EnrollmentData {
  count: number;
  list: EnrollmentRequest[];
}

export default function EnrollmentRequestsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const {
    data: enrollmentData,
    isLoading,
    isFetched,
  } = useGetQuery({
    key: queryConfig.useAdminGetEnrollmentRequests.queryKeys,
    func: queryConfig.useAdminGetEnrollmentRequests.queryFn,
    params: { offset: 0, limit: 100 },
  });

  console.log("enrollmentData", enrollmentData);

  const { mutate: approveFunc } = useMutationQuery({
    func: queryConfig.useAdminApproveEnrollmentRequest.queryFn,
    invalidateKey: queryConfig.useAdminApproveEnrollmentRequest.queryKeys,
    onSuccess() {
      showNotification("success", "Enrollment request approved successfully!");
    },
    onError: () => {
      showNotification("error", "Failed to approve enrollment request");
    },
  });

  const { mutate: rejectFunc } = useMutationQuery({
    func: queryConfig.useAdminRejectEnrollmentRequest.queryFn,
    invalidateKey: queryConfig.useAdminRejectEnrollmentRequest.queryKeys,
    onSuccess() {
      showNotification("success", "Enrollment request rejected successfully!");
    },
    onError: () => {
      showNotification("error", "Failed to reject enrollment request");
    },
  });

  const handleApprove = (requestId: number) => {
    approveFunc(requestId);
  };

  const handleReject = (requestId: number) => {
    rejectFunc(requestId);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const requests: EnrollmentRequest[] = enrollmentData?.result?.list || [];
  const pendingCount: number = enrollmentData?.result?.list?.filter((r) => r.status === "pending").length || 0;
  const approvedCount: number = enrollmentData?.result?.list?.filter((r) => r.status === "approved").length || 0;
  const rejectedCount: number = enrollmentData?.result?.list?.filter((r) => r.status === "rejected").length || 0;
  const cancelledCount: number = enrollmentData?.result?.list?.filter((r) => r.status === "cancelled").length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="animate-spin h-12 w-12 mx-auto" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading enrollment requests...</h3>
        </CardContent>
      </Card>
    );
  }

  if (isFetched && (!enrollmentData?.result?.list || enrollmentData?.result?.list.length === 0)) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">There are no enrollment requests available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enrollment Requests</h1>
        <p className="text-gray-600 mt-2">Review and manage student enrollment requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">{enrollmentData?.result?.list?.length || 0}</div>
            <p className="text-sm text-gray-600">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-sm text-gray-600">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{rejectedCount + cancelledCount}</div>
            <p className="text-sm text-gray-600">Rejected/Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search requests..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg font-semibold">{request.student_name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.student_name}</h3>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {request.student_email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Course ID:</strong> {request.course_id}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Request Date:</strong> {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Grade:</strong> {request.student_grade}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Board:</strong> {request.student_board_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Price:</strong> ₹{request.discounted_price} {request.promo_code_id && `(Original: ₹${request.original_price})`}
                      </p>
                    </div>

                    {request.student_notes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {request.student_notes}
                        </p>
                      </div>
                    )}

                    {request.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(request.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => handleReject(request.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && isFetched && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
