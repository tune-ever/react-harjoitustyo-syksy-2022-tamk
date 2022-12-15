import axios from "axios";

// This file includes simple helper functions to update database

const url = "http://localhost:3010/tasks";

// Get:
const getAll = async () => {
  const response = await axios.get(url);
  return response;
};

// Put: update single task
const updateById = async (id, task) => {
  // Simple put request to db: body is new task
  await axios.put(`${url}/${id}`, task);
};

// Post:
const addTask = async task => {
  axios.post(url, task);
};

// Delete:
const deleteTask = async id => {
  axios.delete(`${url}/${id}`);
};

const taskService = {
  getAll,
  updateById,
  deleteTask,
  addTask,
};

export default taskService;
