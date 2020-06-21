import {
  ADD_PLAYLIST_ITEM,
  REMOVE_PLAYLIST_ITEM,
  MOVE_PLAYLIST_ITEM,
  UPDATE_PLAYLIST
} from "../types";

import store from "../store";
import { act } from "react-dom/test-utils";
import { connect } from "react-redux";
import AuthService from "../../services/Auth";

const initialState = {
  error: {
    status: "OK",
    message: ""
  },
  itemIDs: [],
  itemsByID: {}
  // itemIDs: [1, 2, 3],
  // itemsByID: {
  //   1: { imgURL: null, name: "5 Common Habits That Make People Instantly Dislike You" },
  //   2: { imgURL: null, name: "TERTEMiZ CHAT - Gündemin getirdiklerini hep beraber konuşuyoruz" },
  //   3: { imgURL: null, name: "10 fun FINGERSTYLE guitar songs" }
  // }
};

function generateError(message, status, state) {
  return {
    ...state,
    error: {
      status,
      message
    }
  }
}

function youtubeParser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

const reorder = (list, startIndex, endIndex) => {
  console.log("LIST:", list, startIndex, endIndex);
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_PLAYLIST_ITEM: {

      const { id, content } = action.payload;
      const { socket } = action;
      const { itemIDs, itemsByID } = state;
      const videoID = youtubeParser(content);
      if (!videoID) {
        console.log("ERROR");
        return {
          ...state,
          ...generateError(state, "URL read error! Please try again.", "URLERR")
        }
      }


      const newState = {
        ...state,
        itemIDs: [...itemIDs, id],
        itemsByID: {
          ...itemsByID,
          [id]: {
            videoID,
          }
        }
      }

      if (socket !== null) {
        socket.emit('playlist_action_add', {
          id,
          videoID,
          auth: {
            token: AuthService.getToken()
          }
        });
      }

      console.log("ADDED:", {
        ...newState,
        auth: {
          token: AuthService.getToken()
        }
      });

      return state;
    }

    case MOVE_PLAYLIST_ITEM: {
      console.log("MOVED");
      const { content } = action.payload;
      const { socket } = action;
      console.log("content", content);
      if (state.itemIDs.length <= 1) {
        return state;
      }


      const items = reorder(
        state.itemIDs,
        content.source.index,
        content.destination.index
      );

      console.log("REORDERED:", items);
      
      const newState = {
        ...state,
        itemIDs: items
      };

      if (socket !== null) {
        socket.emit('playlist_action', {
          ...newState,
          auth: {
            token: AuthService.getToken()
          }
        });
      }

      return newState;
    }

    case REMOVE_PLAYLIST_ITEM: {
      const { id, index } = action.payload;
      const { socket } = action;
      const { itemIDs, itemsByID } = state

      let indexG = null;

      if (id == null && index == null) return state;

      if (index == null) {
        indexG = itemIDs.indexOf(id)
      }

      delete itemsByID[parseInt(itemIDs[indexG])]

      // delete specified index
      itemIDs.splice(indexG, 1)

      const newState ={
        ...state,
        itemIDs,
        itemsByID
      }

      if (socket !== null) {
        socket.emit('playlist_action', {
          ...newState,
          auth: {
            token: AuthService.getToken()
          }
        });
      }

      return newState;
    }

    case UPDATE_PLAYLIST: {
      return {
        ...action.payload
      };
    }

    default:
      return state;
  }
}
