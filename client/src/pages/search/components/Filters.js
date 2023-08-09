import React from 'react';
import '../../../styles/variables.css';
import '../styles/Filters.css';

function Filters({ filters = ['All', 'Spotify Tracks','Spotify Albums', 'Spotify Playlists', 'YouTube Videos', 'YouTube Playlists'], selectedFilter, setSelectedFilter }) {

  const handlePress = (event) => {
    const filter = event.target.textContent;

    // Set the selected filter
    setSelectedFilter(filter);
  };

  return (
    <div className="filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-button`}
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
