import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, signup } from './redux/loginReducer';
import CreateAccount from './createAccount';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginPage.css';
import { loginAsync, registerAsync } from './/redux/thunks'


import spotifyLogo from '../../images/spotify.svg';

const LoginPage = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    console.log("handle login");
    dispatch(loginAsync({ username, password }))
    // show error message or authenticate hook
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