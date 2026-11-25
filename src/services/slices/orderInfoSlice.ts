import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '../../utils/burger-api';

import type { TOrder } from '../../utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

type TOrderInfoState = {
  orderInfo: TOrder | null;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TOrderInfoState = {
  orderInfo: null,
  isLoading: false,
  error: null,
};

export const fetchOrderInfo = createAsyncThunk(
  'orderInfo/fetchOrderInfo',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);

    if (!data.success || !data.orders.length) {
      throw new Error('Заказ не найден');
    }

    return data.orders[0];
  }
);

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderInfo = null;
      })
      .addCase(fetchOrderInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderInfo = action.payload;
      })
      .addCase(fetchOrderInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const orderInfoReducer = orderInfoSlice.reducer;
