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
    tasks.forEach(task => {
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
    tasks.forEach(task => {
      if (task.id === id) {
        // Error handling: user can't add a duplicate context
        if (!task.contexts.includes(newContext)) {
          task.contexts.push(newContext);
        } else {
          alert("Duplicate value detected.");
        }
      }
      newTasksArray.push(task);
    });
    setTasks(newTasksArray);
  };

  // Function to remove a context:
  const removeContext = (id, contextToRemove) => {
    const newTasksArray = [];

    // Iterate current tasks, find match, remove the context
    tasks.forEach(task => {
      if (task.id === id) {
        // Map the contexts -> don't include the context user wants to remove.
        task.contexts.map(context => !context === contextToRemove);
      }
      newTasksArray.push(tasks);
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
                removeContext={removeContext}
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
