import React, { useState, useEffect } from 'react';
import '../../styles/variables.css';
import '../../styles/searchPage.css';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import Filters from './components/Filters';
import PlaylistCreator from '../playlists/components/PlaylistCreator';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotifyAsync, getYoutubeAsync, getYoutubePlaylistByIDAsync } from './redux/thunks';
import Previews from './components/Previews';
import debounce from 'lodash.debounce';
import LoadingIcon from "../../images/loading.gif";

import { spotifyGetManyPlaylistsThunk } from '../../components/home/redux/thunks';
import { TYPE_SPOTIFY, TYPE_YOUTUBE} from '../../typeConstants';




const SearchPage = () => {

  useEffect(() => {
    document.title = "Uni.fi - Search"; // Change the webpage title

  }, []);

  const [creatorVisible, setCreatorVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    setSearchTerm(in_searchTerm);
  }, 400);

  // fetching search results
  useEffect(() => {
    if (searchTerm === '') return; // make it load sample queries
    dispatch(getSpotifyAsync({ accessToken: accessToken, query: searchTerm }));
    dispatch(getYoutubeAsync({ query: searchTerm }));
  }, [searchTerm]);

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


  const renderTrackResults = (tracks, sectionLabel=null) => {
    return (
      <ResultsList 
          collection={tracks} 
          className={'spotify-track-list'}
          selectedFilter={(sectionLabel)? sectionLabel: selectedFilter}
          handleAddClick={handleAddClick} />
    )
  };

  const renderPlaylistResults = (playlists, sectionLabel=null) => {
    return (
      <ResultsList
        collection={playlists}
        className={'spotify-playlist-list'}
        selectedFilter={(sectionLabel)? sectionLabel: selectedFilter}
        saveOnClick={saveOnClick} />
    )
  };


  const renderFilteredContent = () => {
    switch (selectedFilter) {
      case FILTERS.ALL:
        return (
          <div>
            {renderTrackResults(spotifyTracks.slice(0,5), FILTERS.SPTR)}
            {renderPlaylistResults(spotifyAlbums.slice(0,5), FILTERS.SPAL)}
            {renderPlaylistResults(spotifyPlaylists.slice(0,5), FILTERS.SPPL)}
            {renderTrackResults(youtubeVideos.slice(0,5), FILTERS.YTVD)}
            {renderPlaylistResults(youtubePlaylists.slice(0,5), FILTERS.YTPL)}
          </div>
        );
      case FILTERS.SPTR:
        return (renderTrackResults(spotifyTracks));
      case FILTERS.SPAL:
        return (renderPlaylistResults(spotifyAlbums));
      case FILTERS.SPPL:
        return (renderPlaylistResults(spotifyPlaylists));
      case FILTERS.YTVD:
        return (renderTrackResults(youtubeVideos));
      case FILTERS.YTPL:
        return (renderPlaylistResults(youtubePlaylists));
      default:
        return (<div>No Results Found!</div>);
    }
  };
  
  
        


  return (
    <div className='search-page'>
      <SearchBar placeholder='Search for songs, albums, artists...' searchCallback={(input) => { performSearch(input) }} />
      <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} filters={Object.values(FILTERS)}/>
      {creatorVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistCreator onClose={closeCreator} />
        </div>
      }
      {(searchTerm ==='')? <Previews setSearchTerm={setSearchTerm}></Previews>:
      renderFilteredContent()}
    </div>
  );
};


export default SearchPage;
