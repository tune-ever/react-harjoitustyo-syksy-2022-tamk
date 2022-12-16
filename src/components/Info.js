const Info = () => {
  return (
    <div>
      <h2>Info page</h2>
      <article>Creator: Andreas Achte</article>
      <br />
      <article>
        <b>Tasks</b> page: you can view a list of current tasks. You can add new
        tasks, rename current tasks and edit the contexts of the tasks.
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
          Order tasks: drag and drop with mouse.(click and hold mouse button.)
        </li>
        <li>
          Activate time counting: press start. Times are recorded to database.
        </li>
        <li>
          Filtering tasks: Press filter buttons: show all clears everything.
        </li>
      </ul>
      <article>
        <b>Time</b> page: show time active for tasks. You can select different
        periods.
      </article>
      <ul>
        <li>
          Start time: set starting time for the time period you want to see.
        </li>
        <li>End time: set end time for the time period you want to see.</li>
        <li>Total time is displayed for each task individually.</li>
      </ul>
      <footer>No copyright material have been used on this site.</footer>
    </div>
  );
};

export default Info;
