const initialState = {
    loggedIn: false,
    loading: false,
    error: '',
  };
  
  const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_REQUEST':
        return {
          ...state,
          loading: true,
          error: '',
        };
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          loggedIn: true,
          loading: false,
          error: '',
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
  
  export default loginReducer;