import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import patientService from "../services/patientServices";

// Thunks for CRUD operations on Patient
export const createPatient = createAsyncThunk(
  "patient/createPatient",
  async ({ userId, medicalInformation, token }, thunkAPI) => {
    try {
      const response = await patientService.createPatient(
        { userId, medicalInformation },
        token
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getPatientById = createAsyncThunk(
  "patient/getPatientById",
  async (data, thunkAPI) => {
    const { token, userId } = data;

    console.log(`getPatientById: ${token}, userId: ${userId}`);
    try {
      const response = await patientService.getPatientById(userId, token); // correct order
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updatePatient = createAsyncThunk(
  "patient/updatePatient",
  async (data, thunkAPI) => {
    const { token, userId, patientData } = data;
    console.log(
      `updatePatient: ${token}, userId: ${userId}, patientData: ${JSON.stringify(
        patientData
      )}`
    );
    try {
      const response = await patientService.updatePatient(
        userId,
        token,
        patientData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePatient = createAsyncThunk(
  "patient/deletePatient",
  async (data, thunkAPI) => {
    const { token, userId } = data;
    try {
      const response = await patientService.deletePatient(token, userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunks for managing Sleep Entries
export const addSleepEntry = createAsyncThunk(
  "patient/addSleepEntry",
  async (data, thunkAPI) => {
    const { token, userId, sleepData } = data;
    try {
      const response = await patientService.addSleepEntry(
        token,
        userId,
        sleepData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateSleepEntry = createAsyncThunk(
  "patient/updateSleepEntry",
  async (data, thunkAPI) => {
    const { token, userId, sleepId, sleepData } = data;
    try {
      const response = await patientService.updateSleepEntry(
        token,
        userId,
        sleepId,
        sleepData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteSleepEntry = createAsyncThunk(
  "patient/deleteSleepEntry",
  async (data, thunkAPI) => {
    const { token, userId, sleepId } = data;
    try {
      const response = await patientService.deleteSleepEntry(
        token,
        userId,
        sleepId
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunks for managing Mood Entries
export const addMoodEntry = createAsyncThunk(
  "patient/addMoodEntry",
  async (data, thunkAPI) => {
    const { token, userId, moodData } = data;
    try {
      const response = await patientService.addMoodEntry(
        token,
        userId,
        moodData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateMoodEntry = createAsyncThunk(
  "patient/updateMoodEntry",
  async (data, thunkAPI) => {
    const { token, userId, moodId, moodData } = data;
    try {
      const response = await patientService.updateMoodEntry(
        token,
        userId,
        moodId,
        moodData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteMoodEntry = createAsyncThunk(
  "patient/deleteMoodEntry",
  async (data, thunkAPI) => {
    const { token, userId, moodId } = data;
    try {
      const response = await patientService.deleteMoodEntry(
        token,
        userId,
        moodId
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunks for managing Activity Entries
export const addActivityEntry = createAsyncThunk(
  "patient/addActivityEntry",
  async (data, thunkAPI) => {
    const { token, userId, activityData } = data;
    try {
      const response = await patientService.addActivityEntry(
        token,
        userId,
        activityData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateActivityEntry = createAsyncThunk(
  "patient/updateActivityEntry",
  async (data, thunkAPI) => {
    const { token, userId, activityId, activityData } = data;
    try {
      const response = await patientService.updateActivityEntry(
        token,
        userId,
        activityId,
        activityData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteActivityEntry = createAsyncThunk(
  "patient/deleteActivityEntry",
  async (data, thunkAPI) => {
    const { token, userId, activityId } = data;
    try {
      const response = await patientService.deleteActivityEntry(
        token,
        userId,
        activityId
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunks for managing Test Results
export const addTestResult = createAsyncThunk(
  "patient/addTestResult",
  async (data, thunkAPI) => {
    const { token, userId, testData } = data;
    try {
      const response = await patientService.addTestResult(
        token,
        userId,
        testData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateTestResult = createAsyncThunk(
  "patient/updateTestResult",
  async (data, thunkAPI) => {
    const { token, userId, testId, testData } = data;
    try {
      const response = await patientService.updateTestResult(
        token,
        userId,
        testId,
        testData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteTestResult = createAsyncThunk(
  "patient/deleteTestResult",
  async (data, thunkAPI) => {
    const { token, userId, testId } = data;
    try {
      const response = await patientService.deleteTestResult(
        token,
        userId,
        testId
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunks for managing Chronic Conditions
export const addChronicCondition = createAsyncThunk(
  "patient/addChronicCondition",
  async (data, thunkAPI) => {
    const { token, userId, condition } = data;
    try {
      const response = await patientService.addChronicCondition(
        token,
        userId,
        condition
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeChronicCondition = createAsyncThunk(
  "patient/removeChronicCondition",
  async (data, thunkAPI) => {
    const { token, userId, conditionId } = data;
    try {
      const response = await patientService.removeChronicCondition(
        token,
        userId,
        conditionId
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunks for managing Immunization Records
export const addImmunization = createAsyncThunk(
  "patient/addImmunization",
  async (data, thunkAPI) => {
    const { token, userId, immunizationData } = data;
    try {
      const response = await patientService.addImmunization(
        token,
        userId,
        immunizationData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateImmunization = createAsyncThunk(
  "patient/updateImmunization",
  async (data, thunkAPI) => {
    const { token, userId, immunizationId, immunizationData } = data;
    try {
      const response = await patientService.updateImmunization(
        token,
        userId,
        immunizationId,
        immunizationData
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteImmunization = createAsyncThunk(
  "patient/deleteImmunization",
  async (data, thunkAPI) => {
    const { token, userId, immunizationId } = data;
    try {
      const response = await patientService.deleteImmunization(
        token,
        userId,
        immunizationId
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState: {
    patientList: [],
    currentPatient: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPatientState: (state) => {
      state.patientList = [];
      state.currentPatient = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createPatient
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patientList.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getPatientById
      .addCase(getPatientById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
      })
      .addCase(getPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updatePatient
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
        state.patientList = state.patientList.map((patient) =>
          patient._id === action.payload._id ? action.payload : patient
        );
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deletePatient
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patientList = state.patientList.filter(
          (patient) => patient._id !== action.meta.arg.userId
        );
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Sleep Entries
      .addCase(addSleepEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSleepEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.sleep.push(action.payload);
      })
      .addCase(addSleepEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSleepEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSleepEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currentPatient.sleep.findIndex(
          (sleep) => sleep._id === action.meta.arg.sleepId
        );
        if (index !== -1) {
          state.currentPatient.sleep[index] = action.payload;
        }
      })
      .addCase(updateSleepEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSleepEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSleepEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.sleep = state.currentPatient.sleep.filter(
          (sleep) => sleep._id !== action.meta.arg.sleepId
        );
      })
      .addCase(deleteSleepEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Mood Entries
      .addCase(addMoodEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMoodEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.mood.push(action.payload);
      })
      .addCase(addMoodEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateMoodEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMoodEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currentPatient.mood.findIndex(
          (mood) => mood._id === action.meta.arg.moodId
        );
        if (index !== -1) {
          state.currentPatient.mood[index] = action.payload;
        }
      })
      .addCase(updateMoodEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteMoodEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMoodEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.mood = state.currentPatient.mood.filter(
          (mood) => mood._id !== action.meta.arg.moodId
        );
      })
      .addCase(deleteMoodEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Activity Entries
      .addCase(addActivityEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(addActivityEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.activity.push(action.payload);
      })
      .addCase(addActivityEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateActivityEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateActivityEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currentPatient.activity.findIndex(
          (activity) => activity._id === action.meta.arg.activityId
        );
        if (index !== -1) {
          state.currentPatient.activity[index] = action.payload;
        }
      })
      .addCase(updateActivityEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteActivityEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteActivityEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.activity = state.currentPatient.activity.filter(
          (activity) => activity._id !== action.meta.arg.activityId
        );
      })
      .addCase(deleteActivityEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Test Results
      .addCase(addTestResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTestResult.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.test.push(action.payload);
      })
      .addCase(addTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTestResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTestResult.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currentPatient.test.findIndex(
          (test) => test._id === action.meta.arg.testId
        );
        if (index !== -1) {
          state.currentPatient.test[index] = action.payload;
        }
      })
      .addCase(updateTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteTestResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTestResult.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.test = state.currentPatient.test.filter(
          (test) => test._id !== action.meta.arg.testId
        );
      })
      .addCase(deleteTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Chronic Conditions
      .addCase(addChronicCondition.pending, (state) => {
        state.loading = true;
      })
      .addCase(addChronicCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.chronicConditions.push(action.payload);
      })
      .addCase(addChronicCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeChronicCondition.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeChronicCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.chronicConditions =
          state.currentPatient.chronicConditions.filter(
            (condition) => condition._id !== action.meta.arg.conditionId
          );
      })
      .addCase(removeChronicCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Immunization Records
      .addCase(addImmunization.pending, (state) => {
        state.loading = true;
      })
      .addCase(addImmunization.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.immunizations.push(action.payload);
      })
      .addCase(addImmunization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateImmunization.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateImmunization.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currentPatient.immunizations.findIndex(
          (immunization) => immunization._id === action.meta.arg.immunizationId
        );
        if (index !== -1) {
          state.currentPatient.immunizations[index] = action.payload;
        }
      })
      .addCase(updateImmunization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteImmunization.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteImmunization.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient.immunizations =
          state.currentPatient.immunizations.filter(
            (immunization) =>
              immunization._id !== action.meta.arg.immunizationId
          );
      })
      .addCase(deleteImmunization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPatientState } = patientSlice.actions;
export default patientSlice.reducer;
