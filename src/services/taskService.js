import axios from "axios";

const url = "http://localhost:3010/tasks";

const getAll = async () => {
  const response = await axios.get(url);
  return response;
};

const taskService = {
  getAll
};

export default taskService;
