import { useState } from "react";

// This component is a simple form to add a new task
const AddTask = props => {
  const [nameInput, setNameInput] = useState([]);
  const [contextInput, setContextInput] = useState([]);
  const [contextInputTwo, setContextInputTwo] = useState([]);
  const [contextInputThree, setContextInputThree] = useState([]);

  const handleTaskSubmit = event => {
    // This prevents default refresh
    event.preventDefault();
    const contexts = [];
    // Push all the contexts if they exist:
    if (contextInput.length > 0) contexts.push(contextInput);
    if (contextInputTwo.length > 0) contexts.push(contextInputTwo);
    if (contextInputThree.length > 0) contexts.push(contextInputThree);
    // Name is required: a check
    if (nameInput) {
      // Call parent element's function addTask()
      props.addTask(nameInput, contexts);
    }

    // Set the inputs to empty after submit.
    setNameInput("");
    setContextInput("");
    setContextInputTwo("");
    setContextInputThree("");
  };

  return (
    <form type="submit" onSubmit={handleTaskSubmit}>
      <h4>Add a new task</h4>
      <input
        placeholder="Task name"
        type="text"
        value={nameInput}
        onChange={e => setNameInput(e.target.value)}
      />
      <br />
      <input
        placeholder="Context name"
        type="text"
        value={contextInput}
        onChange={e => setContextInput(e.target.value)}
      />
      <br />
      <input
        placeholder="Context name"
        type="text"
        value={contextInputTwo}
        onChange={e => setContextInputTwo(e.target.value)}
      />
      <br />
      <input
        placeholder="Context name"
        type="text"
        value={contextInputThree}
        onChange={e => setContextInputThree(e.target.value)}
      />
      <br />
      <input type="submit" />
    </form>
  );
};

export default AddTask;
