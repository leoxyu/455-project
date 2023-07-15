import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

import PlaylistGrid from '../../components/home/PlaylistGrid';

// Spotify
import { spotifyProfileThunk } from '../../components/Oauth/Spotify/spotifyApiThunks';
import { setSpotifyProfile } from '../../components/Oauth/spotifyApiReducer';

// Youtube
import { setYoutubeProfile } from '../../components/Oauth/youtubeApiReducer';


const HomePage = () => {
  const userId = useSelector(state => state.login.id);
  let signedIn = userId;

  // Spotify
  let access_token_spotify = useSelector(state => state.spotify.access_token);
  let spotify_profile = useSelector(state => state.spotify.profile);

  // Youtube
  let access_token_youtube = useSelector(state => state.youtube.access_token);
  let youtube_profile = useSelector(state => state.youtube.profile);

  const dispatch = useDispatch();

  // fetches profile
  useEffect(() => {
    if (access_token_spotify && !spotify_profile) {
      // fetch profile info...
      const response = dispatch(spotifyProfileThunk());
      response.then((contents) => {
        dispatch(setSpotifyProfile(contents.payload));
      });
    }

    // if (access_token_youtube && !youtube_profile) {
    //   // fetch profile info...
    //   const response = dispatch(youtubeProfileThunk());
    //   response.then((contents) => {
    //     dispatch(setYoutubeProfile(contents.payload));
    //   });
    // }
  }, [access_token_spotify, access_token_youtube]);


  return (
    <div className={`App-header`}>
      <h1>Welcome {userId}!</h1>
      <h3>Playlists</h3>
      <PlaylistGrid/>
    </div>
  );

}

export default HomePage;