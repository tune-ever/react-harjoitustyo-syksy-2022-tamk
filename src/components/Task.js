import { useState } from "react";

// This component has basic react form inputs: state helps keep track of input:
const Task = props => {
  const [nameInput, setNameInput] = useState([]);
  const [contextInput, setContextInput] = useState("");

  // props values:
  const id = props.task.id;
  const name = props.task.name;
  const contexts = props.task.contexts;
  const filters = props.filters;
  const timerStarts = props.task.timerStarts;
  const timerEnds = props.task.timerEnds;

  const active = timerStarts.length > timerEnds.length;

  // this function handles the submit
  const handleNameSubmit = event => {
    // Prevents html refresh
    event.preventDefault();
    // Calls the changeName function passed down as props
    // Sends user input as parameter
    props.changeName(id, nameInput);
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

  // apply filtering here: check if any match filters vs. context
  if (
    filters[0] === "all" ||
    contexts.some(context => filters.includes(context))
  )
    return (
      <div style={{ border: "2px solid black" }}>
        {name}
        <br />
        {/* Render the seconds: button sends event to parent */}
        <section style={{ fontSize: "20px", fontStyle: "italic" }}>
          {active ? (
            <div style={{ border: "5px solid green" }}>
              <p>Active - counting time</p>
              <button onClick={() => props.activate(id)}>STOP</button>
            </div>
          ) : (
            <div>
              <button onClick={() => props.activate(id)}>START</button>
            </div>
          )}
        </section>
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
              style={{ marginLeft: 25 }}
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
