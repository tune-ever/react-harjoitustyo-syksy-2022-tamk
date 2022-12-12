import axios from "axios";

// This file includes simple helper functions to get orders from database:

const url = "http://localhost:3010/lists";

// Get
const getAll = async () => {
  const response = await axios.get(url);
  return response;
};

// Patch: send the new order to database: gets tasks array as props:
const updateOrder = async (id, tasks) => {
  const patchObject = {
    tasks: tasks,
  };
  const response = await axios.patch(`${url}/${id}`, patchObject);
  return response;
};

const taskService = {
  getAll,
  updateOrder,
};

export default taskService;
