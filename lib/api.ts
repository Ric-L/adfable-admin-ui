import axios, { AxiosError } from "axios";
import { Methods, TLiveLinkUpdate, TQueryParams } from "./types/types";

// Base URL config
if (process.env.NODE_ENV === "development") {
  // axios.defaults.baseURL = "http://127.0.0.1:8110/api/v1/admin";
  axios.defaults.baseURL = "https://afdableclasses.in/api/v1/admin";
} else {
  axios.defaults.baseURL = "https://afdableclasses.in/api/v1/admin";
}

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.patch["Content-Type"] = "application/json";

// --- AUTH HEADERS ---

export const setAuthHeader = (token: string) => {
  if (token) {
    axios.defaults.headers["Authorization"] = token;
    localStorage.setItem("authToken", token);
    return true;
  }
  return false;
};

export const clearAuthHeader = () => {
  delete axios.defaults.headers["Authorization"];
  localStorage.removeItem("authToken");
  return true;
};

// --- GENERIC CALL FUNCTION ---
const _callApi = async (url: string, method: Methods = "get", body = {}) => {
  try {
    const response = await axios[method](url, body);
    const { status, data } = response;

    if (status === 401) {
      if (data?.message === "Access Denied") {
        return { success: false, message: "Access Denied" };
      }
      return { success: false };
    }

    if (status === 200 || status === 201) return data;

    return { success: false };
  } catch (error) {
    const err = error as AxiosError;
    return err.response?.data || { success: false, message: "Network Error" };
  }
};

// --- ADMIN AUTH ---
export const adminLogin = (body: { username: string; password: string }) => _callApi("/login", "post", body);

export const adminLogout = () => _callApi("/logout", "post");

export const addEnrollmentRequest = (body: Record<string, any>) => _callApi("/enrollment-request", "post", body);

export const getDashboardData = () => _callApi("/dashboard", "get");
export const getActiveCourses = () => _callApi("/active-courses", "get");

export const getAllPromoCodes = () => _callApi("/promocodes", "get");

// --- ENROLLMENT REQUESTS ---
export const getAllEnrollmentRequests = () => _callApi("/enrollment-requests", "get");

export const getEnrollmentRequestByID = (id: number) => _callApi(`/enrollment-requests/${id}`, "get");

export const updateEnrollmentRequest = (id: number, body: Record<string, any>) => _callApi(`/enrollment-requests/${id}`, "put", body);

// --- ENROLLMENTS ---
export const addEnrollment = (body: Record<string, any>) => _callApi("/enrollments", "post", body);

export const addForExistingStudent = (body: Record<string, any>) => _callApi("/enrollments/existing", "post", body);

export const updateEnrollment = (id: number, body: Record<string, any>) => _callApi(`/enrollments/${id}`, "put", body);

export const getAllEnrollments = () => _callApi("/enrollments", "get");

export const getEnrollmentByID = (id: number) => _callApi(`/enrollments/${id}`, "get");

export const deleteEnrollment = (id: number) => _callApi(`/enrollments/${id}`, "delete");

// --- STUDENTS ---
export const getAllStudents = ({ offset, limit, full_name, email, username, grade, board_type }: TQueryParams) => {
  const params = new URLSearchParams();

  if (offset !== undefined) params.append("offset", String(offset));
  if (limit !== undefined) params.append("limit", String(limit));
  if (full_name) params.append("full_name", full_name);
  if (email) params.append("email", email);
  if (username) params.append("username", username);
  if (grade) params.append("grade", grade);
  if (board_type) params.append("board_type", board_type);

  const query = params.toString();
  const url = query ? `/students?${query}` : "/students";

  return _callApi(url, "get");
};

export const getStudentByID = (id: number) => _callApi(`/students/${id}`, "get");

export const updateStudent = (id: number, body: Record<string, any>) => _callApi(`/students/${id}`, "put", body);

export const deleteStudent = (id: number) => _callApi(`/students/${id}`, "delete");

// --- COURSES ---
export const addCourse = (body: Record<string, any>) => _callApi("/courses", "post", body);

export const updateCourse = ({ id, body }: { id: number; body: any }) => _callApi(`/courses/${id}`, "put", body);

export const getAllCourses = () => _callApi("/courses", "get");

export const getCourseByID = (id: number) => _callApi(`/courses/${id}`, "get");

export const deleteCourse = (id: number) => _callApi(`/courses/${id}`, "delete");

export const enableCourse = (id: number) => _callApi(`/courses/${id}/enable`, "put");

export const disableCourse = (id: number) => _callApi(`/courses/${id}/disable`, "put");

// --- CLASS LINKS ---
export const createClassLink = (body: Record<string, any>) => _callApi("/class-links", "post", body);

export const listClassLinks = () => _callApi("/class-links", "get");

export const getClassLink = (id: number) => _callApi(`/class-links/${id}`, "get");

export const updateClassLink = ({ id, body }: { id: number; body: TLiveLinkUpdate }) => _callApi(`/class-links/${id}`, "put", body);

export const deleteClassLink = (id: number) => _callApi(`/class-links/${id}`, "delete");

export const clearClassLink = (id: number) => _callApi(`/class-links/${id}/clear`, "delete");

// --- ADMIN ENROLLMENT REQUESTS ---
export const adminGetEnrollmentRequests = () => _callApi("/enrollment-requests", "get");

export const adminGetEnrollmentRequestById = (id: number) => _callApi(`/enrollment-requests/${id}`, "get");

export const adminAddEnrollmentRequest = (body: Record<string, any>) => _callApi("/enrollment-requests", "post", body);

export const adminUpdateEnrollmentRequest = (id: number, body: Record<string, any>) => _callApi(`/enrollment-requests/${id}`, "put", body);

export const adminApproveEnrollmentRequest = (id: number) => _callApi(`/enrollment-requests/${id}/approve`, "post", "");
export const adminRejectEnrollmentRequest = (id: number) => _callApi(`/enrollment-requests/${id}/reject`, "post", "");

// adminGroup.Post("/:id/approve", handlers.AdminApproveEnrollmentRequest)
// adminGroup.Post("/:id/reject", handlers.RejectEnrollmentRequest)
