import { useState, useEffect } from "react";
import Task from "./Task.js";
import taskService from "../services/taskService";
import AddTask from "./AddTask";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

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
      // Find the one task we want to update:
      if (task.id === id) {
        // Filter out the context user wanted to remove:
        const newContexts = task.contexts.filter(
          context => context !== contextToRemove
        );
        // Update the contexts:
        task.contexts = newContexts;
      }
      // Push task to duplicate:
      newTasksArray.push(task);
    });
    setTasks(newTasksArray);
  };

  // Function to add a new task
  const addTask = (name, contexts) => {
    const newTasksArray = tasks;
    const newTask = {
      name: name,
      contexts: contexts
    };
    newTasksArray.push(newTask);
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
      <AddTask addtask={addTask} />
    </div>
  );
};

export default Tasks;
