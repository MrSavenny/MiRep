function PokemonCard({ pokemon, onToggleFavorite, isFavorite }) {
  return (
    <div className="pokemon-card">
      <button 
        onClick={() => onToggleFavorite(pokemon)}
        style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '1.5rem', cursor: 'pointer', border: 'none', background: 'none' }}
      >
        {isFavorite ? '⭐' : '☆'}
      </button>
      <h2>{pokemon.name}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p><strong>Altura:</strong> {pokemon.height / 10}m</p>
      <p><strong>Peso:</strong> {pokemon.weight / 10}kg</p>
      <p><strong>Tipo:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
    </div>
  );
}
export default PokemonCard;