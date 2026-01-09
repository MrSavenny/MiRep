import { useState, useEffect } from 'react';
import { fetchPokemons } from './services/pokeApi';
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import './styles/styles.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokeFavs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchPokemons(20, offset);
      setPokemons(prev => [...prev, ...data]);
      setLoading(false);
    };
    loadData();
  }, [offset]);

  useEffect(() => {
    const result = pokemons.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFiltered(result);
  }, [searchTerm, pokemons]);

  const toggleFav = (pokemon) => {
    let newFavs;
    const isAlreadyFav = favorites.some(f => f.name === pokemon.name);
    
    if (isAlreadyFav) {
      newFavs = favorites.filter(f => f.name !== pokemon.name);
    } else {
      // Guardamos nombre y url para que la lista pueda volver a cargarlo si haces clic
      newFavs = [...favorites, { name: pokemon.name, url: pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/` }];
    }
    
    setFavorites(newFavs);
    localStorage.setItem('pokeFavs', JSON.stringify(newFavs));
  };

  return (
    <div className="app">
      <h1>Pokédex</h1>
      <SearchBar onSearch={setSearchTerm} />

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h3>Mis Favoritos ⭐</h3>
          <div className="fav-list">
            {favorites.map((fav, i) => (
              <span key={i} className="fav-badge">{fav.name}</span>
            ))}
          </div>
        </div>
      )}
      
      <PokemonList 
        pokemons={filtered} 
        onToggleFavorite={toggleFav} 
        favorites={favorites} 
      />

      {loading && <div className="loader"></div>}

      <button className="load-more-btn" onClick={() => setOffset(prev => prev + 20)}>
        Cargar más
      </button>
    </div>
  );
}
export default App;