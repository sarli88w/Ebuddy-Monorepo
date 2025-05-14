import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, ThemeState } from "./types";
import type { User } from "./types";
import { loginUser } from "./actions";

const initThemeState: ThemeState = {
  darkMode: false,
  loading: false,
  error: null,
};

const initUserState: UserState = {
  isAuthenticated: false,
  token: null,
  data: null,
  loading: false,
  error: null,
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initThemeState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

const userSlice = createSlice({
  name: "user",
  initialState: initUserState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.data = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ [key: string]: any }>) => {
        state.isAuthenticated = true;
        state.data = action.payload.data;
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleTheme, setTheme, setLoading, setError } = themeSlice.actions;
export const { logout, setUser, clearUser } = userSlice.actions;

export default {
  theme: themeSlice.reducer,
  user: userSlice.reducer,
};
