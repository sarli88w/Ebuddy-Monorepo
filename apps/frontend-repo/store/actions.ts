import { createAsyncThunk } from "@reduxjs/toolkit";
import { Credential } from "./types";
import { ApiGetToken, ApiGetAuthProfile } from "@/apis/authApi";

export const loginUser = createAsyncThunk(
  "user/login",
  async (payload: Credential, thunkAPI) => {
    try {
      const { token_type, token_access } = await ApiGetToken(payload);
      const resAuth = await ApiGetAuthProfile({ token_type, token_access });

      return {
        token: `${token_type} ${token_access}`,
        data: resAuth,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
