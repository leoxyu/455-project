import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useFetcher } from 'react-router-dom';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

import PlaylistGrid from '../../components/home/PlaylistGrid';

// Spotify
import { spotifyProfileThunk } from '../../components/Oauth/Spotify/spotifyApiThunks';
import { setSpotifyProfile } from '../../components/Oauth/spotifyApiReducer';

// Youtube
import { getYoutubePlaylists } from '../../components/Oauth/youtubeApiReducer';
import { youtubeProfileThunk } from '../../components/Oauth/Youtube/youtubeApiThunks';

import PlaylistPage from '../playlists/playlistsPage';
import SearchPage from '../search/searchPage';
import { getHistoryAsync, getRecommendationsAsync } from '../../components/player/historyRedux/thunks';
import ResultsList from '../search/components/ResultsList';

const HomePage = () => {
  const userId = useSelector(state => state.login.id);
  let signedIn = userId;

  // Spotify
  let access_token_spotify = useSelector(state => state.spotify.access_token);
  let spotify_profile = useSelector(state => state.spotify.profile);

  // Youtube
  let access_token_youtube = useSelector(state => state.youtube.access_token);
  let youtube_profile = useSelector(state => state.youtube.profile);

  const historySongs = useSelector(state => state.history.historySongs);
  const recommendedSongs = useSelector(state => state.history.recommendationSongs);
  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHistoryAsync());
    dispatch(getRecommendationsAsync());
  }, []);


  // fetches profile
  useEffect(() => {
    if (access_token_spotify && !spotify_profile) {
      // fetch profile info...
      const response = dispatch(spotifyProfileThunk());
      response.then((contents) => {
        dispatch(setSpotifyProfile(contents.payload));
      });
    }

  }, [access_token_spotify, access_token_youtube]);

  // fetches playlists
  useEffect(() => {
    if (access_token_youtube && !youtube_profile) {
      // fetch profile info...
      const response = dispatch(youtubeProfileThunk(access_token_youtube));
      response.then((contents) => {
        dispatch(getYoutubePlaylists(contents.payload));
      });
    }
  }, [access_token_youtube]);


  return (
    <div className={`App-header`}>
      <h1>Welcome {userId}!</h1>
      {/* <PlaylistPage /> */}
      <div >
      <div className='home-preview-list' style={{width:'50vw'}}>
      <ResultsList collection={historySongs} selectedFilter="Recently Played" stopPagination={true}> </ResultsList>
      </div>
      <div className='home-preview-list'style={{width:'50vw'}}>
      <ResultsList collection={recommendedSongs} selectedFilter="Recommended" stopPagination={true}> </ResultsList>
      </div>
      </div>
    </div>
  );

}

export default HomePage;