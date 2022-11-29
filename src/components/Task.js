import { useState } from "react";

// This component has basic react form: value is state!
const Task = props => {
  const [nameInput, setNameInput] = useState([]);
  const [contextInput, setContextInput] = useState([]);

  // props values:
  const id = props.task.id;
  const name = props.task.name;
  const contexts = props.task.contexts;

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

  // Function to handle user's click:
  const handleClick = context => {
    props.removeContext(id, context);
  };

  return (
    <div style={{ border: "2px solid black" }}>
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
              {/* onClick -> event -> callback fires when user clicks */}
              <button onClick={() => handleClick(context)}>remove</button>
            </li>
          ))}
        </ul>
        {/* Basic react form to add a new context: */}
        <form type="submit" onSubmit={handleContextSubmit}>
          <input
            style={{ marginLeft: 25 }}
            placeholder="Add a new context"
            type="text"
            value={contextInput}
            onChange={e => setContextInput(e.target.value)}
          />
          <input type="submit" />
        </form>
      </section>
      {/* A button to remove this task */}
      <button onClick={() => props.removeTask(id)}>Remove task</button>
    </div>
  );
};

export default Task;
