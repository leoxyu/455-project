import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, signup } from '../../actions/loginActions'
import CreateAccount from './createAccount';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
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
        // show error msg or something
      }
    }
  };

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
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login/Sign up</button>

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


function accountExists(username) {
  return false;
}

function authenticateUser(username, password) {
  return (username === 'admin' && password === 'password')
}
