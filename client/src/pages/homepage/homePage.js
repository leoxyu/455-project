import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

import { spotifyFetchProfile, spotifyGetAccessTokenThunk, spotifyRedirectToAuthCodeFlowThunk } from '../../components/Oauth/Spotify OAuth/spotifyOauthThunks';

const HomePage = () => {
  const theme = useSelector(state => state.oauth.theme); // Assuming you have a theme state in Redux
  const code = useSelector(state => state.oauth.code);
  const clientId = useSelector(state => state.oauth.clientId);
  const accessToken = useSelector(state => state.oauth.accessToken);

  const dispatch = useDispatch();

  const spotifyOauth = () => {
    if (!code) {
      dispatch(spotifyRedirectToAuthCodeFlowThunk(clientId));
    } else {
      const accessTokenPromise = dispatch(spotifyGetAccessTokenThunk({clientId, code}));
      console.log(accessTokenPromise);
      // const profile = dispatch(spotifyFetchProfile(accessToken));
      // populateUI(profile);
    }
  };


  return (
    <div className={`App-header ${theme}`}>
      <h1 className="website-header1">THIS IS THE HOME PAGE</h1>
      <Link to="/about" className="App-link">Go to About Page</Link>
      <button onClick={spotifyOauth} className="login-button">Verify Spotify Account</button>
    </div>
  );
  
}

export default HomePage;