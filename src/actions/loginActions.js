// Action types
export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';

// Action creators
export const login = (username) => ({
  type: LOGIN,
  payload: {
    userId: username
  },
});

export const signup = (username) => ({
  type: SIGNUP,
  payload: {
    userId: username
  },
});