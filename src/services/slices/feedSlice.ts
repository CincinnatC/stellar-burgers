import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import { getFeedsApi } from '../../utils/burger-api';

import type { TOrder, TOrdersData } from '../../utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (): Promise<TOrdersData> => {
    const data = await getFeedsApi();

    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday,
    };
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const feedReducer = feedSlice.reducer;
