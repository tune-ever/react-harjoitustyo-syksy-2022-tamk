import { useState, useEffect } from "react";
import axios from "axios";
import Task from "./Task.js";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3010/tasks").then(res => setTasks(res.data));
  }, []);
  return (
    <div>
      <h2>Tasks</h2>
      <section>
        <h3>Current tasks</h3>
        <ol>
          {tasks.map(task => (
            <li key={task.id}>
              <Task task={task} key={task.id} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Tasks;
