import { useState } from 'react';
import PokemonCard from './PokemonCard';
import { fetchPokemonDetails } from '../services/pokeApi';

function PokemonList({ pokemons, onToggleFavorite, favorites }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = async (url) => {
    const data = await fetchPokemonDetails(url);
    setSelected(data);
  };

  return (
    <div className="pokemon-list">
      <div className="list">
        {pokemons.map((p, i) => (
          <div key={i} className="pokemon-item" onClick={() => handleSelect(p.url)}>
            {p.name}
          </div>
        ))}
      </div>
      {selected && (
        <PokemonCard 
          pokemon={selected} 
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.some(f => f.name === selected.name)}
        />
      )}
    </div>
  );
}
export default PokemonList;