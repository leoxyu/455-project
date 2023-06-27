import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

// Spotify
import { spotifyProfileThunk } from '../../components/Oauth/Spotify/spotifyOauthThunks';
import { setSpotifyProfile } from '../../components/Oauth/spotifyApiReducer';
import PlaylistGrid from '../../components/home/PlaylistGrid';

const HomePage = () => {
  const theme = useSelector(state => state.spotify.theme); // WTF is this??? a "theme" state doesn't exist in this reducer
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
    <div className={`App-header ${theme}`}>
      <h1 className="website-header1">HOME</h1>
      <PlaylistGrid/>
      <Link to="/search" className="App-link">Go to Search Page</Link>
      {signedIn && (<h1>Signed in as {userId}</h1>)}
      {/* <button onClick={spotifyOauth} className="login-button">Verify Spotify Account</button> */}
    </div>
  );

}

export default HomePage;