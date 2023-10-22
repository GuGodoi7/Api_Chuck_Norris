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
    setIsLoading(true); 
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
    // Carrega as piadas favoritas do armazenamento local
    loadFavoritesFromLocalStorage(); 
    // Busca uma piada ao montar o componente
    fetchJoke(); 
  }, []);

  // Função para adicionar a piada atual aos favoritos
  const handleLike = () => {
    // Cria uma nova lista de favoritos
    const newFavorites = [...favorites, joke]; 
    // Atualiza o estado de favoritos
    setFavorites(newFavorites); 
    // Armazena no armazenamento local
    localStorage.setItem("favorites", JSON.stringify(newFavorites));  
  };

  // Função para remover uma piada da lista de favoritos
  const handleRemove = (index) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover esta piada da lista de favoritos?"
      )
    ) {
      const newFavorites = [...favorites];
      // Remove a piada da lista de favoritos
      newFavorites.splice(index, 1); 
       // Atualiza o estado de favoritos
      setFavorites(newFavorites);
      // Atualiza o armazenamento local
      localStorage.setItem("favorites", JSON.stringify(newFavorites)); 
    }
  };

  // Função para buscar a próxima piada da API
  const handleNextJoke = () => {
    fetchJoke();
  };

  // Função para buscar a piada anterior na histórico de piadas
  const handlePreviousJoke = () => {
    if (currentJokeIndex > 0) {
       // Calcula o índice da piada anterior
      const previousJokeIndex = currentJokeIndex - 1; 
      // Define a piada anterior como a piada atual
      setJoke(jokeHistory[previousJokeIndex]); 
      // Atualiza o índice da piada atual
      setCurrentJokeIndex(previousJokeIndex); 
    }
  };

  // Renderização do componente
  return (
    <div className="container">
      <img src="/chucknorris_logo.png" alt="chucknorris_logo" />
      <h1>Chuck Norris Joke</h1>
      {isLoading ? (
        <p>...</p>
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
