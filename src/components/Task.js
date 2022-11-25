import { useState } from "react";

// This component has basic react form: value is state!
const Task = props => {
  const [nameInput, setNameInput] = useState([]);

  const name = props.task.name;
  const contexts = props.task.contexts;

  // this function handles the submit
  const handleSubmit = event => {
    // Prevents html refresh
    event.preventDefault();
    // Calls the changeName function passed down as props
    props.changeName(props.task.id, nameInput);
    // set textbox to empty
    setNameInput("");
  };

  return (
    <div>
      {name}
      {/* This is a basic react form for updating task name:uses state etc. */}
      <form type="submit" onSubmit={handleSubmit}>
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
        <ul>{contexts.map(context => <li key={context}>{context}</li>)}</ul>
      </section>
    </div>
  );
};

export default Task;
