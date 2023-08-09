import React, { useState, useEffect, useRef } from 'react';
import SongResult from './SongResult';
import PlaylistResult from './PlaylistResult';
import '../../../styles/variables.css';
import { TYPE_SPOTIFY, TYPE_YOUTUBE, OPTIONS_TYPE3 } from '../../../typeConstants';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/ResultsList.css';
import { Link } from 'react-router-dom';
import { REQUEST_STATE } from '../redux/utils';
import Spinner from '../../../components/spinner/spinner';
import { SEARCH_FILTERS } from '../searchPage';
import { getNextSpotifyAsync, getNextYoutubeAsync } from '../redux/thunks';
import InfiniteScroll from 'react-infinite-scroll-component';

const ResultsList = ({collection=[], selectedFilter, className, source, stopPagination=false, playlistCreatorRef, setSelectedFilter=()=>{}, handleAddClick = () => {}, saveOnClick = () => {}}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const spotifyFetchStatus = useSelector(state => state.search.getSpotify);
  const youtubeFetchStatus = useSelector(state => state.search.getYoutube);

  // want to find a better way than this ...
  const accessToken = useSelector(state => state.spotify.access_token);
  const userID = useSelector(state => state.login.authorID);
  const albumNext = useSelector(state => state.search.spotify.albumsNext);
  const playlistNext = useSelector(state => state.search.spotify.playlistsNext);
  const trackNext = useSelector(state => state.search.spotify.tracksNext);
  const youtubePlaylistNext = useSelector(state => state.search.youtube.playlistsNext);
  const youtubeVideoNext = useSelector(state => state.search.youtube.videosNext);

  let loadMoreFunction;

  switch (selectedFilter) {
    case SEARCH_FILTERS.SPAL:
      loadMoreFunction= (() => {dispatch(getNextSpotifyAsync({accessToken:accessToken, nextEndpoint:albumNext}))});
      break;
    case SEARCH_FILTERS.SPPL:
      loadMoreFunction = (() => {dispatch(getNextSpotifyAsync({accessToken:accessToken, nextEndpoint:playlistNext}))});
      break;
    case SEARCH_FILTERS.SPTR:
      loadMoreFunction = (() => {dispatch(getNextSpotifyAsync({accessToken:accessToken, nextEndpoint:trackNext}))});
      break;
    case SEARCH_FILTERS.YTPL:
      loadMoreFunction=(() => {dispatch(getNextYoutubeAsync({nextEndpoint:youtubePlaylistNext, userID:userID}))});
      break;
    case SEARCH_FILTERS.YTVD:
      loadMoreFunction=(() => {dispatch(getNextYoutubeAsync({nextEndpoint:youtubeVideoNext, userID:userID}))});
      break;
    default:
      break;
  }

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
        <InfiniteScroll
          className={className}
          dataLength={collection.length}
          next={loadMoreFunction}
          hasMore={!stopPagination}
          loader={<Spinner/>}
          scrollableTarget={className}
        >
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
        </InfiniteScroll>
      </div>)
  };

  const renderSongResults = () => {
    return (
      <div className={className}>
        <InfiniteScroll
          dataLength={collection.length}
          next={loadMoreFunction}
          hasMore={!stopPagination}
          loader={<Spinner/>}
          scrollableTarget={className}
        >

        {collection.map((song, i) => (
          <SongResult
            key={(song.source + song.songId + i)}
            className='spotify-preview'
            songObject={song}
            handleAddClick={handleAddClick}
            playlistCreatorRef={playlistCreatorRef}
            isFavorited={false}/>
        ))}
        </InfiniteScroll>
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
      return (
        renderResults()
      );
    }
  };

  return (
    <div className='results-list'>
      <h2 className='results-heading' onClick={() => setSelectedFilter(selectedFilter)}>{selectedFilter}</h2>
      {renderContent()}
    </div>
  );
};

export default ResultsList;
