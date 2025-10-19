"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, CreditCard as Edit, Trash2, Clock, RefreshCw } from "lucide-react";
import { useGetQuery, useMutationQuery } from "@/hooks/react-query/hooks/queryHooks";
import { queryConfig } from "@/hooks/react-query/queryConfig";
import { showNotification } from "@/lib/utils";
import { Modal, Box, TextField, Button as MuiButton, Typography, MenuItem } from "@mui/material";

// Payload for adding or updating a course
export interface CoursePayload {
  title: string;
  description?: string;
  subject: string;
  board_type: string;
  grade_level: string;
  start_date: string;
  end_date: string;
  price: number;
  instructor_name: string;
  thumbnail_url?: string;
  class_time: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  subject: string;
  board_type: string;
  grade_level: string;
  start_date: string;
  end_date: string;
  price: number;
  instructor_name: string;
  thumbnail_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  class_time: string;
}

interface ActiveCoursesData {
  result: {
    count: number;
    list: Course[];
  };
  success: boolean;
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [addFormData, setAddFormData] = useState<CoursePayload>({
    title: "",
    description: "",
    subject: "",
    board_type: "",
    grade_level: "",
    start_date: "",
    end_date: "",
    price: 0,
    instructor_name: "",
    thumbnail_url: "",
    class_time: "",
  });
  const [editFormData, setEditFormData] = useState<CoursePayload>({
    title: "",
    description: "",
    subject: "",
    board_type: "",
    grade_level: "",
    start_date: "",
    end_date: "",
    price: 0,
    instructor_name: "",
    thumbnail_url: "",
    class_time: "",
  });

  const {
    data: activeCoursesData,
    isLoading,
    isFetched,
    refetch,
  } = useGetQuery({
    key: queryConfig.useGetAllCourses.queryKeys,
    func: queryConfig.useGetAllCourses.queryFn,
    params: { offset: 0, limit: 100 },
  });

  const { mutate: addCourses } = useMutationQuery({
    func: queryConfig.useAddCourse.queryFn,
    invalidateKey: queryConfig.useAddCourse.queryKeys,
    onSuccess: () => {
      showNotification("success", "Course added successfully");
      setIsAddModalOpen(false);
      setAddFormData({
        title: "",
        description: "",
        subject: "",
        board_type: "",
        grade_level: "",
        start_date: "",
        end_date: "",
        price: 0,
        instructor_name: "",
        thumbnail_url: "",
        class_time: "",
      });
    },
    onError: () => {
      showNotification("error", "Failed to add course");
      setIsAddModalOpen(false);
    },
  });

  const { mutate: updateCourses } = useMutationQuery({
    func: queryConfig.useUpdateCourse.queryFn,
    invalidateKey: queryConfig.useUpdateCourse.queryKeys,
    onSuccess: () => {
      showNotification("success", "Course updated successfully");
      setIsEditModalOpen(false);
      setSelectedCourse(null);
      setEditFormData({
        title: "",
        description: "",
        subject: "",
        board_type: "",
        grade_level: "",
        start_date: "",
        end_date: "",
        price: 0,
        instructor_name: "",
        thumbnail_url: "",
        class_time: "",
      });
    },
    onError: () => {
      showNotification("error", "Failed to update course");
      // setIsEditModalOpen(false);
    },
  });

