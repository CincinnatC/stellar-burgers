import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '../../utils/burger-api';

import type { TOrder } from '../../utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (): Promise<TOrder[]> => {
    return await getOrdersApi();
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const ordersReducer = ordersSlice.reducer;
