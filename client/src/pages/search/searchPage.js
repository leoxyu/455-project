import React, { useState, useEffect } from 'react';
import '../../styles/variables.css';
import '../../styles/searchPage.css';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import Filters from './components/Filters';
import PlaylistCreator from '../playlists/components/PlaylistCreator';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotifyAsync, getYoutubeAsync, importYoutubePlaylistByIDAsync, setSearchTermAsync } from './redux/thunks';
import Previews from './components/Previews';
import debounce from 'lodash.debounce';

import { spotifyGetManyPlaylistsThunk } from '../../components/home/redux/thunks';
import { TYPE_SPOTIFY, TYPE_YOUTUBE} from '../../typeConstants';

// if search bar is empty and if there are no results, show sample queries
export const SEARCH_FILTERS = {
  'ALL':'All',
  'SPTR':'Spotify Tracks',
  'SPAL':'Spotify Albums',
  'SPPL':'Spotify Playlists',
  'YTVD':'YouTube Videos',
  'YTPL':'YouTube Playlists'
};

const SPOTIFY_SEARCH_FILTERS = [SEARCH_FILTERS.ALL, SEARCH_FILTERS.SPTR, SEARCH_FILTERS.SPAL, SEARCH_FILTERS.SPPL];

const SearchPage = () => {
  useEffect(() => {
    document.title = "Uni.fi - Search"; // Change the webpage title
  }, []);

  const [creatorVisible, setCreatorVisible] = useState(false);
  const [termFilterHistory, setTermFilterHistory] = useState({});

  const searchTerm = useSelector(state => state.search.searchTerm);
  const accessToken = useSelector(state => state.spotify.access_token);
  const spotifyTracks = useSelector(state => state.search.spotify.tracks);
  const spotifyPlaylists = useSelector(state => state.search.spotify.playlists);
  const spotifyAlbums = useSelector(state => state.search.spotify.albums);
  const youtubeVideos = useSelector(state => state.search.youtube.videos);
  const youtubePlaylists = useSelector(state => state.search.youtube.playlists);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // users
  const authorID = useSelector(state => state.login.authorID);

  // artists
  const dispatch = useDispatch();

  useEffect(() => {
    var newHist;
    switch (selectedFilter) {
      case(SEARCH_FILTERS.ALL):
        newHist = {}
        for (const value of Object.values(SEARCH_FILTERS)) {
          newHist[value] = searchTerm; // You can set any value as the key's value
        }
        setTermFilterHistory(newHist);
        return;
      case(SEARCH_FILTERS.SPAL):
        newHist = termFilterHistory;
        newHist[SEARCH_FILTERS.SPAL] = searchTerm;
        setTermFilterHistory(newHist);
        return;
      case(SEARCH_FILTERS.SPPL):
        newHist = termFilterHistory;
        newHist[SEARCH_FILTERS.SPPL] = searchTerm;
        setTermFilterHistory(newHist);
        return;
      case(SEARCH_FILTERS.SPTR):
        newHist = termFilterHistory;
        newHist[SEARCH_FILTERS.SPTR] = searchTerm;
        setTermFilterHistory(newHist);
        return;
      case(SEARCH_FILTERS.YTPL):
        newHist = termFilterHistory;
        newHist[SEARCH_FILTERS.YTPL] = searchTerm;
        setTermFilterHistory(newHist);
        return;
      default:
        newHist = termFilterHistory;
        newHist[SEARCH_FILTERS.YTVD] = searchTerm;
        setTermFilterHistory(newHist);
        return;
    }
  }, [searchTerm]);

  function allValuesEqual(object, term) {
    for (const value of Object.values(object)) {
      if (value !== term) {
        return false;
      }
    }
    return true;
  }

  const dispatchSearch = (in_searchTerm) => {
    if (in_searchTerm === '') return;
    switch (selectedFilter) {
      case(SEARCH_FILTERS.ALL):
        if (allValuesEqual(termFilterHistory,in_searchTerm)) return;
        dispatch(getSpotifyAsync({ accessToken: accessToken, query: in_searchTerm }));
        dispatch(getYoutubeAsync({ query: in_searchTerm, userID: authorID }));
        return;
      case(SEARCH_FILTERS.SPAL):
        if (termFilterHistory[SEARCH_FILTERS.SPAL] === in_searchTerm) return;
        dispatch(getSpotifyAsync({ accessToken: accessToken, query: in_searchTerm, type:'album' }));
        return;
      case(SEARCH_FILTERS.SPPL):
        if (termFilterHistory[SEARCH_FILTERS.SPPL] === in_searchTerm) return;
        dispatch(getSpotifyAsync({ accessToken: accessToken, query: in_searchTerm, type:'playlist' }));
        return;
      case(SEARCH_FILTERS.SPTR):
        if (termFilterHistory[SEARCH_FILTERS.SPTR] === in_searchTerm) return;
        dispatch(getSpotifyAsync({ accessToken: accessToken, query: in_searchTerm, type:'track' }));
        return;
      case(SEARCH_FILTERS.YTPL):
        if (termFilterHistory[SEARCH_FILTERS.YTPL] === in_searchTerm) return;
        dispatch(getYoutubeAsync({ query: in_searchTerm, userID: authorID, type:'playlist'}));
        return;
      default:
        if (termFilterHistory[SEARCH_FILTERS.YTVD] === in_searchTerm) return;
        dispatch(getYoutubeAsync({query: in_searchTerm, userID: authorID, type:'video'}));
        return;
    }
  }

  const performSearch = debounce((in_searchTerm) => {
    if (in_searchTerm !== searchTerm) {
      dispatch(setSearchTermAsync(in_searchTerm));
      dispatchSearch(in_searchTerm);
    }
  }, 400);

  useEffect(() => {
    dispatchSearch(searchTerm);
  }, [selectedFilter]);

  const closeCreator = () => {
    setCreatorVisible(false);
  }

  const handleAddClick = () => {
    setCreatorVisible(true);
  }

  // TODO: this should be moved into playlistResult
  const saveOnClick = (playlistLink, playlistType, source) => {
    if (source === TYPE_SPOTIFY) {
      if (playlistLink && playlistType && typeof (playlistLink) === 'string') {

        const urlArray = playlistLink.split(':');

        const spotifyID = urlArray[urlArray.length - 1];

        const parsedPlaylistObject = {
          id: spotifyID,
          playlistType: playlistType,
        };

        const parsedParam = {
          playlists: [parsedPlaylistObject],
          accessToken,
          authorID
        };

        dispatch(spotifyGetManyPlaylistsThunk(parsedParam))
      } else {
        console.log("invalid playlist link or type (SAVE PLAYLIST ERROR inside saveOnClick()");
      }
    } else if (source === TYPE_YOUTUBE) {
      dispatch(importYoutubePlaylistByIDAsync(playlistLink))
    } else {
      console.log(`Unexpected platform [${source}] for playlist`);
    }
  }

  const determineQueryPlatform = (sectionLabel) => {
    if (sectionLabel in SPOTIFY_SEARCH_FILTERS) {
      return TYPE_SPOTIFY;
    } else {
      return TYPE_YOUTUBE
    }
  };

  const renderTrackResults = (tracks, sectionLabel, stopPagination=false) => {
    const source = determineQueryPlatform(sectionLabel);

    return (
      <ResultsList
        id='sectionLabel'
        collection={tracks}
        className={'spotify-track-list'}
        selectedFilter={sectionLabel}
        setSelectedFilter={setSelectedFilter}
        handleAddClick={handleAddClick}
        source={source}
        stopPagination={stopPagination}
      />
    )
  };

  const renderPlaylistResults = (playlists, sectionLabel, stopPagination=false) => {
    const source = determineQueryPlatform(sectionLabel);

    return (
      <ResultsList
        id={sectionLabel}
        collection={playlists}
        className={'spotify-playlist-list'}
        selectedFilter={sectionLabel}
        setSelectedFilter={setSelectedFilter}
        saveOnClick={saveOnClick}
        source={source}
        stopPagination={stopPagination}
      />
    )
  };

  const renderFilteredContent = () => {
    switch (selectedFilter) {
      case SEARCH_FILTERS.ALL:
        return (
          <div>
            {renderTrackResults(spotifyTracks.slice(0,5), SEARCH_FILTERS.SPTR, true)}
            <hr></hr>
            {renderPlaylistResults(spotifyAlbums.slice(0,5), SEARCH_FILTERS.SPAL, true)}
            <hr></hr>
            {renderPlaylistResults(spotifyPlaylists.slice(0,5), SEARCH_FILTERS.SPPL, true)}
            <hr></hr>
            {renderTrackResults(youtubeVideos.slice(0,5), SEARCH_FILTERS.YTVD, true)}
            <hr></hr>
            {renderPlaylistResults(youtubePlaylists.slice(0,5), SEARCH_FILTERS.YTPL, true)}
            <hr></hr>
          </div>
        );
      case SEARCH_FILTERS.SPTR:
        return (renderTrackResults(spotifyTracks, SEARCH_FILTERS.SPTR));
      case SEARCH_FILTERS.SPAL:
        return (renderPlaylistResults(spotifyAlbums, SEARCH_FILTERS.SPAL));
      case SEARCH_FILTERS.SPPL:
        return (renderPlaylistResults(spotifyPlaylists, SEARCH_FILTERS.SPPL));
      case SEARCH_FILTERS.YTVD:
        return (renderTrackResults(youtubeVideos, SEARCH_FILTERS.YTVD));
      case SEARCH_FILTERS.YTPL:
        return (renderPlaylistResults(youtubePlaylists, SEARCH_FILTERS.YTPL));
      default:
        return (<div>No Results Found!</div>);
    }
  };

  return (
    <div className='search-page'>
      {creatorVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistCreator onClose={closeCreator} />
        </div>
      }
      {(searchTerm ==='') ?
        <>
          {/* needed to pull searchBar into here to add the text from preview when updated + maintain a fast search bar using local state vs redux store */}
          <SearchBar key='preview' placeholder='Search for songs, albums, artists...' overrideSearchTerm={searchTerm} searchCallback={(input) => { performSearch(input) }} />
          <Previews setSearchTerm={(searchTerm) => performSearch(searchTerm)}></Previews>
        </>
        :
        <>
          <SearchBar key='search' placeholder='Search for songs, albums, artists...' overrideSearchTerm={searchTerm} searchCallback={(input) => { performSearch(input) }} />
          <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} filters={Object.values(SEARCH_FILTERS)}/>
          {renderFilteredContent()}
        </>
      }
    </div>
  );
};

export default SearchPage;
