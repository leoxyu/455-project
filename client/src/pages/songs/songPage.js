import React, { useState } from 'react';
import '../../styles/variables.css';
import SongResult from '../search/components/SongResult';
import { useSelector } from 'react-redux';
import '../../styles/SongPage.css';
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import { ReactComponent as ClearIcon } from '../../images/clear.svg';
import { getTotalTrackDuration } from '../current playlist/components/util';

const PLACEHOLDER = 'Search for songs, albums, artists...';

const removeDuplicates = (songs) => {
  const uniqueSongs = [];

  songs.forEach(song => {
    const isDuplicate = uniqueSongs.some(
      uniqueSong => uniqueSong.name === song.name && uniqueSong.artist === song.artist
    );
    if (!isDuplicate) {
      uniqueSongs.push(song);
    }
  });

  return uniqueSongs;
};

const generateBreakpoints = (songs, selectedFilter) => {
  const breakpoints = [];
  songs.forEach(song => {
    let filterValue = song[selectedFilter].toUpperCase();
    if (selectedFilter === 'source') {
      // For the 'source' filter, use the entire word as the breakpoint
      filterValue = filterValue.trim(); // Trim any leading/trailing spaces
    } else {
      // For other filters, use only the first character as the breakpoint
      filterValue = filterValue[0];
    }
    if (!breakpoints.includes(filterValue)) {
      breakpoints.push(filterValue);
    }
  });

  breakpoints.sort((a, b) => a.localeCompare(b));

  return breakpoints;
};

const SongPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('name');
  const playlists = useSelector(state => state.playlists.playlists);
  const allSongsWithDupe = playlists.flatMap(playlist => playlist.songs);
  const [searchTerm, setSearchTerm] = useState('');
  const allSongs = removeDuplicates(allSongsWithDupe);

  const sortSong = () => {
    setSelectedFilter('name');
  };

  const sortArtist = () => {
    setSelectedFilter('artist');
  };

  const sortSource = () => {
    setSelectedFilter('source');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterSongs = (songs) => {
    return songs.filter((song) => {
      const searchTermUpper = searchTerm.toUpperCase();
      const songNameUpper = song.name.toUpperCase();
      const artistNameUpper = song.artist.toUpperCase();

      return songNameUpper.includes(searchTermUpper) || artistNameUpper.includes(searchTermUpper);
    });
  };

  const sortSongs = (songs) => {
    const sortedSongs = [...songs];
    sortedSongs.sort((a, b) => {
      const filterValueA = a[selectedFilter].toUpperCase();
      const filterValueB = b[selectedFilter].toUpperCase();
      return filterValueA.localeCompare(filterValueB);
    });

    const songsWithDuration = sortedSongs.map((song) => ({
      ...song,
      duration: getTotalTrackDuration([song]),
    }));

    return songsWithDuration;
  };

  const filteredSongsWithSearchTerm = searchTerm ? filterSongs(allSongs) : allSongs;
  const filteredSongs = sortSongs(filteredSongsWithSearchTerm);
  const breakpoints = generateBreakpoints(filteredSongs, selectedFilter);

  return (
    <div className='songs-page'>
      <div className="search-bar">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={PLACEHOLDER}
        />
        {searchTerm && (
          <button className="clear-button" onClick={clearSearch}>
            <ClearIcon className="clear-icon" />
          </button>
        )}
      </div>
      <div className="filters">
        <button className="filter-button" onClick={sortSong}>Song</button>
        <button className="filter-button" onClick={sortArtist}>Artist</button>
        <button className="filter-button" onClick={sortSource}>Source</button>
      </div>
      <h2 className='songs-heading'>Your Songs</h2>
      <div className='spotify-songs'>
        {breakpoints.map((letter) => (
          <React.Fragment key={letter}>
            <div className="divider">{letter}</div>
            <hr style={{ borderTop: '1px solid #ccc' }} />
            {filteredSongs.map((song) => {
              const filterValue = song[selectedFilter].toUpperCase();
              if (selectedFilter === 'source') {
                if (filterValue === letter) {
                  return (
                    <SongResult
                      className='spotify-preview'
                      songObject={song}
                    />
                  );
                }
              } else {
                if (filterValue[0] === letter) {
                  return (
                    <SongResult
                      className='spotify-preview'
                      songObject={song}
                    />
                  );
                }
              }

              return null;
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SongPage;
