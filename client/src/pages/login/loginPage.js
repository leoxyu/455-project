import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, signup } from '../../reducers/loginReducer';
import CreateAccount from './createAccount';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginPage.css'; // Import the LoginPage.css file

import spotifyLogo from '../../images/spotify.svg';

const LoginPage = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    const isAuthenticated = authenticateUser(username, password);

    if (isAuthenticated) {
      dispatch(login(username));
      setShowCreateAccount(false);
      // go to home page here
      navigate("/home");
    } else {
      if (!accountExists(username)) {
        setShowCreateAccount(true);
      } else {
        setErrorMessage('Invalid username or password.');
      }
    }
  };

  function accountExists(username) {
    return false;
  }
  
  function authenticateUser(username, password) {
    return (username === 'admin' && password === 'password')
  }

  const handleCreateAccount = () => {
    dispatch(signup(username));
    // go to home page here
    navigate("/home");
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