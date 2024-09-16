import axios from "axios";

const API_URL = "http://localhost:8000/api/users"; // Adjust to your backend URL

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
};

// Get user profile
const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update user profile
const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    "http://localhost:8000/api/users/update",
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default {
  login,
  register,
  logout,
  getUserProfile,
  updateUserProfile, // Add this function
};
