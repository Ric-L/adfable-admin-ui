"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Mail, Phone, MoreVertical, UserPlus } from "lucide-react";
import { useGetQuery } from "@/hooks/react-query/hooks/queryHooks";
import { queryConfig } from "@/hooks/react-query/queryConfig";
import Pagination from "@mui/material/Pagination";

interface Student {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  grade: string;
  board_type: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

interface StudentData {
  result: {
    count: number;
    list: Student[];
  };
  success: boolean;
}

interface QueryParams {
  offset: number;
  limit: number;
  full_name?: string;
  email?: string;
  username?: string;
  grade?: string;
  board_type?: string;
  is_active?: boolean;
}

export default function StudentsPage() {
  const [nameFilter, setNameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [usernameFilter, setUsernameFilter] = useState<string>("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [boardTypeFilter, setBoardTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [params, setParams] = useState<QueryParams>({ offset: 0, limit: 100 });

  const dynamicParams: QueryParams = {
    ...params,
    ...(nameFilter && { full_name: nameFilter }),
    ...(emailFilter && { email: emailFilter }),
    ...(usernameFilter && { username: usernameFilter }),
    ...(gradeFilter && { grade: gradeFilter }),
    ...(boardTypeFilter && { board_type: boardTypeFilter }),
    ...(statusFilter !== "all" && { is_active: statusFilter === "active" }),
  };

  const queryKey = [...queryConfig.useGetAllStudents.queryKeys, JSON.stringify(dynamicParams)];

  const {
    data: studentData,
    isLoading,
    isFetched,
    refetch,
  } = useGetQuery({
    key: queryKey,
    func: queryConfig.useGetAllStudents.queryFn,
    params: dynamicParams,
  });

  console.log("dynamicParams", dynamicParams);

  const studentsList: Student[] = studentData?.result?.list || [];
  const totalCount: number = studentData?.result?.count || 0;
  const totalPages: number = Math.ceil(totalCount / dynamicParams.limit);
  const currentPage: number = Math.floor(dynamicParams.offset / dynamicParams.limit) + 1;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setParams((prev) => ({ ...prev, offset: (value - 1) * prev.limit }));
  };

  const getStatusColor = (status: boolean): string => {
    return status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">Manage student accounts and enrollments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()}>Refresh</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search name..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={nameFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNameFilter(e.target.value);
                  setParams((prev) => ({ ...prev, offset: 0 }));
                }}
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={usernameFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUsernameFilter(e.target.value);
                  setParams((prev) => ({ ...prev, offset: 0 }));
                }}
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Email"
                className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={emailFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmailFilter(e.target.value);
                  setParams((prev) => ({ ...prev, offset: 0 }));
                }}
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Grade"
                className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={gradeFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setGradeFilter(e.target.value);
                  setParams((prev) => ({ ...prev, offset: 0 }));
                }}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={boardTypeFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setBoardTypeFilter(e.target.value);
                setParams((prev) => ({ ...prev, offset: 0 }));
              }}
            >
              <option value="">All Boards</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="STATE">State</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setStatusFilter(e.target.value);
                setParams((prev) => ({ ...prev, offset: 0 }));
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  studentsList.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                          <div className="text-sm text-gray-500">@{student.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-2" />
                            {student.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            {student.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.board_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(student.is_active)}>{student.is_active ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(student.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && studentsList.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center py-4">
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </div>
    </div>
  );
}
