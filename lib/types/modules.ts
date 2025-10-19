export type TListResult<T> = {
  count?: number;
  list: T[];
};

export interface ApiResponse<T> {
  success: boolean;
  result?: {
    count?: number;
    list: T[];
  };
  recent_enrollment_requests?: any[]; // you can replace 'any' with a specific type later
  recent_enrollments?: any[];
  total_students?: number;
  total_courses?: number;
  total_enrollments?: number;
  enrollment_request_stats?: {
    approved: number;
    cancelled: number;
    pending: number;
    rejected: number;
  };
  message?: string;
}

export type ApiCountResponse = {
  success: boolean;
  count: number;
};

export interface ApiSingleResponse<T> {
  success: boolean;
  result: T;
}

// export type TApiResponse<T> = {
// 	success: boolean;
// 	result?: T;
// 	message?: string;
// };

// export type TApiResponse<T = any> = {
//   success: boolean;
//   result?: T;
//   message?: string;
// };

export type TApiResponse<T> = {
  result: {
    count: number;
    list: T[];
  };
  success: boolean;
  message?: string;
};
export type TApiCountResponse = {
  success: boolean;
  count: number;
};

export type TApiSingleResponse<T> = {
  success: boolean;
  message?: string;
  result: T;
};
