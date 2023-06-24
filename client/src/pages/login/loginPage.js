import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import CreateAccount from './createAccount';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginPage.css';
import { loginAsync, registerAsync } from './/redux/thunks'
import spotifyLogo from '../../images/spotify.svg';

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
  const [errorMessage, setErrorMessage] = useState('');

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