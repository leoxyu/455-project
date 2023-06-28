import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

// Spotify
import { spotifyProfileThunk } from '../../components/Oauth/Spotify/spotifyOauthThunks';
import { setSpotifyProfile } from '../../components/Oauth/spotifyApiReducer';
import PlaylistGrid from '../../components/home/PlaylistGrid';

const HomePage = () => {
  const userId = useSelector(state => state.login.id);
  let signedIn = userId;

  // Spotify
  let access_token = useSelector(state => state.spotify.access_token);
  let spotify_profile = useSelector(state => state.spotify.profile);

  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token) {
      // fetch profile info...
      const response = dispatch(spotifyProfileThunk());
      response.then((contents) => {
        dispatch(setSpotifyProfile(contents.payload));
      });
    }
  }, [access_token]);


  return (
    <div className={`App-header`}>
      <h1>Welcome {userId}!</h1>
      <h3>Playlists</h3>
      <PlaylistGrid/>
    </div>
  );

}

export default HomePage;