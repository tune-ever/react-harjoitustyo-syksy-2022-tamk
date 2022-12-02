import { useState, useEffect } from "react";
import Task from "./Task.js";
import taskService from "../services/taskService";
import AddTask from "./AddTask";
import FilterElement from "./FilterElement";

const Tasks = () => {
  // One state to store all the tasks in an array:
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(["all"]);

  // First page load -> get tasks from db.json
  useEffect(() => {
    taskService.getAll().then(res => setTasks(res.data));
  }, []);

  // Clears active filters: default to: "all"
  const clearFilters = () => {
    setFilters(["all"]);
  };

  // Function that fires when user clicks filter button:
  const handleFilterClick = context => {
    // If all was activated, remove it:
    if (filters[0] === "all") {
      setFilters([context]);
    } else {
      // if filter is already active we remove it:
      if (filters.includes(context)) {
        let newFilters = [];
        // Filter out duplicate:
        newFilters = filters.filter(filter => filter !== context);
        // If filters are now empty, set filter to default: "all":
        if (newFilters.length === 0) newFilters.push("all");
        setFilters(newFilters);
      } else {
        // Push the new context to the filter state:
        setFilters([...filters, context]);
      }
    }
  };

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
          contexts: task.contexts,
        };
        // Here we send the new task to database
        taskService.updateById(id, newTask);
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
          // Here happens the new context update:
          task.contexts.push(newContext);
          // Here we send the new task to database to keep it up to date
          taskService.updateById(id, task);
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
        // Here we send the new task to database
        taskService.updateById(id, task);
      }
      // Push task to duplicate:
      newTasksArray.push(task);
    });
    setTasks(newTasksArray);
  };

  // Function to add a new task
  const addTask = (name, contexts) => {
    const newTask = {
      name: name,
      contexts: contexts,
    };
    // Post new task to database
    // Chain of calls:
    // First post
    // then
    // Update state (to keep ids in sync)
    taskService.addTask(newTask).then(() => {
      taskService.getAll().then(res => setTasks(res.data));
    });
  };

  // Function to remove a task from the list.
  const removeTask = id => {
    let newTaskList = [];
    // filter out the match:
    newTaskList = tasks.filter(task => task.id !== id);

    // Delete from database:
    taskService.deleteTask(id);
    setTasks(newTaskList);
  };

  return (
    <div>
      <h2>Tasks</h2>
      <section>
        <h3>Current tasks</h3>
        <FilterElement
          clearFilters={clearFilters}
          handleFilterClick={handleFilterClick}
          filters={filters}
          tasks={tasks}
        />
        <ol>
          {/* 
            Filter the tasks -> for each task iterate filters ->
            if filters matches any context of a task: it passes on to
            .map() and is rendered.
            If filter array is empty, all tasks pass the filter
           */}
          {tasks.map(
            task =>
              (filters[0] === "all" ||
                filters.some(filter => task.contexts.includes(filter))) && (
                <li key={task.id}>
                  {/* Props: function removeTask, function addContext, function changeName, task object, key*/}
                  <Task
                    tasks={tasks}
                    removeTask={removeTask}
                    removeContext={removeContext}
                    addContext={addContext}
                    changeName={changeName}
                    task={task}
                    key={task.id}
                  />
                </li>
              )
          )}
        </ol>
      </section>
      <AddTask tasks={tasks} addTask={addTask} />
    </div>
  );
};

export default Tasks;
