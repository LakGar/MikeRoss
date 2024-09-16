import axios from "axios";

const API_URL = "http://localhost:8000/api/users"; // Adjust to your backend URL

// Function to upload a file to the user's account
export const uploadFile = async (userId, formData) => {
  const token = localStorage.getItem("token"); // Ensure this token exists
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  try {
    const response = await axios.post(`${API_URL}/${userId}/files`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Function to add a file to the user's account
export const addFileToUser = async (userId, fileData) => {
  const token = localStorage.getItem("token"); // Ensure this token exists
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  try {
    const response = await axios.post(`${API_URL}/${userId}/files`, fileData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
        "Content-Type": "application/json",
      },
    });
    return response.data; // Returns the updated list of files
  } catch (error) {
    console.error("Error adding file:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to delete a file from the user's account
export const deleteFileFromUser = async (userId, fileId) => {
  const token = localStorage.getItem("token"); // Ensure this token exists
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  try {
    const response = await axios.delete(
      `${API_URL}/${userId}/files/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
      }
    );
    return response.data; // Returns the updated list of files
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to star/un-star a file in the user's account
export const starFileForUser = async (userId, fileId, isStarred) => {
  const token = localStorage.getItem("token"); // Ensure this token exists
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  try {
    const response = await axios.put(
      `${API_URL}/${userId}/files/${fileId}/star`,
      { isStarred }, // Send whether the file should be starred or not
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Returns the updated list of files
  } catch (error) {
    console.error("Error starring/un-starring file:", error);
    throw error.response ? error.response.data : error;
  }
};
const API_URL2 = "http://localhost:8000/api/analyze";

export const analyzeFile = async (formData) => {
  try {
    const response = await axios.post(API_URL2, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing file:", error);
    throw error;
  }
};

// Export the services as default
export default {
  uploadFile,
  addFileToUser,
  deleteFileFromUser,
  starFileForUser,
  analyzeFile,
};
