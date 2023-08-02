import React, { useState, useEffect, useRef } from 'react';
import '../../styles/variables.css';

import '../../styles/searchPage.css';
import SearchBar from './components/SearchBar';
// import SongResult from './components/SongResult';
// import PlaylistResult from './components/PlaylistResult';
import ResultsList from './components/ResultsList';
import Filters from './components/Filters';
import PlaylistCreator from '../playlists/components/PlaylistCreator';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotifyAsync, getYoutubeAsync, getYoutubePlaylistByIDAsync } from './redux/thunks';
import debounce from 'lodash.debounce';

import { createPlaylistAsync, spotifyGetManyPlaylistsThunk } from '../../components/home/redux/thunks';
import { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_ALBUM, TYPE_PLAYLIST, TYPE_TRACK, OPTIONS_TYPE3, OPTIONS_TYPE2, TYPE_UNIFI } from '../../typeConstants';
import { render } from 'react-dom';
// import { render } from 'react-dom';




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

  const performSearch = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, 400);

  useEffect(() => {
    console.log("calling it with " + searchTerm)
    if (searchTerm === '') return; // make it load recommended songs from spotify
    dispatch(getSpotifyAsync({ accessToken: accessToken, query: searchTerm }));
    dispatch(getYoutubeAsync({ query: searchTerm }));
  }, [searchTerm]);






  const closeCreator = () => {
    setCreatorVisible(false);
  }

  const handleAddClick = () => {
    console.log('trying to create new playlist');
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
      case 'All':
        return (
          <div>
            {renderTrackResults(spotifyTracks.slice(0,5), 'Spotify Tracks')}
            {renderPlaylistResults(spotifyAlbums.slice(0,5), 'Spotify Albums')}
            {renderPlaylistResults(spotifyPlaylists.slice(0,5), 'Spotify Playlists')}
            {renderTrackResults(youtubeVideos.slice(0,5), 'YouTube Videos')}
            {renderPlaylistResults(youtubePlaylists.slice(0,5), 'YouTube Playlists')}
          </div>
        );
      case 'Spotify Tracks':
        return (renderTrackResults(spotifyTracks));
      case 'Spotify Albums':
        return (renderPlaylistResults(spotifyAlbums));
      case 'Spotify Playlists':
        return (renderPlaylistResults(spotifyPlaylists));
      case 'YouTube Videos':
        return (renderTrackResults(youtubeVideos));
      case 'YouTube Playlists':
        return (renderPlaylistResults(youtubePlaylists));
      default:
        return (<div>No Results Found!</div>);
    }
  }
        


  return (
    <div className='search-page'>
      <SearchBar placeholder='Search for songs, albums, artists...' searchCallback={(input) => { performSearch(input) }} />
      <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}/>
      {creatorVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistCreator onClose={closeCreator} />
        </div>
      }
      {renderFilteredContent()}
    </div>
  );
};


export default SearchPage;
