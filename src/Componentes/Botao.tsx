function Botao({ texto, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {texto}
    </button>
  );
}

export default Botao;
