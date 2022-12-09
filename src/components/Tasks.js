import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Task from "./Task.js";
import taskService from "../services/taskService";
import AddTask from "./AddTask";
import FilterElement from "./FilterElement";

const Tasks = () => {
  // One state to store all the tasks in an array:
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(["all"]);
  const lists = ["undone", "done"];

  // First page load -> get tasks from db.json
  useEffect(() => {
    taskService.getAll().then(res => setTasks(res.data));
  }, []);

  // Clears active filters: default to: "all"
  const clearFilters = () => {
    setFilters(["all"]);
  };

  // Contexts array from tasks:
  const contextArray = [];
  // Find all necessary context buttons to render: (don't include duplicates.)
  // We simply extract contexts from the tasks array.
  tasks.forEach(task => {
    task.contexts.forEach(context => {
      if (!contextArray.includes(context)) contextArray.push(context);
    });
  });

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
  const changeName = (id, newName, status) => {
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
          status: status,
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
      status: "undone",
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

  const onDragEnd = (res, taskId) => {
    // Get destination and source objects from responder -object:
    const { source, destination } = res;

    if (source.droppableId !== destination.droppableId) {
      // Info to send to server
      const status = destination.droppableId;
      const id = Number(res.draggableId);
      // Send the update to database: patch request -> only update status:
      taskService.changeStatusById(id, status);
      // Also need to update state so react updates ui instantly:
      let newTaskList = [];
      newTaskList = tasks.map(task => {
        if (task.id === id) {
          task.status = status;
        }
        return task;
      });

      setTasks(newTaskList);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <section>
        <h3>Current tasks</h3>
        <FilterElement
          contextArray={contextArray}
          clearFilters={clearFilters}
          handleFilterClick={handleFilterClick}
          filters={filters}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          {/* We want two droppable lists: Undone and done. */}
          {lists.map(listName => (
            <div key={listName}>
              <h3>{listName}</h3>
              <Droppable droppableId={listName} key={listName}>
                {provided => {
                  return (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {/* 
            Filter the tasks -> for each task iterate filters ->
            if filters matches any context of a task: it passes on to
            .map() and is rendered.
            If filter array is empty, all tasks pass the filter
           */}
                      {tasks.map(
                        (task, index) =>
                          /* Apply filters here to whole task list: */
                          (filters[0] === "all" ||
                            filters.some(filter =>
                              task.contexts.includes(filter)
                            )) &&
                          /* Check if task is done or not? conditional rendering */
                          task.status === listName && (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {provided => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {/* Props: function removeTask, function addContext, function changeName, task object, key*/}
                                    <Task
                                      contextArray={contextArray}
                                      tasks={tasks}
                                      removeTask={removeTask}
                                      removeContext={removeContext}
                                      addContext={addContext}
                                      changeName={changeName}
                                      task={task}
                                      key={task.id}
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          )
                      )}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </section>
      <AddTask tasks={tasks} addTask={addTask} />
    </div>
  );
};

export default Tasks;
