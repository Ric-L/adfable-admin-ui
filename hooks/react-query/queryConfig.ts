import {
  adminLogin,
  adminLogout,
  addEnrollmentRequest,
  getActiveCourses,
  getAllPromoCodes,
  getAllEnrollmentRequests,
  getEnrollmentRequestByID,
  updateEnrollmentRequest,
  addEnrollment,
  addForExistingStudent,
  updateEnrollment,
  getAllEnrollments,
  getEnrollmentByID,
  deleteEnrollment,
  getAllStudents,
  getStudentByID,
  updateStudent,
  deleteStudent,
  addCourse,
  updateCourse,
  getAllCourses,
  getCourseByID,
  deleteCourse,
  enableCourse,
  disableCourse,
  createClassLink,
  listClassLinks,
  getClassLink,
  updateClassLink,
  deleteClassLink,
  clearClassLink,
  adminGetEnrollmentRequests,
  adminGetEnrollmentRequestById,
  adminAddEnrollmentRequest,
  adminUpdateEnrollmentRequest,
  adminApproveEnrollmentRequest,
  adminRejectEnrollmentRequest,
  getDashboardData,
} from "../../lib/api"; // adjust path as needed
import { keys } from "./keys";

export const queryConfig = {
  // --- ADMIN AUTH ---
  useAdminLogin: { queryFn: adminLogin, queryKeys: [keys.admins, "login"] },
  useAdminLogout: { queryFn: adminLogout, queryKeys: [keys.admins, "logout"] },

  // --- PROMOCODES / COURSES ---
  useGetActiveCourses: { queryFn: getActiveCourses, queryKeys: [keys.courses] },
  useGetAllPromoCodes: { queryFn: getAllPromoCodes, queryKeys: [keys.promocodes] },

  useGetDashboardData: { queryFn: getDashboardData, queryKeys: [keys.dashboard] },

  // --- ENROLLMENT REQUESTS ---
  useGetAllEnrollmentRequests: { queryFn: getAllEnrollmentRequests, queryKeys: [keys.enrollmentRequests] },
  useGetEnrollmentRequestByID: { queryFn: getEnrollmentRequestByID, queryKeys: [keys.enrollmentRequest] },
  useAddEnrollmentRequest: { queryFn: addEnrollmentRequest, queryKeys: [keys.enrollmentRequests, "add"] },
  useUpdateEnrollmentRequest: { queryFn: updateEnrollmentRequest, queryKeys: [keys.enrollmentRequests, "update"] },

  // --- ENROLLMENTS ---
  useAddEnrollment: { queryFn: addEnrollment, queryKeys: [keys.enrollments, "add"] },
  useAddForExistingStudent: { queryFn: addForExistingStudent, queryKeys: [keys.enrollments, "existing"] },
  useUpdateEnrollment: { queryFn: updateEnrollment, queryKeys: [keys.enrollments, "update"] },
  useGetAllEnrollments: { queryFn: getAllEnrollments, queryKeys: [keys.enrollments] },
  useGetEnrollmentByID: { queryFn: getEnrollmentByID, queryKeys: [keys.enrollment] },
  useDeleteEnrollment: { queryFn: deleteEnrollment, queryKeys: [keys.enrollments, "delete"] },

  // --- STUDENTS ---
  useGetAllStudents: { queryFn: getAllStudents, queryKeys: [keys.students] },
  useGetStudentByID: { queryFn: getStudentByID, queryKeys: [keys.student] },
  useUpdateStudent: { queryFn: updateStudent, queryKeys: [keys.students, "update"] },
  useDeleteStudent: { queryFn: deleteStudent, queryKeys: [keys.students, "delete"] },

  // --- COURSES ---
  useAddCourse: { queryFn: addCourse, queryKeys: [keys.courses, "add"] },
  useUpdateCourse: { queryFn: updateCourse, queryKeys: [keys.courses, "update"] },
  useGetAllCourses: { queryFn: getAllCourses, queryKeys: [keys.courses] },
  useGetCourseByID: { queryFn: getCourseByID, queryKeys: [keys.course] },
  useDeleteCourse: { queryFn: deleteCourse, queryKeys: [keys.courses, "delete"] },
  useEnableCourse: { queryFn: enableCourse, queryKeys: [keys.courses, "enable"] },
  useDisableCourse: { queryFn: disableCourse, queryKeys: [keys.courses, "disable"] },

  // --- CLASS LINKS ---
  useCreateClassLink: { queryFn: createClassLink, queryKeys: [keys.classLinks, "create"] },
  useListClassLinks: { queryFn: listClassLinks, queryKeys: [keys.classLinks] },
  useGetClassLink: { queryFn: getClassLink, queryKeys: [keys.classLink] },
  useUpdateClassLink: { queryFn: updateClassLink, queryKeys: [keys.classLinks, "update"] },
  useDeleteClassLink: { queryFn: deleteClassLink, queryKeys: [keys.classLinks, "delete"] },
  useClearClassLink: { queryFn: clearClassLink, queryKeys: [keys.classLinks, "clear"] },

  // --- ADMIN ENROLLMENT REQUESTS ---
  useAdminGetEnrollmentRequests: { queryFn: adminGetEnrollmentRequests, queryKeys: [keys.adminEnrollmentRequests] },
  useAdminGetEnrollmentRequestById: { queryFn: adminGetEnrollmentRequestById, queryKeys: [keys.adminEnrollmentRequest] },
  useAdminAddEnrollmentRequest: { queryFn: adminAddEnrollmentRequest, queryKeys: [keys.adminEnrollmentRequests, "add"] },
  useAdminUpdateEnrollmentRequest: { queryFn: adminUpdateEnrollmentRequest, queryKeys: [keys.adminEnrollmentRequests, "update"] },
  useAdminApproveEnrollmentRequest: { queryFn: adminApproveEnrollmentRequest, queryKeys: [keys.adminEnrollmentRequests, "approve"] },
  useAdminRejectEnrollmentRequest: { queryFn: adminRejectEnrollmentRequest, queryKeys: [keys.adminEnrollmentRequests, "approve"] },
};
