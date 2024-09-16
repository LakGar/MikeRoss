import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userServices"; // Adjust the import path to your service layer

// Fetch current user info
export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (token, thunkAPI) => {
    try {
      const response = await userService.getMyProfile(token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update user info
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, thunkAPI) => {
    try {
      const { token, ...userUpdates } = userData;
      const response = await userService.updateUserProfile(
        token,
        userUpdates.userId,
        userUpdates
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (token, thunkAPI) => {
    try {
      await userService.deleteUserInfo(token);
      localStorage.removeItem("token"); // Clear token from storage
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch any user info by ID
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;
      const response = await userService.getUserProfile(token, userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Login User
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await userService.login(userData); // Adjust to match your API
      localStorage.setItem("token", response.token); // Save token in localStorage
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Register User
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await userService.register(userData); // Adjust to match your API
      localStorage.setItem("token", response.token); // Save token in localStorage
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"), // Check if token exists in localStorage
    userToken: localStorage.getItem("token") || null, // Initialize from localStorage
    userInfo: null,
    error: null,
    loading: false,
  },
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userToken = action.payload.userToken;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userToken = null;
      state.userInfo = null;
      localStorage.removeItem("token"); // Clear token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userToken = action.payload.token;
        state.userInfo = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userToken = action.payload.token;
        state.userInfo = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userToken = null;
        state.userInfo = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuthState, logout } = authSlice.actions;

// Check if token exists in localStorage and set the authentication state accordingly
export const checkAuthState = () => (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(setAuthState({ isAuthenticated: true, userToken: token }));
    dispatch(getUserInfo(token));
  } else {
    dispatch(setAuthState({ isAuthenticated: false, userToken: null }));
  }
};

// Selectors
export const selectUserLoading = (state) => state.auth.loading;
export const selectUserError = (state) => state.auth.error;

export default authSlice.reducer;
