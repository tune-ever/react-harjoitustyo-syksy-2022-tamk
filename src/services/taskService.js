import axios from "axios";

const url = "http://localhost:3010/tasks";

const getAll = async () => {
  const response = await axios.get(url);
  return response;
};

// Update the name of a task
const updateById = async (id, task) => {
  // Simple put request to db: body is new task
  axios.put(`${url}/${id}`, task);
};

const addTask = async task => {
  const response = await axios.post(url, task);
  return response;
};

const deleteTask = async id => {
  axios.delete(`${url}/${id}`);
};

const taskService = {
  getAll,
  updateById,
  deleteTask,
  addTask
};

export default taskService;
