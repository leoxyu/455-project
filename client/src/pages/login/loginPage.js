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
  // const [errorMessage, setErrorMessage] = useState('');

  // Spotify API shit
  const urlParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const error = urlParams.get('error');
    const access_token = urlParams.get('access_token');
    const refresh_token = urlParams.get('refresh_token');
    // const state = urlParams.get('state'); // currently working, but needs to be decoded to be used (so not really working)

    if (!error) {
      // do nothing,
      console.log("not logged in yet.");
    } else if (error === "ERROR_INVALID_TOKEN") {
      console.log("invalid token recieved during OAuth");
    } else {
      dispatch(setAccessToken(access_token));
      dispatch(setRefreshToken(refresh_token));
      dispatch(setSpotifyAuthError(error));
      setSpotifyLoggedIn(true);
    }


  }, []);

  // let access_token = useSelector((state) => state.oauth.access_token);
  // let refresh_token = useSelector((state) => state.oauth.refresh_token);
  // let error = useSelector((state) => state.oauth.error);

  const dispatch = useDispatch();

  const handleLogin = () => {
    console.log("handle login");
    const reply = dispatch(loginAsync({ username, password }));

    reply.then((response) => {
        const status = response.payload.status;

        console.log(status)
        console.log(response.payload)

        switch (status) {
          case LOGIN_STATUS.LogInSuccess:
            console.log(1);
            navigate('/home');
            // Handle successful login
            break;
          case LOGIN_STATUS.LogInFailed:
            console.log(2);
            // Handle failed login
            break;
          case LOGIN_STATUS.TryRegister:
            console.log(3);
            // Handle case when user needs to be redirected to register prompt
            setShowCreateAccount(true);
            break;
          default:
            console.log(4);
            // Handle unknown status - do nothing
            break;
        }
      })
      .catch((error) => {
        console.log("Error occurred during login:", error);
        // Handle error case
      });

    // show error message or authenticate hook


  };


  const spotifyLogin = () => {
    const response = dispatch(spotifyLoginThunk());

    response.then((reply) => {
      console.log(reply.payload);
      window.location.href = reply.payload.redirect_url;
    });
  };

  const handleCreateAccount = () => {
    console.log("handle register");
    dispatch(registerAsync({ username, password }))
    // show error message or authenticate hook
  };

  const handleCancelCreateAccount = () => {
    console.log("cancelling account creation");
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
        onChange={(e) => setUsername(e.target.value)}
        className="login-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">Login/Sign up</button>
      <br></br>
      {!spotifyLoggedIn ? (
        <button onClick={spotifyLogin} className="login-button">Verify Spotify Account</button>
      ) : (
        <p>Spotify connected</p>
      )}

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