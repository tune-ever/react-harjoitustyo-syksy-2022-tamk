const Info = () => {
  return (
    <div>
      <h2>Info sivu</h2>
      <article>Tekijä: Andreas Achte</article>
      <br />
      <h4>Tehtävät</h4>
      <ul>
        <li>Sivu toimii tehtävä listana.</li>
        <li>
          Tehtäviä voi lisätä ja poistaa. (ylhäällä tehtävän lisäys, poisto
          tehtävä elementin alaosan nappia painamalla.)
        </li>
        <li>Kullakin tehtävällä voi olla monia eri konteksteja.</li>
        <li>
          Konteksteja voi lisäillä ja poistella napeista: kts. poista-nappi sekä
          "lisää konteksti" -syöte.
        </li>
        <li>Suodattaminen:</li>
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
