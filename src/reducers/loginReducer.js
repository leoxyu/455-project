import { LOGIN, SIGNUP } from '../actions/loginActions';

const initialState = {
  id: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case SIGNUP:
      return {
        ...state,
        id: action.payload.userId,
      };
    default:
      return state;
  }
};

export default loginReducer;
