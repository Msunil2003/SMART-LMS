import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import axiosInstance from '../../helpers/AxiosInstance';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') || false,
  role: localStorage.getItem('role') || '',
  data: JSON.parse(localStorage.getItem('data')) || {},
  bannedInfo: null, // ✅ Holds banned user info
};

// ✅ SIGNUP
export const signup = createAsyncThunk('/auth/signup', async (data, { rejectWithValue }) => {
  try {
    toast.loading('Wait! Creating your account', { position: 'top-center' });
    const response = await axiosInstance.post('/user/signup', data);
    toast.dismiss();

    if (response.status === 201) {
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.data.message);
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Signup failed');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ LOGIN
export const login = createAsyncThunk('/auth/login', async (data, { rejectWithValue }) => {
  try {
    toast.loading('Wait! Logging into your account...', { position: 'top-center' });
    const response = await axiosInstance.post('/user/login', data);
    toast.dismiss();

    if (response.status === 200 && response.data?.banned) {
      // ✅ Backend returned banned user with 200
      return {
        banned: true,
        user: response.data.user,
        reason: response.data.reason,
        message: response.data.message,
      };
    }

    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    }

    toast.error(response.data.message);
    return rejectWithValue(response.data.message);
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Login failed');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ LOGOUT
export const logout = createAsyncThunk('/auth/logout', async (_, { rejectWithValue }) => {
  try {
    toast.loading('Wait! Logging out...', { position: 'top-center' });
    const response = await axiosInstance.get('/user/logout');
    toast.dismiss();

    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.data.message);
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Logout failed');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ FORGOT PASSWORD
export const forgotPassword = createAsyncThunk('/user/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    toast.loading('Wait! Sending request...', { position: 'top-center' });
    const response = await axiosInstance.post('/user/forgot-password', data);
    toast.dismiss();

    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.data.message);
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Something went wrong');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ RESET PASSWORD
export const resetPassword = createAsyncThunk('/user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    toast.loading('Wait! Resetting password...', { position: 'top-center' });
    const response = await axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password
    });
    toast.dismiss();

    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.data.message);
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Reset failed');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ CHANGE PASSWORD
export const changePassword = createAsyncThunk('/user/changePassword', async (data, { rejectWithValue }) => {
  try {
    toast.loading('Wait! Changing password...', { position: 'top-center' });
    const response = await axiosInstance.put('/user/change-password', data);
    toast.dismiss();

    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.data.message);
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Change failed');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ EDIT PROFILE
export const editProfile = createAsyncThunk('/user/editProfile', async (data, { rejectWithValue }) => {
  try {
    toast.loading('Wait! Updating profile...', { position: 'top-center' });
    const response = await axiosInstance.put('/user/update', data);
    toast.dismiss();

    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.data.message);
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Update failed');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ GET PROFILE
export const getProfile = createAsyncThunk('/user/myprofile', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/user/myprofile');
    return response.data;
  } catch (error) {
    toast.dismiss();
    toast.error(error?.response?.data?.message || 'Failed to fetch profile');
    return rejectWithValue(error?.response?.data?.message);
  }
});

// ✅ DELETE PROFILE
export const deleteProfile = createAsyncThunk('/user/deleteProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete('/user/delete-profile');
    if (response.status === 200) {
      toast.success(response.data.message);
      return response.data;
    } else {
      toast.error(response.data.message);
      return rejectWithValue(response.data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Delete failed');
    return rejectWithValue(error?.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearBannedInfo: (state) => {
      state.bannedInfo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload?.banned) {
          // ✅ Store banned info without logging in
          state.bannedInfo = {
            user: action.payload.user,
            reason: action.payload.reason,
            message: action.payload.message,
          };
          state.isLoggedIn = false;
          return;
        }

        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('data', JSON.stringify(action.payload.userData));
        localStorage.setItem('role', action.payload.userData.role);

        state.isLoggedIn = true;
        state.data = action.payload.userData;
        state.role = action.payload.userData.role;
        state.bannedInfo = null;
      })

      .addCase(signup.fulfilled, (state, action) => {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('data', JSON.stringify(action.payload.user));
        localStorage.setItem('role', action.payload.user.role);

        state.isLoggedIn = true;
        state.data = action.payload.user;
        state.role = action.payload.user.role;
        state.bannedInfo = null;
      })

      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = '';
        state.bannedInfo = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        localStorage.setItem('data', JSON.stringify(action.payload.user));
        state.data = action.payload.user;
      })

      .addCase(deleteProfile.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = '';
        state.bannedInfo = null;
      });
  }
});

export const { clearBannedInfo } = authSlice.actions;

export default authSlice.reducer;
