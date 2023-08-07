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
import { render } from 'react-dom';

const ResultsList = ({collection=[], selectedFilter, className, source, playlistCreatorRef,
     setSelectedFilter=()=>{}, handleAddClick = () => { }, saveOnClick = () => {}}) => {
    
    
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const spotifyFetchStatus = useSelector(state => state.search.getSpotify);
  const youtubeFetchStatus = useSelector(state => state.search.getYoutube);
  useEffect(() => {
    if (spotifyFetchStatus === REQUEST_STATE.PENDING || youtubeFetchStatus === REQUEST_STATE.PENDING) {
      setIsLoading(true);
      return;
    } else {
      setIsLoading(false);
    }

    if ((spotifyFetchStatus === REQUEST_STATE.REJECTED && source===TYPE_SPOTIFY) ||
     (youtubeFetchStatus === REQUEST_STATE.REJECTED && source===TYPE_YOUTUBE)) {
      setFailed(true);
    } else {
      setFailed(false);
    }
  }, [spotifyFetchStatus, youtubeFetchStatus]);



  const lazyLoadedSongs = (songs) => {
    if (typeof(songs) === 'string') {
      return [];
    }
    return songs;
  }

  const renderPlaylistResults = () => {
    return (
      <div className={className}>
              {collection.map((album, i) => (
                <Link 
                key={album.source + album.originId + i + 'link'}
                to={`/playlists/${album.originId}`}
                style={{ color: 'inherit', textDecoration: 'inherit'}}>
                  <PlaylistResult
                    key={album.source + album.originId + i}
                    className={'spotify-playlist-preview'}
                    isFavorited={false}
                    optionType={OPTIONS_TYPE3}
                    saveOnClick={saveOnClick}
                    playlistObject={album}
                    songs={lazyLoadedSongs(album.songs)}
                  />
                </Link>
              ))}
      </div>)
  };

  const renderSongResults = () => {
    return (
      <div className={className}>
        {collection.map((song, i) => (
          <SongResult
            key={(song.source + song.songId + i)}
            className='spotify-preview'
            songObject={song}
            handleAddClick={handleAddClick}
            playlistCreatorRef={playlistCreatorRef}
            isFavorited={false}/>
        ))}
      </div>);
  };


  const renderResults = () => {
    if (className === 'spotify-playlist-list') {
      return renderPlaylistResults();
    }
    return renderSongResults();
  };


  const renderContent = () => {
    if (failed) {
      return (
        <div className='error-message'>
          <h5>Sorry, we couldn't find any results for that search.</h5>
        </div>
      );
    } else if (isLoading) {
      return <Spinner></Spinner>;
    } else {
      return renderResults();
    }
  };

  return (
    <div className='results-list'>
      <h2 className='results-heading' onClick={() => setSelectedFilter(selectedFilter)}>{selectedFilter}</h2>
      {renderContent()}
    </div>
  );
}

export default ResultsList;