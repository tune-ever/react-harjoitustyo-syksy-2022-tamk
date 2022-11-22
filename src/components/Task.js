const Task = props => {
  const name = props.task.name;
  const contexts = props.task.contexts;
  return (
    <div>
      {name}
      <section>
        <p>Contexts:</p>
        <ul>{contexts.map(context => <li key={context}>{context}</li>)}</ul>
      </section>
    </div>
  );
};

export default Task;
