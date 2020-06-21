import {
  SET_SOCKET_INSTANCE
} from "../types";

const initialState = {
  error: {
    status: "OK",
    message: ""
  },
  connection: null,
};


export default function (state = initialState, action) {

  switch (action.type) {
    case SET_SOCKET_INSTANCE: {
      return{
        ...state,
        connection: action.connection
      }
    }

    default:
      return state;
  }
}
