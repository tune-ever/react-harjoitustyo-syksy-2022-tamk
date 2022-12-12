import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Task from "./Task.js";
import taskService from "../services/taskService";
import listService from "../services/listService";
import AddTask from "./AddTask";
import FilterElement from "./FilterElement";

const Tasks = () => {
  // One state to store all the tasks in an array:
  const [tasks, setTasks] = useState([]);
  // This state stores the task ids: they reference each task from tasks array.
  // This lists state's purpose is to store the order of the elements:
  const [lists, setLists] = useState([]);
  // Filter state: array: default value: "all"
  const [filters, setFilters] = useState(["all"]);

  // Page load -> get tasks from db.json
  useEffect(() => {
    taskService.getAll().then(res => setTasks(res.data));
  }, []);

  // Page load -> get list orders from db.json:
  useEffect(() => {
    listService.getAll().then(res => setLists(res.data));
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
  const addTask = async (name, contexts) => {
    const newTask = {
      name: name,
      contexts: contexts,
    };
    // Post new task to database
    // Chain of calls:
    // First post
    // then
    // Update state (to keep ids in sync)
    let response = await taskService.addTask(newTask);
    // Update the new id to keep lists in sync:
    let newId = response.data.id;
    let updatedTaskList = lists[0].tasks;
    updatedTaskList.push(newId);
    // Again create new lists array and update to state with new id added:
    let newListsArray = lists;
    newListsArray[0].tasks = updatedTaskList;
    setLists(newListsArray);

    // Update new new list to db too:
    listService.updateOrder(1, updatedTaskList);
    taskService.getAll().then(res => setTasks(res.data));
  };

  // Function to remove a task from the list.
  const removeTask = async (id, listId) => {
    // Updating lists:
    const listToUpdate = lists.find(list => list.id === listId);

    // Remove the task from tasks array:
    const updatedTaskList = listToUpdate.tasks.filter(taskId => taskId !== id);
    listToUpdate.tasks = updatedTaskList;

    // Replacing state array of lists:
    const newListsArray = [];
    // Iterate lists, replace source and destination with updated stuff:
    lists.map(list => {
      if (list.id === listId) newListsArray.push(listToUpdate);
      else newListsArray.push(list);
    });
    // Update to state:
    setLists(newListsArray);
    // Updating tasks array:
    let newTaskList = [];
    // filter out the match:
    newTaskList = tasks.filter(task => task.id !== id);
    // Delete from database:
    setTasks(newTaskList);

    // send the updated tasks list to database:
    taskService.deleteTask(id);

    // To database we send only the updated tasks array:
    const response = await listService.updateOrder(listId, updatedTaskList);
  };

  // Drag and drop on drag end:
  const onDragEnd = async res => {
    const source = res.source;
    const destination = res.destination;
    // Find source and destination task list of ids from state:
    const sourceList = lists.find(list => list.name === source.droppableId);
    const destinationList = lists.find(
      list => list.name === destination.droppableId
    );
    // same source:
    if (source.droppableId === destination.droppableId) {
      //First remove element from source:
      const elementToRemove = sourceList.tasks.splice(source.index, 1);
      // Add element to destination index:
      sourceList.tasks.splice(destination.index, 0, elementToRemove[0]);
      // Update to state:
      // Replace the one list we want to replace:
      const newListsArray = [];
      // Replace the one we want to update:
      lists.map(list => {
        list.name === source.droppableId
          ? newListsArray.push(sourceList)
          : newListsArray.push(list);
      });
      // Update state and send new order to database:
      setLists(newListsArray);
      // At end send source list to database:
      listService.updateOrder(sourceList.id, sourceList.tasks);
    }
    // Different list?
    else {
      // Remove from the source list:
      const elementToRemove = sourceList.tasks.splice(source.index, 1);
      // Add to destination list:
      destinationList.tasks.splice(destination.index, 0, elementToRemove[0]);
      // Replacing state array of lists:
      const newListsArray = [];
      // Iterate lists, replace source and destination with updated stuff:
      lists.map(list => {
        if (list.name === source.droppableId) newListsArray.push(sourceList);
        else if (list.name === destination.droppableId)
          newListsArray.push(destinationList);
        else newListsArray.push(list);
      });
      // Update to state:
      setLists(newListsArray);
      // At end send source and destination lists to database async api calls:
      const response = await listService.updateOrder(
        sourceList.id,
        sourceList.tasks
      );
      // Async api call:
      const responseTwo = await listService.updateOrder(
        destinationList.id,
        destinationList.tasks
      );
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
          {lists.map(list => (
            <div key={list.id}>
              <h3>{list.name}</h3>
              <Droppable droppableId={list.name} key={list.id}>
                {provided => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {list.tasks.map((taskId, index) => (
                      <Draggable
                        key={taskId}
                        draggableId={taskId.toString()}
                        index={index}
                      >
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {/* Render task element: find with current id from tasks
                             */}
                            <Task
                              filters={filters}
                              listId={list.id}
                              task={tasks.find(task => task.id === taskId)}
                              contextArray={contextArray}
                              changeName={changeName}
                              removeContext={removeContext}
                              addContext={addContext}
                              removeTask={removeTask}
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
          ))}
        </DragDropContext>
      </section>
      <AddTask tasks={tasks} addTask={addTask} />
    </div>
  );
};

export default Tasks;
