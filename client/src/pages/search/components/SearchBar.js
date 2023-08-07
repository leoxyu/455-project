import React, { useState } from 'react';
import '../../../styles/variables.css';
import '../styles/SearchBar.css';
import { ReactComponent as SearchIcon } from '../../../images/search.svg';
import { ReactComponent as ClearIcon } from '../../../images/clear.svg';

function SearchBar({placeholder='Search for songs, albums, artists...', overrideSearchTerm='', searchCallback=()=>{}}) {

  const [searchTerm, setSearchTerm] = useState(overrideSearchTerm);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Perform search or filtering logic here based on the search term
    searchCallback(event.target.value);
  };

  const clearSearch = () => {
    handleSearch({target: {value: ''}});
  };

  return (
    <div className="search-bar">
      <SearchIcon className="search-icon" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={placeholder}
      />
      {searchTerm && (
        <button className="clear-button" onClick={clearSearch}>
          <ClearIcon className="clear-icon" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
