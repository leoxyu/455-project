import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

import { spotifyFetchProfile, spotifyGetAccessTokenThunk, spotifyRedirectToAuthCodeFlowThunk } from '../../components/Oauth/Spotify OAuth/spotifyOauthThunks';
import PlaylistGrid from '../../components/home/PlaylistGrid';

const HomePage = () => {
  const code = useSelector(state => state.oauth.code);
  const clientId = useSelector(state => state.oauth.clientId);
  const accessToken = useSelector(state => state.oauth.accessToken);
  const userId = useSelector(state => state.login.id);
  let signedIn = userId;

  const dispatch = useDispatch();

  const spotifyOauth = () => {
    if (!code) {
      dispatch(spotifyRedirectToAuthCodeFlowThunk(clientId));
    } else {
      const accessTokenPromise = dispatch(spotifyGetAccessTokenThunk({ clientId, code }));
      console.log(accessTokenPromise);
      // const profile = dispatch(spotifyFetchProfile(accessToken));
      // populateUI(profile);
    }
  };


  return (
    <div className={`App-header`}>
      <h1>Welcome {userId}!</h1>
      <h3>Playlists</h3>
      <PlaylistGrid/>
    </div>
  );

}

export default HomePage;