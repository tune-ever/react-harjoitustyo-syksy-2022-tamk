const FilterElement = props => {
  const filters = props.filters;

  // Contexts array from tasks prop:
  const contextArray = [];
  // For loops with duplicate chek:
  props.tasks.forEach(task => {
    task.contexts.forEach(context => {
      if (!contextArray.includes(context)) contextArray.push(context);
    });
  });

  return (
    <section>
      <button onClick={() => props.clearFilters()}>Show all</button>
      {contextArray.map(context => (
        <button onClick={() => props.handleFilterClick(context)} key={context}>
          {context}
        </button>
      ))}
    </section>
  );
};

export default FilterElement;
