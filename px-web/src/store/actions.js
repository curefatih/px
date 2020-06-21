import {
  ADD_PLAYLIST_ITEM,
  REMOVE_PLAYLIST_ITEM,
  MOVE_PLAYLIST_ITEM,
  SET_SOCKET_INSTANCE,
  UPDATE_PLAYLIST
} from "./types";

import shortID from "shortid";

export const addPlaylistItem = (content, socket) => ({
  type: ADD_PLAYLIST_ITEM,
  payload: {
    id: shortID.generate(),
    content,
  },
  socket: socket.connection
});

export const movePlaylistItem = (content, socket) => ({
  type: MOVE_PLAYLIST_ITEM,
  payload: {
    content
  },
  socket: socket.connection
});

export const removePlaylistItem = (content, socket) => ({
  type: REMOVE_PLAYLIST_ITEM,
  payload: {
    id: content.id,
    index: content.index
  },
  socket: socket.connection
});

export const updatePlaylist = (content, socket) => ({
  type: UPDATE_PLAYLIST,
  payload: content,
  socket: socket.connection
});

export const setSocketConnection = connection => {
  return {

    type: SET_SOCKET_INSTANCE,
    connection

  }
};


/** Async */

// export const loadInitialDataSocket = (socket) => {
// 	return (dispatch) => {
// 		// dispatch(clearAllItems())
// 		socket.on('initial_playlist', (res)=>{
// 		   console.dir(res)
// 		   dispatch(initialItems(res))
// 	   })
// 	}	
// }