import axios from "axios";

const API_URL = "http://10.0.0.159:8000/api/patients"; // Replace with your actual API URL

const patientService = {
  createPatient: async (patientData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/patient`,
      patientData,
      config
    );
    return response.data;
  },

  getPatientById: async (userId, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/patient/${userId}`, config);
    return response.data;
  },

  updatePatient: async (userId, token, updattedData) => {
    console.log(`updatePatient: ${token}`, updattedData, userId);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.put(
      `${API_URL}/patient/${userId}`,
      updattedData,
      config
    );
    return response.data;
  },

  deletePatient: async (userId, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${API_URL}/patient/${userId}`, config);
    return response.data;
  },

  addSleepEntry: async (userId, sleepData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/patient/${userId}/sleep`,
      sleepData,
      config
    );
    return response.data;
  },

  addMoodEntry: async (userId, moodData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/patient/${userId}/mood`,
      moodData,
      config
    );
    return response.data;
  },

  addActivityEntry: async (userId, activityData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/patient/${userId}/activity`,
      activityData,
      config
    );
    return response.data;
  },
};

export default patientService;
