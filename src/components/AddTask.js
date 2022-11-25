import { useState } from "react";

const AddTask = props => {
  const [nameInput, setNameInput] = useState([]);

  const handleTaskSubmit = () => {};

  return (
    <form type="submit" onSubmit={handleTaskSubmit}>
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
        value={nameInput}
        onChange={e => setNameInput(e.target.value)}
      />
      <br />
      <input
        placeholder="Context name"
        type="text"
        value={nameInput}
        onChange={e => setNameInput(e.target.value)}
      />
      <br />
      <input type="submit" />
    </form>
  );
};

export default AddTask;
