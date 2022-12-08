const FilterElement = props => {
  const filters = props.filters;

  // Render the buttons: also include a show all button: clears all filters:
  return (
    <section>
      <button onClick={() => props.clearFilters()}>Show all</button>
      {/* Iterate contexts: */}
      {props.contextArray.map(context =>
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
