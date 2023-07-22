import React, { useState } from 'react';
import '../../styles/variables.css';
import SongResult from '../search/components/SongResult';
import { useSelector } from 'react-redux';
import '../../styles/SongPage.css';
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import { ReactComponent as ClearIcon } from '../../images/clear.svg';

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
        const filterValue = song[selectedFilter].toUpperCase();
        if (!breakpoints.includes(filterValue[0])) {
            breakpoints.push(filterValue[0]);
        }
    });
    breakpoints.sort((a, b) => a.localeCompare(b));
    return breakpoints;
};

const SongPage = () => {
    const [selectedFilter, setSelectedFilter] = useState('artist');
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
        return sortedSongs;
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
            </div>
            <h2 className='songs-heading'>Your Songs</h2>
            <div className='spotify-songs'>
                {breakpoints.map((letter) => (
                    <React.Fragment key={letter}>
                        <div className="divider">{letter}</div>
                        {filteredSongs.map((song) => {
                            const filterValue = song[selectedFilter].toUpperCase();
                            if (filterValue[0] === letter) {
                                return (
                                    <SongResult
                                        className='spotify-preview'
                                        key={song.songLink}
                                        thumbnailUrl={song.imageLink}
                                        songName={song.name}
                                        artists={song.artist}
                                        songLink={song.songLink}
                                        platform='Spotify'
                                        songObject={song}
                                    />
                                );
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
