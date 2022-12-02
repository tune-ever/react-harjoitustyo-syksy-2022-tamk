const FilterElement = props => {
  const filters = props.filters;

  // Contexts array from tasks prop:
  const contextArray = [];
  // Find all necessary context buttons to render: (don't include duplicates.)
  // We simply extract contexts from the tasks array.
  props.tasks.forEach(task => {
    task.contexts.forEach(context => {
      if (!contextArray.includes(context)) contextArray.push(context);
    });
  });

  // Render the buttons: also include a show all button: clears all filters:
  return (
    <section>
      <button onClick={() => props.clearFilters()}>Show all</button>
      {contextArray.map(context =>
        // if filter is active now, change style to green:
        filters.includes(context) ? (
          <button
            style={{ backgroundColor: "lightGreen" }}
            onClick={() => props.handleFilterClick(context)}
            key={context}
          >
            {context}
          </button>
        ) : (
          <button
            onClick={() => props.handleFilterClick(context)}
            key={context}
          >
            {context}
          </button>
        )
      )}
    </section>
  );
};

export default FilterElement;
