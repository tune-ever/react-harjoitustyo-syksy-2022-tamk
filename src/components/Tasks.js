import { useState, useEffect } from "react";
import Task from "./Task.js";
import taskService from "../services/taskService";
import AddTask from "./AddTask";
import FilterElement from "./FilterElement";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Tasks = () => {
  // One state to store all the tasks in an array:
  // this is the main source of truth for the app.
  // tasks state is kept in sync with backend with different backend calls:
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
          timerStarts: task.timerStarts,
          timerEnds: task.timerEnds,
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

  // Function to add time: same logic as adding context:
  const sendStartTime = (id, time) => {
    const newTasksArray = [];
    // Iterate tasks, find match, add the new time
    tasks.forEach(task => {
      if (task.id === id) {
        task.timerStarts.push(time);
        // Update this specific task in db: sends new timer event
        taskService.updateById(id, task);
      }
      newTasksArray.push(task);
    });
    setTasks(newTasksArray);
  };

  // Function to add time: same logic as adding context:
  const sendEndTime = (id, time) => {
    const newTasksArray = [];
    // Iterate tasks, find match, add the new time
    tasks.forEach(task => {
      if (task.id === id) {
        task.timerEnds.push(time);
        // Update this specific task in array: sends new timer event
        taskService.updateById(id, task);
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
      timerStarts: [],
      timerEnds: [],
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

  // This function sets activity status and sends times:
  const activate = id => {
    // is task active now?
    const thisTask = tasks.find(task => task.id === id);
    const isActive = thisTask.timerStarts.length > thisTask.timerEnds.length;

    // Get time now in json format:

    const timeNow = new Date().toJSON();
    isActive ? sendEndTime(id, timeNow) : sendStartTime(id, timeNow);
  };

  const onDragEnd = result => {
    // new arrangement of items updating to state:
    const newOrder = tasks;
    // remove item from source index: splice returns an array:
    const itemToMove = newOrder.splice(result.source.index, 1);
    // Insert same item to dest. index: array destructures to an object...
    newOrder.splice(result.destination.index, 0, ...itemToMove);

    // Update this new order to state:
    setTasks(newOrder);
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
          <div>
            <Droppable droppableId="1" key="1">
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* Props: function removeTask, function addContext, function changeName, task object, key*/}
                          <Task
                            activate={activate}
                            sendStartTime={sendStartTime}
                            sendEndTime={sendEndTime}
                            filters={filters}
                            contextArray={contextArray}
                            removeTask={removeTask}
                            removeContext={removeContext}
                            addContext={addContext}
                            changeName={changeName}
                            task={task}
                            key={task.id}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </section>
      <AddTask tasks={tasks} addTask={addTask} />
    </div>
  );
};

export default Tasks;
