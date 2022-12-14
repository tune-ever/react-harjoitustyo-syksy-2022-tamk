import { useState } from "react";

// This component is a simple form to add a new task
const AddTask = props => {
  const [nameInput, setNameInput] = useState([]);
  const [contextInput, setContextInput] = useState("");
  const [contextInputTwo, setContextInputTwo] = useState("");
  const [contextInputThree, setContextInputThree] = useState("");

  // Contexts array from tasks prop:
  const contextArray = [];
  // Find all individual contexts from the tasks array:
  props.tasks.forEach(task => {
    task.contexts.forEach(context => {
      if (!contextArray.includes(context)) contextArray.push(context);
    });
  });

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
      <h4>Uusi tehtävä</h4>
      <input
        placeholder="Nimi"
        type="text"
        value={nameInput}
        onChange={e => setNameInput(e.target.value)}
      />
      <br />
      <input
        placeholder="Konteksti"
        type="text"
        value={contextInput}
        onChange={e => setContextInput(e.target.value)}
      />
      <select
        name="selectContextInput"
        value={contextInput}
        onChange={e => setContextInput(e.target.value)}
      >
        {contextArray.map(context => (
          <option key={context} value={context}>
            {context}
          </option>
        ))}
      </select>
      <br />
      <input
        placeholder="Konteksti"
        type="text"
        value={contextInputTwo}
        onChange={e => setContextInputTwo(e.target.value)}
      />
      <select
        name="selectContextInput"
        value={contextInputTwo}
        onChange={e => setContextInputTwo(e.target.value)}
      >
        {contextArray.map(context => (
          <option key={context} value={context}>
            {context}
          </option>
        ))}
      </select>
      <br />
      <input
        placeholder="Konteksti"
        type="text"
        value={contextInputThree}
        onChange={e => setContextInputThree(e.target.value)}
      />
      <select
        name="selectContextInput"
        value={contextInputThree}
        onChange={e => setContextInputThree(e.target.value)}
      >
        {contextArray.map(context => (
          <option key={context} value={context}>
            {context}
          </option>
        ))}
      </select>
      <br />
      <input type="submit" value="Lisää" />
    </form>
  );
};

export default AddTask;
