import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, signup } from './redux/loginReducer';
import CreateAccount from './createAccount';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginPage.css';
import { loginAsync, registerAsync } from './/redux/thunks'
import spotifyLogo from '../../images/spotify.svg';


// Spotify API shit
import { getHashParams } from '../../components/Oauth/Spotify/spotifyUtil';

// spotify
import { spotifyLoginThunk } from '../../components/Oauth/Spotify/spotifyApiThunks';
import { setAccessTokenSpotify, setRefreshTokenSpotify, setSpotifyAuthError } from '../../components/Oauth/spotifyApiReducer';

// youtube
import { youtubeLoginThunk } from '../../components/Oauth/Youtube/youtubeApiThunks';
import { setAccessTokenYoutube, setRefreshTokenYoutube, setYoutubeAuthError } from '../../components/Oauth/youtubeApiReducer';


const LOGIN_STATUS = {
  LogInSuccess: "logInSuccess",
  LogInFailed: "logInFailed",
  TryRegister: "tryRegister",
  RegisterSuccess: "registerSuccess",
  RegisterFailed: "registerFailed",
  UnknownStatus: "unknownStatus"
}

const SESSION_STORAGE_KEYS = {
  spotifyAccessToken: "spotify_access_token",
  spotifyRefreshToken: "spotify_refresh_token",
  youtubeAccessToken: "youtube_access_token",
  youtubeRefreshToken: "youtube_refresh_token"
}


const LoginPage = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OAuth states
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(false);
  const [youtubeLoggedIn, setYoutubeLoggedIn] = useState(false);

  const dispatch = useDispatch();

  // ===============================================================================================
  // OAuth youtube
  // ===============================================================================================

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash);

    const youtube_token_session = sessionStorage.getItem(SESSION_STORAGE_KEYS.youtubeAccessToken);
    // const youtube_rtoken_session = sessionStorage.getItem(SESSION_STORAGE_KEYS.youtubeRefreshToken);

    if (youtube_token_session) {
      dispatch(setAccessTokenYoutube(youtube_token_session));
      // dispatch(setRefreshTokenYoutube(youtube_rtoken_session));
      setYoutubeLoggedIn(true);
    }

    const access_token = urlParams.get('access_token');
    // const refresh_token = urlParams.get('refresh_token'); google Oauth doesn't send you a refresh token idk
    const token_type = urlParams.get('token_type');
    const error = urlParams.get('error');

    console.log('youtube OAuth token type: ', token_type);

    if (error) {
      console.log("youtube OAuth error: ", error);
      return;
    } else if (access_token && token_type === 'Bearer') {
      dispatch(setAccessTokenYoutube(access_token));
      // dispatch(setAccessTokenYoutube(refresh_token));
      // dispatch(setYoutubeAuthError(error));

      sessionStorage.setItem(SESSION_STORAGE_KEYS.youtubeAccessToken, access_token);
      // sessionStorage.setItem(SESSION_STORAGE_KEYS.youtubeRefreshToken, refresh_token);

      setYoutubeLoggedIn(true);
      console.log('youtube successfully logged in');

    } else {
      console.log("Something went wrong with youtube OAuth and retrieving tokens from URl");
    }

  }, []);

  // ===============================================================================================
  // OAuth spotify
  // ===============================================================================================

  useEffect(() => {
    // for grabbing data from URL
    const urlParams = new URLSearchParams(window.location.search);

    // always check session storage first for keys from previous OAuth. It's fine if one of them gets overwritten in sessionStorage
    // by the new token in URL
    const spotify_token_session = sessionStorage.getItem(SESSION_STORAGE_KEYS.spotifyAccessToken);
    const spotify_rtoken_session = sessionStorage.getItem(SESSION_STORAGE_KEYS.spotifyRefreshToken);

    if (spotify_token_session && spotify_rtoken_session) {
      dispatch(setAccessTokenSpotify(spotify_token_session));
      dispatch(setRefreshTokenSpotify(spotify_rtoken_session));
      setSpotifyLoggedIn(true);
    }


    // check URL for OAuth tokens

    const error = urlParams.get('error');
    const access_token = urlParams.get('access_token');
    const refresh_token = urlParams.get('refresh_token');
    const type = urlParams.get('type');
    // const state = urlParams.get('state');

    if (!error) {
      console.log("not logged in yet.");

    } else if (error === "ERROR_INVALID_TOKEN" && type) {
      console.log("invalid spotify token recieved during OAuth");

    } else if (type === "spotify") {
      dispatch(setAccessTokenSpotify(access_token));
      dispatch(setRefreshTokenSpotify(refresh_token));
      dispatch(setSpotifyAuthError(error));

      sessionStorage.setItem(SESSION_STORAGE_KEYS.spotifyAccessToken, access_token);
      sessionStorage.setItem(SESSION_STORAGE_KEYS.spotifyRefreshToken, refresh_token);

      setSpotifyLoggedIn(true);
      console.log('spotify successfully logged in');

    } else {
      console.log("Something went wrong with spotify OAuth and retrieving tokens from URl");
    }


  }, []);

  const spotifyLogin = () => {
    const response = dispatch(spotifyLoginThunk());

    response.then((reply) => {
      console.log(reply.payload);
      window.location.href = reply.payload.redirect_url;
    });
  };

  const youtubeLogin = () => {
    const response = dispatch(youtubeLoginThunk());

    response.then((reply) => {
      console.log(reply.payload);
      window.location.href = reply.payload.redirect_url;
    });
  };

  // ===============================================================================================
  //                                                                                           
  // ===============================================================================================

  const handleLogin = () => {
    if (username === '' || password === '') {
      return;
    }

    dispatch(loginAsync({ username, password }))
      .then((response) => {
        const status = response.payload.status;
        switch (status) {
          case LOGIN_STATUS.LogInSuccess:
            navigate('/home');
            break;
          case LOGIN_STATUS.LogInFailed:
            setErrorMessage('Login failed. Please check your credentials.');
            break;
          case LOGIN_STATUS.TryRegister:
            setShowCreateAccount(true);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        console.log("Error occurred during login:", error);
      });
  };

  const handleCreateAccount = () => {
    dispatch(registerAsync({ username, password }))
      .then((response) => {
        const status = response.payload.status;
        switch (status) {
          case LOGIN_STATUS.RegisterSuccess:
            navigate('/home');
            break;
          case LOGIN_STATUS.RegisterFailed:
            setErrorMessage('Account registration failed. Please try again.');
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        console.log("Error occurred during registration:", error);
      });
  };

  const handleCancelCreateAccount = () => {
    setShowCreateAccount(false);
  };

  return (
    <div className="login-page">
      <h1><img
        src={spotifyLogo}
        alt="Spotify Logo"
        className="logo-icon"
      />Uni.Fi</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setShowCreateAccount(false);
          setErrorMessage('');
        }}
        className="login-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setShowCreateAccount(false);
          setErrorMessage('');
        }}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">Login/Sign up</button>
      <br></br>
      {!spotifyLoggedIn ? (
        <button onClick={spotifyLogin} className="login-button">Verify Spotify Account</button>
      ) : (
        <p>Youtube connected</p>
      )}
      {!youtubeLoggedIn ? (
        <button onClick={youtubeLogin} className="login-button">Verify Youtube Account</button>
      ) : (
        <p>Spotify connected</p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {showCreateAccount && (
        <CreateAccount
          username={username}
          onCreateAccount={handleCreateAccount}
          onCancel={handleCancelCreateAccount}
        />
      )}
    </div>
  );
};

export default LoginPage;