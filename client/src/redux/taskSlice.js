import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "../services/taskServices";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (token, thunkAPI) => {
    try {
      console.log("Fetching tasks initiated");
      const response = await taskService.getAllTasks(token);
      return response;
    } catch (error) {
      console.error("Error fetching tasks");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch a single task by ID
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async ({ token, taskId }, thunkAPI) => {
    try {
      console.log("Fetching task by ID initiated");
      const response = await taskService.getTaskById(token, taskId);
      return response;
    } catch (error) {
      console.error("Error fetching task by ID");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({ token, taskData }, thunkAPI) => {
    try {
      console.log("Creating task initiated");
      const response = await taskService.createTask(token, taskData);
      return response;
    } catch (error) {
      console.error("Error creating task");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ token, taskId, taskData }, thunkAPI) => {
    try {
      console.log("Updating task initiated");
      const response = await taskService.updateTask(token, taskId, taskData);
      return response;
    } catch (error) {
      console.error("Error updating task");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ token, taskId }, thunkAPI) => {
    try {
      console.log("Deleting task initiated");
      const response = await taskService.deleteTask(token, taskId);
      return response;
    } catch (error) {
      console.error("Error deleting task");
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Task Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetTaskState: (state) => {
      state.tasks = [];
      state.currentTask = null;
      state.error = null;
      console.log("Task state reset");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        console.log("Fetching tasks started");
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log("Fetching tasks completed");
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.error("Fetching tasks failed");
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTaskById.pending, (state) => {
        console.log("Fetching task by ID started");
        state.loading = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        console.log("Fetching task by ID completed");
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        console.error("Fetching task by ID failed");
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        console.log("Creating task started");
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        console.log("Creating task completed");
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        console.error("Creating task failed");
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        console.log("Updating task started");
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        console.log("Updating task completed");
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        console.error("Updating task failed");
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        console.log("Deleting task started");
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        console.log("Deleting task completed");
        state.loading = false;
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.meta.arg.taskId
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        console.error("Deleting task failed");
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTaskState } = taskSlice.actions;

export default taskSlice.reducer;
