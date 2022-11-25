import { useState, useEffect } from "react";
import Task from "./Task.js";
import taskService from "../services/taskService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  console.log(tasks);

  // First page load -> get tasks from db.json
  useEffect(() => {
    taskService.getAll().then(res => setTasks(res.data));
  }, []);

  // Function to change the name of a task
  const changeName = (id, newName) => {
    const newTasksArray = [];

    // Iterate the array -> replace the match with new name
    tasks.map(task => {
      // Found matching id?
      if (task.id === id) {
        // Push updated task
        const newTask = {
          id: id,
          name: newName,
          contexts: task.contexts
        };
        newTasksArray.push(newTask);
      } else {
        newTasksArray.push(task);
      }
    });
    setTasks(newTasksArray);
  };

  // Function to add a context
  const addContext = (id, newContext) => {
    const newTasksArray = [];
    // Iterate tasks, find match, add the new context
    tasks.map(task => {
      if (task.id === id) {
        task.contexts.push(newContext);
      }
      newTasksArray.push(task);
    });
    setTasks(newTasksArray);
  };

  return (
    <div>
      <h2>Tasks</h2>
      <section>
        <h3>Current tasks</h3>
        <ol>
          {tasks.map(task => (
            <li key={task.id}>
              {/* Props: function addContext, function changeName, task object, key*/}
              <Task
                addContext={addContext}
                changeName={changeName}
                task={task}
                key={task.id}
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Tasks;
