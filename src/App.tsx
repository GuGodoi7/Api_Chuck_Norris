// Importa a folha de estilo CSS do aplicativo
import "./App.css";

// Importa os hooks necessários do React
import { useEffect, useState } from "react";

// Importa o componente Botao
import Botao from "./Componentes/Botao.js";

// Define o componente principal App
function App() {
  // Declaração dos estados do componente
  const [joke, setJoke] = useState(""); // Estado para armazenar a piada atual
  const [favorites, setFavorites] = useState([]); // Estado para armazenar piadas favoritas
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento
  const [jokeHistory, setJokeHistory] = useState([]); // Estado para armazenar o histórico de piadas
  const [currentJokeIndex, setCurrentJokeIndex] = useState(-1);  // Estado para controlar o índice da piada atual

  // Função para carregar piadas favoritas do armazenamento local
  const loadFavoritesFromLocalStorage = () => {
    const storedFavoritas = localStorage.getItem("favorites");
    if (storedFavoritas) {
      setFavorites(JSON.parse(storedFavoritas));
    }
  };

  // Função para buscar uma nova piada da API
  const fetchJoke = () => {
    setIsLoading(true); // Define isLoading como verdadeiro para mostrar que está carregando
    fetch("https://api.chucknorris.io/jokes/random")
      .then((response) => response.json())
      .then((data) => {
        // Atualiza o histórico de piadas com a nova piada
        const newJokeHistory = [...jokeHistory];
        newJokeHistory.push(data.value);
        setJokeHistory(newJokeHistory);
        // Atualiza o índice da piada atual
        setCurrentJokeIndex(newJokeHistory.length);
        // Atualiza a piada atual no estado
        setJoke(data.value);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  // Efeito colateral que é executado apenas uma vez, ao inicializar o componente
  useEffect(() => {
    loadFavoritesFromLocalStorage(); // Carrega as piadas favoritas do armazenamento local
    fetchJoke(); // Busca uma piada ao montar o componente
  }, []);

  // Função para adicionar a piada atual aos favoritos
  const handleLike = () => {
    const newFavorites = [...favorites, joke]; // Cria uma nova lista de favoritos
    setFavorites(newFavorites); // Atualiza o estado de favoritos
    localStorage.setItem("favorites", JSON.stringify(newFavorites));  // Armazena no armazenamento local
  };

  // Função para remover uma piada da lista de favoritos
  const handleRemove = (index) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover esta piada da lista de favoritos?"
      )
    ) {
      const newFavorites = [...favorites];
      newFavorites.splice(index, 1); // Remove a piada da lista de favoritos
      setFavorites(newFavorites); // Atualiza o estado de favoritos
      localStorage.setItem("favorites", JSON.stringify(newFavorites)); // Atualiza o armazenamento local
    }
  };

  // Função para buscar a próxima piada da API
  const handleNextJoke = () => {
    fetchJoke();
  };

  // Função para buscar a piada anterior na histórico de piadas
  const handlePreviousJoke = () => {
    if (currentJokeIndex > 0) {
      const previousJokeIndex = currentJokeIndex - 1;  // Calcula o índice da piada anterior
      setJoke(jokeHistory[previousJokeIndex]); // Define a piada anterior como a piada atual
      setCurrentJokeIndex(previousJokeIndex); // Atualiza o índice da piada atual
    }
  };

  // Renderização do componente
  return (
    <div className="container">
      <img src="/chucknorris_logo.png" alt="chucknorris_logo" />
      <h1>Chuck Norris Joke</h1>
      {isLoading ? (
        <p></p>
      ) : (
        <>
          <p>{joke}</p>
          <Botao texto="Voltar" onClick={handlePreviousJoke} />
          <Botao texto="Like" onClick={handleLike} />
          <Botao texto="Próximo" onClick={handleNextJoke} />
        </>
      )}
      <h2>Favoritos</h2>
      <ul>
        {favorites.map((favJoke, index) => (
          <li key={index}>
            {favJoke}
            <Botao texto="Remover" onClick={() => handleRemove(index)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Exporta o componente App
export default App;
