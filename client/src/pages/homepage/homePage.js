import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../styles/HomePage.css'; // Create a new CSS file for homepage styles

// Spotify
import { spotifyProfileThunk } from '../../components/Oauth/Spotify/spotifyApiThunks';
import { setSpotifyProfile } from '../../components/Oauth/spotifyApiReducer';

const HomePage = () => {
  const userId = useSelector(state => state.login.id);

  // Spotify
  let access_token_spotify = useSelector(state => state.spotify.access_token);
  let spotify_profile = useSelector(state => state.spotify.profile);

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
  }, [access_token_spotify]);

  return (
    <div className={`App-header`}>
      <h1>Welcome {userId}!</h1>
      <div>Coming Soon</div>
    </div>
  );
}

export default HomePage;
