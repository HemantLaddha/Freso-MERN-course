import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getApplications = createAsyncThunk(
  "getApplications",
  async () => {
    const response = await axios.get("/api/applications");
    return response.data;
  }
);

export const modifyApplicationStatus = createAsyncThunk(
  "modifyApplicationStatus",
  async (args) => {
    await axios.patch(`/api/applications/${args.id}`, {
      status: args.newStatus,
    });
    const response = await axios.get("/api/applications");
    return response.data;
  }
);

export const getCourses = createAsyncThunk("getCourses", async () => {
  const response = await axios.get("/api/courses");
  return response.data;
});

export const addSeats = createAsyncThunk("addSeats", async (args) => {
  const response = await axios.patch(`/api/courses/${args.id}`, {
    availableSeats: args.updatedSeatCount,
  });
  return response.data;
});

export const getApplicationStatus = createAsyncThunk(
  "getApplicationStatus",
  async (args) => {
    const response = await axios.get(
      `/api/applications?applicantEmail=${args.email}`
    );
    return response.data;
  }
);

const initialState = {
  loggedUser: null,
  applications: [],
  applicationStatus: [],
  courses: [],
};

export const slice = createSlice({
  name: "admissions",
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getApplications.fulfilled, (state, action) => {
      state.applications = action.payload;
    });

    builder.addCase(getApplicationStatus.fulfilled, (state, action) => {
      state.applicationStatus = action.payload;
    });

    builder.addCase(getCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });

    builder.addCase(modifyApplicationStatus.fulfilled, (state, action) => {
      state.applications = action.payload;
    });

    builder.addCase(addSeats.fulfilled, (state, action) => {
      const updatedCourse = action.payload;

      state.courses = state.courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      );
    });
  },
});

const { actions, reducer } = slice;

export const { setLoggedUser } = actions;
export default reducer;