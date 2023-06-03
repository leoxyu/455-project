export const login = (username, password) => {
    // Simulate an asynchronous login request
    return (dispatch) => {
      dispatch({ type: 'LOGIN_REQUEST' });
  
      // Simulate a login API call
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          dispatch({ type: 'LOGIN_SUCCESS' });
        } else {
          dispatch({ type: 'LOGIN_FAILURE', error: 'Invalid username or password' });
        }
      }, 2000);
    };
  };