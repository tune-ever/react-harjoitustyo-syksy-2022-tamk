const Info = () => {
  return (
    <div>
      <h2>Info page</h2>
      <article>Creator: Andreas Achte</article>
      <br />
      <article>
        Tasks page: you can view a list of current tasks. You can add new tasks,
        rename current tasks and edit the contexts of the tasks.
      </article>
      <ul>
        <li>
          Rename a task: type to textbox under task name and press submit button
        </li>
        <li>Remove a context: press remove button next to context</li>
        <li>
          Add a new context: type to textbox under contexts and press submit
          button
        </li>
        <li>Remove a task: press "Remove task" button (bottom of a task.)</li>
        <li>
          Add a new task: scroll to the bottom of the page: type task name and
          contexts, then press submit button
        </li>
        <li>
          Filtering tasks: press filter buttons. Show all button clears filters.
        </li>
        <li>
          Moving items from undone to done: drag and drop with mouse. Move to
          other list.
        </li>
      </ul>
      <footer>No copyright material have been used on this site.</footer>
    </div>
  );
};

export default Info;
