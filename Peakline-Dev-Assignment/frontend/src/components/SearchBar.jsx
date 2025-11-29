import { useState, useEffect } from 'react';

function SearchBar({
  onSearch,
  genres = [],
  selectedGenre = 'All Genres',
  onGenreChange,
  sortOption = 'title-asc',
  onSortChange,
}) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
    // Note: we intentionally only depend on inputValue here to avoid
    // re-triggering searches on every parent re-render, which can
    // cause continuous requests and UI flicker.
  }, [inputValue]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenreChange = (e) => {
    if (onGenreChange) {
      onGenreChange(e.target.value);
    }
  };

  const handleSortChange = (e) => {
    if (onSortChange) {
      onSortChange(e.target.value);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search books by title or author..."
        value={inputValue}
        onChange={handleChange}
      />

      <div className="filters-row">
        {genres.length > 0 && (
          <select
            className="genre-filter"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        )}

        {onSortChange && (
          <select
            className="sort-select"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="year-desc">Year (Newest First)</option>
            <option value="year-asc">Year (Oldest First)</option>
            <option value="availability">Availability</option>
          </select>
        )}
      </div>
    </div>
  );
}

export default SearchBar;

