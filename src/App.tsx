import "./App.css";
import { useEffect, useState } from "react";
import Botao from "./Componentes/Botao.js";

function App() {
  const [joke, setJoke] = useState(""); 
  const [favorites, setFavorites] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [jokeHistory, setJokeHistory] = useState([]); 
  const [currentJokeIndex, setCurrentJokeIndex] = useState(-1);  

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
        const newJokeHistory = [...jokeHistory];
        newJokeHistory.push(data.value);
        setJokeHistory(newJokeHistory);
        setCurrentJokeIndex(newJokeHistory.length);
        setJoke(data.value);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadFavoritesFromLocalStorage(); 
    fetchJoke(); 
  }, []);

  // Função para adicionar a piada atual aos favoritos
  const handleLike = () => {
    const newFavorites = [...favorites, joke]; 
    setFavorites(newFavorites); 
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
      newFavorites.splice(index, 1); 
      setFavorites(newFavorites);
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
      const previousJokeIndex = currentJokeIndex - 1; 
      setJoke(jokeHistory[previousJokeIndex]); 
      setCurrentJokeIndex(previousJokeIndex); 
    }
  };

  // Renderização do componente
  return (
    <div className="container">
      <img src="/chucknorris_logo.png" alt="chucknorris_logo" />
      <h1>Chuck Norris Jokes</h1>
      {isLoading ? (
        <p>Aguarde...</p>
      ) : (
        <>
          <p className="piadas">{joke}</p>
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
export default App;
