function Botao({ texto, onClick }) {
  return (
    <button onClick={onClick} className="button-3d">
      {texto}
    </button>
  );
}

export default Botao;
