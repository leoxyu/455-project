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
import { spotifyLoginThunk } from '../../components/Oauth/Spotify/spotifyOauthThunks';
import { setAccessToken, setRefreshToken, setSpotifyAuthError, setSpotifyProfile } from '../../components/Oauth/spotifyApiReducer';


const LOGIN_STATUS = {
  LogInSuccess: "logInSuccess",
  LogInFailed: "logInFailed",
  TryRegister: "tryRegister",
  RegisterSuccess: "registerSuccess",
  RegisterFailed: "registerFailed",
  UnknownStatus: "unknownStatus"
}


const LoginPage = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Spotify OAuth stuff
  const urlParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const error = urlParams.get('error');
    const access_token = urlParams.get('access_token');
    const refresh_token = urlParams.get('refresh_token');
    const type = urlParams.get('type');
    // const state = urlParams.get('state');

    if (!error) {
      // do nothing,
      console.log("not logged in yet.");
    } else if (error === "ERROR_INVALID_TOKEN" && type === "spotify") {
      console.log("invalid spotify token recieved during OAuth");
    } else if (type === "spotify") {
      dispatch(setAccessToken(access_token));
      dispatch(setRefreshToken(refresh_token));
      dispatch(setSpotifyAuthError(error));
      setSpotifyLoggedIn(true);
    } else {
      console.log("Something went wrong with spotify OAuth and retrieving tokens from URl");
    }


  }, []);

  // Youtube OAuth stuff
  // TODO...


  const dispatch = useDispatch();

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


  const spotifyLogin = () => {
    const response = dispatch(spotifyLoginThunk());

    response.then((reply) => {
      console.log(reply.payload);
      window.location.href = reply.payload.redirect_url;
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