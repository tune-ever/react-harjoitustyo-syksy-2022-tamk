import { useState } from "react";

// This component has basic react form: value is state!
const Task = props => {
  const [nameInput, setNameInput] = useState([]);
  const [contextInput, setContextInput] = useState("");

  // props values:
  const id = props.task.id;
  const name = props.task.name;
  const contexts = props.task.contexts;
  const status = props.task.status;

  // this function handles the submit
  const handleNameSubmit = event => {
    // Prevents html refresh
    event.preventDefault();
    // Calls the changeName function passed down as props
    // Sends user input as parameter
    props.changeName(id, nameInput, status);
    // set textbox to empty
    setNameInput("");
  };

  // Function to handle the new context: calls parent elements
  // function addContext
  const handleContextSubmit = event => {
    event.preventDefault();
    props.addContext(props.task.id, contextInput);
    setContextInput("");
  };

  const borderStyle =
    props.task.status === "done"
      ? { border: "2px solid green" }
      : { border: "2px solid blue" };

  return (
    <div style={borderStyle}>
      {name}
      {/* This is a basic react form for updating task name:uses state etc. */}
      <form type="submit" onSubmit={handleNameSubmit}>
        <input
          placeholder="update task name"
          type="text"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />
        <input type="submit" />
      </form>
      <section>
        <p>Contexts:</p>
        {/* List the contexts: include a remove button for each */}
        <ul>
          {contexts.map(context => (
            <li key={context}>
              {context}
              {/* onClick remove, call parent elem. function removecontext */}
              <button onClick={() => props.removeContext(id, context)}>
                remove
              </button>
            </li>
          ))}
        </ul>
        {/* Basic react form to add a new context: */}
        <form type="submit" onSubmit={handleContextSubmit}>
          <input
            name="textContextInput"
            placeholder="Add a new context"
            type="text"
            value={contextInput}
            onChange={e => setContextInput(e.target.value)}
          />
          {/* Simple html select form: current contexts as options. */}
          <select
            name="selectContextInput"
            value={contextInput}
            onChange={e => setContextInput(e.target.value)}
          >
            {props.contextArray.map(context => (
              <option key={context} value={context}>
                {context}
              </option>
            ))}
          </select>
          <input type="submit" value="Submit" />
        </form>
      </section>
      {/* A button to remove this task */}
      <button onClick={() => props.removeTask(id)}>Remove task</button>
    </div>
  );
};

export default Task;
