import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../types";
import { clearAuthHeader, setAuthHeader } from "@/lib/api";

type User = {
  id: number;
  email: string;
  name: string;
  role_id: number;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

type AuthState = {
  user: User | null;
  token: string | null;
  sessionId: number | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  sessionId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; sessionId: number }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.sessionId = action.payload.sessionId;
      state.isAuthenticated = true;
      setAuthHeader(action.payload.token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.sessionId = null;
      state.isAuthenticated = false;
      clearAuthHeader();
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      sessionStorage.removeItem("authToken");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logOut, updateUser } = authSlice.actions;
export default authSlice.reducer;

// ✅ Selectors
export const selectCurrentAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentSessionId = (state: RootState) => state.auth.sessionId;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
