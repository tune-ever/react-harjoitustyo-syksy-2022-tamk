const FilterElement = props => {
  const filters = props.filters;

  // Render the buttons: also include a show all button: clears all filters:
  return (
    <section>
      <h4>Suodattimet</h4>
      {/* if all active, show all is green */}
      {filters.includes("all") ? (
        <button
          style={{ backgroundColor: "lightGreen" }}
          onClick={() => props.clearFilters()}
        >
          Näytä kaikki
        </button>
      ) : (
        <button onClick={() => props.clearFilters()}>Näytä kaikki</button>
      )}
      {/* Iterate contexts: */}
      {props.contextArray.map(context =>
        // if filter is active now, change style to green: conditional rendering.
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
