import React, { useState, useEffect } from 'react';
import '../../styles/variables.css';
import '../../styles/searchPage.css';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import Filters from './components/Filters';
import PlaylistCreator from '../playlists/components/PlaylistCreator';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotifyAsync, getYoutubeAsync, getYoutubePlaylistByIDAsync, setSearchTermAsync } from './redux/thunks';
import Previews from './components/Previews';
import debounce from 'lodash.debounce';

import { spotifyGetManyPlaylistsThunk } from '../../components/home/redux/thunks';
import { TYPE_SPOTIFY, TYPE_YOUTUBE} from '../../typeConstants';




const SearchPage = () => {

  useEffect(() => {
    document.title = "Uni.fi - Search"; // Change the webpage title

  }, []);

  const [creatorVisible, setCreatorVisible] = useState(false);

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

  const performSearch = debounce((in_searchTerm) => {
    if (in_searchTerm !== searchTerm) {
      dispatch(setSearchTermAsync(in_searchTerm));
      console.log('disptching search ' + searchTerm)
      if (in_searchTerm === '') return; // make it load sample queries
      dispatch(getSpotifyAsync({ accessToken: accessToken, query: in_searchTerm }));
      dispatch(getYoutubeAsync({ query: in_searchTerm }));
    }
  }, 400);

  //displaying loading
  





  const closeCreator = () => {
    setCreatorVisible(false);
  }

  const handleAddClick = () => {
    setCreatorVisible(true);
  }

  const saveOnClick = (playlistLink, playlistType, source) => {

    console.log("Inside saveOnClick()");
    console.log(playlistLink);
    console.log(playlistType);
    if (source === TYPE_SPOTIFY) {
      if (playlistLink && playlistType && typeof (playlistLink) === 'string') {

        const urlArray = playlistLink.split(':');

        const spotifyID = urlArray[urlArray.length - 1];

        const parsedPlaylistObject = {
          id: spotifyID,
          playlistType: playlistType,
        }
        console.log(parsedPlaylistObject);
        console.log(accessToken);

        const parsedParam = {
          playlists: [parsedPlaylistObject],
          accessToken,
          authorID
        };

        dispatch(spotifyGetManyPlaylistsThunk(parsedParam))
          .then((res) => {
            console.log("res: ");
            console.log(res);
          });

      } else {
        console.log("invalid playlist link or type (SAVE PLAYLIST ERROR inside saveOnClick()");
      }
    } else if (source === TYPE_YOUTUBE) {
      dispatch(getYoutubePlaylistByIDAsync(playlistLink))
        .then((res) => {
          console.log("res: ");
          console.log(res.payload);
          // dispatch(createPlaylistAsync(res.payload));
        })
    } else {
      console.log(`Unexpected platform [${source}] for playlist`);
    }


  }

  // if search bar is empty and if there are no results, show sample queries
  const FILTERS = {
    'ALL':'All',
    'SPTR':'Spotify Tracks',
    'SPAL':'Spotify Albums',
    'SPPL':'Spotify Playlists',
    'YTVD':'YouTube Videos', 
    'YTPL':'YouTube Playlists'
  };

  const SPOTIFY_FILTERS = [FILTERS.ALL, FILTERS.SPTR, FILTERS.SPAL, FILTERS.SPPL];

  const determineQueryPlatform = (sectionLabel) => {
    if (sectionLabel in SPOTIFY_FILTERS) {
      return TYPE_SPOTIFY;
    } else {
      return TYPE_YOUTUBE
    }
  };

  const renderTrackResults = (tracks, sectionLabel) => {
    const source = determineQueryPlatform(sectionLabel);
    return (
      <ResultsList 
          collection={tracks} 
          className={'spotify-track-list'}
          selectedFilter={sectionLabel}
          handleAddClick={handleAddClick}
          source={source}
          />
    )
  };

  const renderPlaylistResults = (playlists, sectionLabel) => {
    const source = determineQueryPlatform(sectionLabel);
    return (
      <ResultsList
        collection={playlists}
        className={'spotify-playlist-list'}
        selectedFilter={sectionLabel}
        saveOnClick={saveOnClick} 
        source={source}
        />
    )
  };


  const renderFilteredContent = () => {
    switch (selectedFilter) {
      case FILTERS.ALL:
        return (
          <div>
            {renderTrackResults(spotifyTracks.slice(0,5), FILTERS.SPTR)}
            <hr></hr>
            {renderPlaylistResults(spotifyAlbums.slice(0,5), FILTERS.SPAL)}
            <hr></hr>
            {renderPlaylistResults(spotifyPlaylists.slice(0,5), FILTERS.SPPL)}
            <hr></hr>
            {renderTrackResults(youtubeVideos.slice(0,5), FILTERS.YTVD)}
            <hr></hr>
            {renderPlaylistResults(youtubePlaylists.slice(0,5), FILTERS.YTPL)}
            <hr></hr>
          </div>
        );
      case FILTERS.SPTR:
        return (renderTrackResults(spotifyTracks, FILTERS.SPTR));
      case FILTERS.SPAL:
        return (renderPlaylistResults(spotifyAlbums, FILTERS.SPAL));
      case FILTERS.SPPL:
        return (renderPlaylistResults(spotifyPlaylists, FILTERS.SPPL));
      case FILTERS.YTVD:
        return (renderTrackResults(youtubeVideos, FILTERS.YTVD));
      case FILTERS.YTPL:
        return (renderPlaylistResults(youtubePlaylists, FILTERS.YTPL));
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
      {(searchTerm ==='')? 
      <>
      {/* needed to pull searchBar into here to add the text from preview when updated + maintain a fast search bar using local state vs redux store */}
      <SearchBar key='preview' placeholder='Search for songs, albums, artists...' overrideSearchTerm={searchTerm} searchCallback={(input) => { performSearch(input) }} />
      <Previews setSearchTerm={(searchTerm) => performSearch(searchTerm)}></Previews>
      </>
      :
      <>
      <SearchBar key='search' placeholder='Search for songs, albums, artists...' overrideSearchTerm={searchTerm} searchCallback={(input) => { performSearch(input) }} />
      <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} filters={Object.values(FILTERS)}/>
      {renderFilteredContent()}
      </>
      }
    </div>
  );
};


export default SearchPage;
