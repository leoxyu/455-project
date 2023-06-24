import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

import { spotifyFetchProfileThunk, spotifyGetAccessTokenThunk, spotifyRedirectToAuthCodeFlowThunk } from '../../components/Oauth/Spotify/spotifyOauthThunks';

const HomePage = () => {
  const theme = useSelector(state => state.oauth.theme); // Assuming you have a theme state in Redux
  const userId = useSelector(state => state.login.id);
  let signedIn = userId;

  const dispatch = useDispatch();

  const spotifyOauth = () => {

  };


  return (
    <div className={`App-header ${theme}`}>
      <h1 className="website-header1">THIS IS THE HOME PAGE</h1>
      <Link to="/search" className="App-link">Go to Search Page</Link>
      {signedIn && (<h1>Signed in as {userId}</h1>)}
      {/* <button onClick={spotifyOauth} className="login-button">Verify Spotify Account</button> */}
    </div>
  );

}

export default HomePage;