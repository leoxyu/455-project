import React, { useState } from 'react';
import '../../../styles/variables.css';
import '../styles/Filters.css';

function Filters() {
    const [selectedFilter, setSelectedFilter] = useState('All');

    const handlePress = (event) => {
        const filter = event.target.textContent;
        setSelectedFilter(filter);
      // dispatch filter to redux store
    };

  const filters = ['All', 'Spotify', 'YouTube', 'Songs', 'Playlists', 'Albums', 'Artists'];

  return (
    <div className="filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className="filter-button"
          onClick={handlePress}
          data-selected={selectedFilter === filter ? 'true' : 'false'}
          >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default Filters;
