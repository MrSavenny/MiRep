function SearchBar({ onSearch }) {
    return (
        <input
            type="text"
            placeholder="Buscar Pokémon..."
            onChange={(e) => onSearch(e.target.value)}
            className="search-bar"
        />
    );
}
export default SearchBar;