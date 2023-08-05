import React from 'react';
import SongResult from './SongResult';
import PlaylistResult from './PlaylistResult';
import { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_ALBUM, TYPE_PLAYLIST, TYPE_TRACK, OPTIONS_TYPE3, OPTIONS_TYPE2, TYPE_UNIFI } from '../../../typeConstants';
import '../styles/ResultsList.css';
import { Link } from 'react-router-dom';

const ResultsList = ({collection=[], selectedFilter, className, playlistCreatorRef,
    setSelectedFilter = () => {}, handleAddClick = () => { }, saveOnClick = () => {}}) => {
  return (
    <div>
      <h2 className='heading'>{selectedFilter}</h2>
      {(className === 'spotify-playlist-list') ? 
      <div className='spotify-playlist-list'>
      {collection.map((album, i) => (
        <Link to={`/playlists/${album.originId}`}
        style={{ color: 'inherit', textDecoration: 'inherit'}}
      >
            <PlaylistResult
              className={'spotify-playlist-preview'}
              isFavorite={false}
              optionType={OPTIONS_TYPE3}
              saveOnClick={saveOnClick}
              playlistObject={album}
            />
            </Link>
          ))}
        </div>
      :
        <div className='spotify-song-list'>
        {collection.map((song, i) => (
          <SongResult
            className='spotify-preview'
            songObject={song}
            handleAddClick={handleAddClick}
            playlistCreatorRef={playlistCreatorRef}
            isFavorite={false}
          />
        ))}
        </div>}
    </div>
  );
}

export default ResultsList;