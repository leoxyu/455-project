import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, signup } from '../../reducers/loginReducer';
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
  // const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();

  const handleLogin = () => {
    console.log("handle login");
    dispatch(loginAsync({ username, password }))
      .then((response) => {
        const status = response.payload.status;

        console.log(status)

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