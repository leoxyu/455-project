import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import CreateAccount from './createAccount';
import { useNavigate } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/LoginPage.css';
import { loginAsync, registerAsync } from './/redux/thunks'
import unifiLogo from '../../images/unifilogo.svg';

import { ReactComponent as YoutubeIcon } from "../../images/youtube.svg"
import { ReactComponent as SpotifyIcon } from "../../images/spotify.svg"

// spotify
import { spotifyLoginThunk } from '../../components/Oauth/Spotify/spotifyApiThunks';
import { setAccessTokenSpotify, setRefreshTokenSpotify, setSpotifyAuthError } from '../../components/Oauth/spotifyApiReducer';

// youtube
import { youtubeLoginThunk } from '../../components/Oauth/Youtube/youtubeApiThunks';
import { setAccessTokenYoutube } from '../../components/Oauth/youtubeApiReducer';

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

    if (youtube_token_session) {
      dispatch(setAccessTokenYoutube(youtube_token_session));
      setYoutubeLoggedIn(true);
    }

    const access_token = urlParams.get('access_token');
    const token_type = urlParams.get('token_type');
    const error = urlParams.get('error');

    if (error) {
      console.log(error);
      return;
    } else if (access_token && token_type === 'Bearer') {
      dispatch(setAccessTokenYoutube(access_token));

      sessionStorage.setItem(SESSION_STORAGE_KEYS.youtubeAccessToken, access_token);

      setYoutubeLoggedIn(true);

    } else {
      console.log("Youtube OAuth tokens not found in Uri");
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

    if (!error) {
      console.log("Not logged in yet.");
    } else if (error === "ERROR_INVALID_TOKEN" && type) {
      console.log("invalid spotify token recieved during OAuth");
    } else if (type === "spotify") {
      dispatch(setAccessTokenSpotify(access_token));
      dispatch(setRefreshTokenSpotify(refresh_token));
      dispatch(setSpotifyAuthError(error));

      sessionStorage.setItem(SESSION_STORAGE_KEYS.spotifyAccessToken, access_token);
      sessionStorage.setItem(SESSION_STORAGE_KEYS.spotifyRefreshToken, refresh_token);

      setSpotifyLoggedIn(true);

    } else {
      console.log("spotify OAuth tokens not found in Uri");
    }


  }, []);

  const spotifyLogin = () => {
    const response = dispatch(spotifyLoginThunk());

    response.then((reply) => {
      window.location.href = reply.payload.redirect_url;
    });
  };

  const youtubeLogin = () => {
    const response = dispatch(youtubeLoginThunk());

    response.then((reply) => {
      window.location.href = reply.payload.redirect_url;
    });
  };

  // ===============================================================================================
  //
  // ===============================================================================================

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === '' || password === '') {
      return;
    }

    dispatch(loginAsync({ username, password }))
      .then((response) => {
        const status = response.payload.status;
        switch (status) {
          case LOGIN_STATUS.LogInSuccess:
            navigate('/preload');
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
            navigate('/preload');
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

  const loggedIn = spotifyLoggedIn && youtubeLoggedIn;

  let passwordInput = useRef();

  return (
    <div className="login-page">
      <h1>
        <img src={unifiLogo} alt="Spotify Logo" className="logo-icon" />
        Uni.fi
      </h1>

      {loggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          {/* Username input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setShowCreateAccount(false);
              setErrorMessage('');
            }}
            onKeyUp={(e) => { if (e.key === 'Enter') passwordInput.current.focus(); }}
            className="login-input"
          />
          {/* Password input */}
          <input
          ref={passwordInput}
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
          {/* Login button */}
          <button type="submit" className="login-button">
            Login/Sign up
          </button>
        </form>
      ) : (
        <p>Please link the following accounts:</p>
      )}

      <br></br>
      <div className="oauth-buttons-container">
        {!spotifyLoggedIn && (
          <button onClick={spotifyLogin} className="oauth-button" disabled={spotifyLoggedIn}>
            <SpotifyIcon className="oauth-icon-spotify" fill="#1DB954" />
          </button>
        )}
        {!youtubeLoggedIn && (
          <button onClick={youtubeLogin} className="oauth-button" disabled={youtubeLoggedIn}>
            <YoutubeIcon className="oauth-icon-youtube" fill="#FF0000" />
          </button>
        )}
      </div>
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
