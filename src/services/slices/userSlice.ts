import { setCookie, deleteCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
} from '../../utils/burger-api';

import type { TLoginData, TRegisterData } from '../../utils/burger-api';
import type { TUser } from '../../utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);

  localStorage.setItem('refreshToken', response.refreshToken);
  setCookie('accessToken', response.accessToken);

  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TUser> & { password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();

  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = action.error;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const userReducer = userSlice.reducer;
