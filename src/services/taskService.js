import axios from "axios";

// This file includes simple helper functions to update database

const url = "http://localhost:3010/tasks";

// Get:
const getAll = async () => {
  const response = await axios.get(url);
  return response;
};

// Put:
const updateById = async (id, task) => {
  // Simple put request to db: body is new task
  axios.put(`${url}/${id}`, task);
};

// Post:
const addTask = async task => {
  const response = await axios.post(url, task);
  return response;
};

// Delete:
const deleteTask = async id => {
  axios.delete(`${url}/${id}`);
};

// Patch:
const changeStatusById = async (id, status) => {
  const patchObject = {
    status: status,
  };
  axios.patch(`${url}/${id}`, patchObject);
};

const taskService = {
  getAll,
  updateById,
  deleteTask,
  addTask,
  changeStatusById,
};

export default taskService;
