import axios from "axios";

const API_URL = "http://10.0.0.159:8000/api/tasks"; // Adjust this to match your API's base URL

// Create a new task
const createTask = async (token, taskData) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(`${API_URL}/task`, taskData, config);
    return response.data;
  } catch (error) {
    console.error("Error in createTask Axios request:", error);
    throw error; // Rethrow the error so it's caught by the thunk
  }
};
// Get all tasks
const getAllTasks = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get a task by ID
const getTaskById = async (token, taskId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/task/${taskId}`, config);
  return response.data;
};

// Update a task by ID
const updateTask = async (token, taskId, taskData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/task/${taskId}`,
    taskData,
    config
  );
  return response.data;
};

// Delete a task by ID
const deleteTask = async (token, taskId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/task/${taskId}`, config);
  return response.data;
};

// Get tasks for a specific date
const getTasksByDate = async (token, date) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/date/${date}`, config);
  return response.data;
};

// Export all the functions as a single object
export const taskService = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByDate,
};

// Also export it as the default export
export default taskService;