  const courses: Course[] = activeCoursesData?.result?.list || [];

  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (course.is_active ? "active" : "draft") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive: boolean): string => {
    return isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourses(addFormData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      console.log("editFormData", editFormData);
      updateCourses({ id: selectedCourse.id, body: { ...editFormData } });
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setEditFormData({
      title: course.title,
      description: course.description,
      subject: course.subject,
      board_type: course.board_type,
      grade_level: course.grade_level,
      start_date: course.start_date,
      end_date: course.end_date,
      price: course.price,
      instructor_name: course.instructor_name,
      thumbnail_url: course.thumbnail_url,
      class_time: course.class_time,
    });
    setIsEditModalOpen(true);
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    overflowY: "auto" as "auto",
    display: "flex",
    flexDirection: "column" as "column",
    "& .MuiTextField-root": { mb: 2 },
    "& .MuiButton-root": { textTransform: "none" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">Manage all courses and their content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refetch Courses
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search courses or instructors..."
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <RefreshCw className="h-12 w-12 mx-auto animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading courses...</h3>
            <p className="text-gray-600">Please wait while we fetch the course data.</p>
          </CardContent>
        </Card>
      )}

      {/* Courses Grid */}
      {!isLoading && isFetched && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                <div className="py-2">
                  <Badge className={` ${getStatusColor(course.is_active)}`}>{course.is_active ? "Active" : "Draft"}</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Instructor:</strong> {course.instructor_name}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.class_time}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">Class :{course.grade_level} </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(course)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results State */}
      {!isLoading && isFetched && filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find what you&apos;re looking for.</p>
          </CardContent>
        </Card>
      )}

      {/* Add Course Modal */}
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" className="mb-4 font-bold text-gray-900">
            Add New Course
          </Typography>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Title"
              value={addFormData.title}
              onChange={(e) => setAddFormData({ ...addFormData, title: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Description"
              value={addFormData.description}
              onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Subject"
              value={addFormData.subject}
              onChange={(e) => setAddFormData({ ...addFormData, subject: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              select
              fullWidth
              label="Board Type"
              value={addFormData.board_type}
              onChange={(e) => setAddFormData({ ...addFormData, board_type: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            >
              <MenuItem value="COHSEM">COHSEM</MenuItem>
              <MenuItem value="CBSE">CBSE</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Grade Level"
              value={addFormData.grade_level}
              onChange={(e) => setAddFormData({ ...addFormData, grade_level: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            >
              <MenuItem value="9">9</MenuItem>
              <MenuItem value="10">10</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={addFormData.start_date}
              onChange={(e) => setAddFormData({ ...addFormData, start_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={addFormData.end_date}
              onChange={(e) => setAddFormData({ ...addFormData, end_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={addFormData.price}
              onChange={(e) => setAddFormData({ ...addFormData, price: parseFloat(e.target.value) })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Instructor Name"
              value={addFormData.instructor_name}
              onChange={(e) => setAddFormData({ ...addFormData, instructor_name: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Thumbnail URL"
              value={addFormData.thumbnail_url}
              onChange={(e) => setAddFormData({ ...addFormData, thumbnail_url: e.target.value })}
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Class Time"
              type="time"
              value={dayjs(addFormData.class_time, "HH:mm:ss").format("HH:mm")}
              onChange={(e) => {
                const formatted = dayjs(e.target.value, "HH:mm").format("HH:mm") + ":00"; // append seconds
                setAddFormData({ ...addFormData, class_time: formatted });
              }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 60 }} // restricts to minute precision (no seconds)
              required
              variant="outlined"
              className="rounded-lg"
            />
            <div className="flex justify-end gap-2 mt-4">
              <MuiButton variant="outlined" onClick={() => setIsAddModalOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancel
              </MuiButton>
              <MuiButton variant="contained" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Course
              </MuiButton>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Edit Course Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" className="mb-4 font-bold text-gray-900">
            Edit Course
          </Typography>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Title"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Description"
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Subject"
              value={editFormData.subject}
              onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Board Type"
              value={editFormData.board_type}
              onChange={(e) => setEditFormData({ ...editFormData, board_type: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Grade Level"
              value={editFormData.grade_level}
              onChange={(e) => setEditFormData({ ...editFormData, grade_level: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={editFormData.start_date}
              onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={editFormData.end_date}
              onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={editFormData.price}
              onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Instructor Name"
              value={editFormData.instructor_name}
              onChange={(e) => setEditFormData({ ...editFormData, instructor_name: e.target.value })}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Thumbnail URL"
              value={editFormData.thumbnail_url}
              onChange={(e) => setEditFormData({ ...editFormData, thumbnail_url: e.target.value })}
              variant="outlined"
              className="rounded-lg"
            />
            <TextField
              fullWidth
              label="Class Time"
              type="time"
              value={editFormData.class_time}
              onChange={(e) => setEditFormData({ ...editFormData, class_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
              className="rounded-lg"
            />
            <div className="flex justify-end gap-2 mt-4">
              <MuiButton variant="outlined" onClick={() => setIsEditModalOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancel
              </MuiButton>
              <MuiButton variant="contained" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Course
              </MuiButton>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
