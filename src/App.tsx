// Importa o estilo CSS para o componente.
import "./App.css";

// Importa hooks do React para usar no componente.
import { useEffect, useState } from "react";

function App() {
  // Estado para armazenar a piada atual.
  const [joke, setJoke] = useState("");

  // Estado para armazenar as piadas favoritas.
  const [favorites, setFavorites] = useState([]);

  // Estado para controlar o carregamento das piadas.
  const [isLoading, setIsLoading] = useState(false);

  // Estado para armazenar o histórico de piadas.
  const [jokeHistory, setJokeHistory] = useState([]);

  // Estado para controlar o índice da piada atual no histórico.
  const [currentJokeIndex, setCurrentJokeIndex] = useState(-1);

  // Função para carregar as piadas favoritas do localStorage.
  const loadFavoritesFromLocalStorage = () => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  // Função para buscar uma nova piada da API.
  const fetchJoke = () => {
    setIsLoading(true);
    fetch("https://api.chucknorris.io/jokes/random")
      .then((response) => response.json())
      .then((data) => {
        // Cria uma cópia do histórico de piadas e adiciona a nova piada.
        const newJokeHistory = [...jokeHistory];
        newJokeHistory.push(data.value);
        setJokeHistory(newJokeHistory);

        // Atualiza o índice da piada atual.
        setCurrentJokeIndex(newJokeHistory.length - 1);

        // Define a nova piada.
        setJoke(data.value);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  // Efeito para carregar as piadas favoritas do localStorage e buscar uma nova piada ao montar o componente.
  useEffect(() => {
    loadFavoritesFromLocalStorage();
    fetchJoke();
  }, []);

  // Função para adicionar a piada atual aos favoritos.
  const handleLike = () => {
    const newFavorites = [...favorites, joke];
    setFavorites(newFavorites);

    // Salva as piadas favoritas no localStorage.
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Função para remover uma piada da lista de favoritos.
  const handleRemove = (index) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover esta piada da lista de favoritos?",
      )
    ) {
      const newFavorites = [...favorites];
      newFavorites.splice(index, 1);
      setFavorites(newFavorites);

      // Atualiza as piadas favoritas no localStorage.
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  // Função para buscar a próxima piada.
  const handleNextJoke = () => {
    fetchJoke();
  };

  // Função para voltar para a piada anterior no histórico.
  const handlePreviousJoke = () => {
    if (currentJokeIndex > 0) {
      const previousJokeIndex = currentJokeIndex - 1;
      setJoke(jokeHistory[previousJokeIndex]);
      setCurrentJokeIndex(previousJokeIndex);
    }
  };

  // Renderiza o componente com elementos HTML.
  return (
    <div className="container">
      <img src="/chucknorris_logo.png" alt="chucknorris_logo" />
      <h1>Chuck Norris Joke</h1>
      {isLoading ? (
        <p>...</p>
      ) : (
        <>
          <p>{joke}</p>
          <button className="button-3d" onClick={handlePreviousJoke}>
            Voltar
          </button>
          <button className="button-3d" onClick={handleLike}>
            Like
          </button>
          <button className="button-3d" onClick={handleNextJoke}>
            Próximo
          </button>
        </>
      )}
      <h2>Favoritos</h2>
      <ul>
        {favorites.map((favJoke, index) => (
          <li key={index}>
            {favJoke}
            <button className="button-3d" onClick={() => handleRemove(index)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
