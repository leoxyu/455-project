import React, { useState, useEffect } from 'react';
import SongResult from './SongResult';
import PlaylistResult from './PlaylistResult';
import '../../../styles/variables.css';
import { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_ALBUM, TYPE_PLAYLIST, TYPE_TRACK, OPTIONS_TYPE3, OPTIONS_TYPE2, TYPE_UNIFI } from '../../../typeConstants';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/ResultsList.css';
import { Link } from 'react-router-dom';
import { REQUEST_STATE } from '../redux/utils';
import Spinner from '../../../components/spinner/spinner';

const ResultsList = ({collection=[], selectedFilter, className, playlistCreatorRef,
     handleAddClick = () => { }, saveOnClick = () => {}}) => {
    
    
    const [isLoading, setIsLoading] = useState(false);
    const spotifyFetchStatus = useSelector(state => state.search.getSpotify);
    const youtubeFetchStatus = useSelector(state => state.search.getYoutube);
  useEffect(() => {
    if (spotifyFetchStatus === REQUEST_STATE.PENDING || youtubeFetchStatus === REQUEST_STATE.PENDING) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [spotifyFetchStatus, youtubeFetchStatus]);


  return (
    <div>
      <h2 className='heading'>{selectedFilter}</h2>
      {
      isLoading?
      <Spinner></Spinner>
      :
      (className === 'spotify-playlist-list') ?
        <div className='spotify-playlist-list'>
        {collection.map((album, i) => (
          <Link to={`/playlists/${album.originId}`}
          style={{ color: 'inherit', textDecoration: 'inherit'}}
        >
              <PlaylistResult
                key={album.source + album.originId + i}
                className={'spotify-playlist-preview'}
                isFavorited={false}
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
            key={(song.source + song.songId + i)}
            className='spotify-preview'
            songObject={song}
            handleAddClick={handleAddClick}
            playlistCreatorRef={playlistCreatorRef}
            isFavorited={false}
          />
        ))}
        </div>}
    </div>
  );
}

export default ResultsList;