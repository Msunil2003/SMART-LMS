import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from 'react-toastify'

import axiosInstance from '../../helpers/AxiosInstance'

const initialState = {
    lectures: []
};

// === GET LECTURES ===
export const getLectures = createAsyncThunk("/course/lecture", async (cid) => {
    try {
        toast.loading("Wait! fetching lectures", {
            position: 'top-center'
        });
        const response = await axiosInstance.get(`/course/${cid}`);
        toast.dismiss();

        if (response.status === 200) {
            toast.success(response.data.message);
            return response?.data;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || error.message);
        throw error;
    }
});

// === ADD LECTURE (File or YouTube) ===
export const addLecture = createAsyncThunk("/course/lecture/add", async (data) => {
    try {
        toast.loading("Wait! adding lecture", {
            position: 'top-center'
        });

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        if (data.mode === "link") {
            formData.append("mode", "link");
            formData.append("videoSrc", data.videoSrc); // YouTube embed link
        } else {
            formData.append("mode", "upload");
            formData.append("lecture", data.lecture); // MP4 upload
        }

        const response = await axiosInstance.post(`/course/${data.cid}`, formData);
        toast.dismiss();

        if (response.status === 200) {
            toast.success(response.data.message);
            return response?.data;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || error.message);
        throw error;
    }
});

// === UPDATE LECTURE ===
export const updateLecture = createAsyncThunk("/course/lecture/update", async (data) => {
    try {
        toast.loading("Wait! updating lecture", {
            position: 'top-center'
        });

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        if (data.mode === "link") {
            formData.append("mode", "link");
            formData.append("videoSrc", data.videoSrc);
        } else {
            formData.append("mode", "upload");
            formData.append("lecture", data.lecture);
        }

        const response = await axiosInstance.put(`/course/lectures/${data.cid}/${data.lectureId}`, formData);
        toast.dismiss();

        if (response.status === 200) {
            toast.success(response.data.message);
            return response?.data;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || error.message);
        throw error;
    }
});

// === DELETE LECTURE ===
export const deleteLecture = createAsyncThunk("/course/lecture/delete", async (data) => {
    try {
        toast.loading("Wait! deleting lecture", {
            position: 'top-center'
        });

        const response = await axiosInstance.delete(`/course/lectures/${data.cid}/${data.lectureId}`);
        toast.dismiss();

        if (response.status === 200) {
            toast.success(response.data.message);
            return response?.data;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || error.message);
        throw error;
    }
});

// === SLICE ===
const lectureSlice = createSlice({
    name: 'lecture',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLectures.fulfilled, (state, action) => {
                state.lectures = action.payload?.lectures;
            })
            .addCase(addLecture.fulfilled, (state, action) => {
                state.lectures = action.payload?.lectures;
            })
            .addCase(updateLecture.fulfilled, (state, action) => {
                state.lectures = action.payload?.lectures;
            })
            .addCase(deleteLecture.fulfilled, (state, action) => {
                state.lectures = action.payload?.lectures;
            });
    }
});

export default lectureSlice.reducer;
