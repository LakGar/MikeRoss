import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import taskReducer from "./taskSlice";
import patientReducer from "./patientSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    patient: patientReducer,
  },
});
