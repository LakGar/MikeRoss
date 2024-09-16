import axios from "axios";

const API_URL = "http://localhost:8000/api/users"; // Adjust this to your backend URL

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  console.log(`User ${userData}`);
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Get current user profile
const getMyProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/me`, config);
  return response.data;
};

// Get a user profile
const getUserProfile = async (token, userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${userId}`, config);
  return response.data;
};

// Update user profile
const updateUserProfile = async (token, userId, userData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/update`, userData, config);
  return response.data;
};

// Logout user
const logout = () => {
  // Implement logout functionality if needed
};

// Export all the functions as a single object
export const userService = {
  register,
  login,
  getMyProfile,
  getUserProfile,
  updateUserProfile,
  logout,
};

// Also export it as the default export
export default userService;
