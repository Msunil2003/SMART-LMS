import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line no-unused-vars
import { toast } from 'react-toastify';

import axiosInstance from '../../helpers/AxiosInstance';

const initialState = {
  key: "",               // Razorpay Public Key
  order_id: "",          // Razorpay Order ID
  allPayments: {},       // Admin: Full Payment Records
  finalMonths: {},       // Admin: Month-wise breakdown
  monthlySalesRecord: [],// Admin: Array of month sales
  activeCount: 0,        // Admin: Total active users
  totalRevenue: 0        // Admin: Total revenue
};

// ✅ Get Razorpay Public Key
export const getRazorpayKey = createAsyncThunk("razorpay/getKey", async () => {
  const response = await axiosInstance.get('/payments/key');
  return response.data.key;
});

// ✅ Create Razorpay One-Time Order
export const purchaseCourseBundle = createAsyncThunk("razorpay/purchase", async () => {
  const response = await axiosInstance.post('/payments/buy');
  return response.data.order.id; // ✅ This is the actual order ID used in Razorpay widget
});

// ✅ Verify Payment After Success
export const verifyUserPayment = createAsyncThunk("razorpay/verify", async (data) => {
  const response = await axiosInstance.post('/payments/verify', data);
  return response.data;
});

// ✅ Cancel Purchase and Refund (if within 7 days)
export const cancelPurchase = createAsyncThunk("razorpay/cancel", async () => {
  const response = await axiosInstance.post('/payments/cancel');
  return response.data;
});

// ✅ Admin: Get All Payment Stats
export const getPaymentsRecord = createAsyncThunk("razorpay/payments", async () => {
  const response = await axiosInstance.get('/payments?count=100');
  return response.data;
});

const razorpaySlice = createSlice({
  name: 'razorpay',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorpayKey.fulfilled, (state, action) => {
        state.key = action.payload;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.order_id = action.payload;
      })
      .addCase(getPaymentsRecord.fulfilled, (state, action) => {
        state.allPayments = action.payload.allPayments;
        state.finalMonths = action.payload.finalMonths;
        state.monthlySalesRecord = action.payload.monthlySalesRecord;
        state.activeCount = action.payload.activeCount;
        state.totalRevenue = action.payload.totalRevenue;
      });
  }
});

export default razorpaySlice.reducer;
