import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../helpers/AxiosInstance";

// ✅ Get All Users
export const getAllUsers = createAsyncThunk("user/getAll", async () => {
  const res = await axiosInstance.get("/user/admin/users");
  return res.data.users;
});

// ✅ Toggle Ban/Unban User with message
export const toggleBanUser = createAsyncThunk(
  "user/toggleBan",
  async ({ userId, banReason, banMessage }) => {
    const res = await axiosInstance.patch(`/user/admin/users/${userId}/toggle-ban`, {
      userId,
      banReason,
      banMessage,
    });

    return {
      user: res.data.user,             // ✅ comes from backend
      message: res.data.message || "", // ✅ for toast
    };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.loading = false;
      })

      .addCase(toggleBanUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      });
  },
});

export default userSlice.reducer;
