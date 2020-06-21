import React from "react";
import { connect } from "react-redux";
import {
  addPlaylistItem,
  movePlaylistItem,
  removePlaylistItem,
  setSocketConnection,
  updatePlaylist
} from "../../store/actions";

import "./Playlist.scss";
import PropTypes from 'prop-types';

import {
  MdContentCopy,
  MdAddBox,
  MdDelete
} from "react-icons/md";

import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";

import { useState } from "react";
import { useEffect } from "react";

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

function Playlist({
  items,
  socket,
  addPlaylistItem,
  movePlaylistItem,
  removePlaylistItem,
  updatePlaylist
}) {

  const [dragState, setDragState] = useState([]);
  const [playlistInputValue, setPlaylistInputValue] = useState("https://www.youtube.com/watch?v=YhRNX_zLAhs");

  const onDragEnd = (result) => {
    movePlaylistItem(result, socket);
  }

  const onClickAddButton = (event) => {
    if (playlistInputValue.trim() != "") {
      addPlaylistItem(playlistInputValue, socket)
    }
  }

  useEffect(() => {
    if (socket.connection) {
      socket.connection.on("playlist_update", data => {
        console.log("PLAYLIST UPDATED", data);
        updatePlaylist(data, socket)
      })
    }
  }, [socket])

  return (
    <div className="playlist">
      <div className="header grey">
        <h5>Playlist</h5>
        <div className="col xl-1-1 playlist-new_item">
          <div className="wrap xl-flexbox xl-middle">
            <div className="col xl-10-12">
              <input
                type="text"
                value={playlistInputValue}
                onChange={(e) => setPlaylistInputValue(e.target.value)}
                style={{ width: "100%", padding: "5px" }} />
            </div>
            <div className="col xl-2-12">
              <button style={{ width: "100%", padding: "3px" }} onClick={(event) => { onClickAddButton(event) }}>
                <MdAddBox size="1.2em" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ height: "100%" }}>



        <div className="col xl-1-1 playlist-item_list">
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}

                >
                  {items?.itemIDs?.length > 0 ?
                    items.itemIDs.map((itemID, index) => {

                      return (
                        <Draggable key={itemID} draggableId={itemID.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className="playlist-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div className="wrap xl-flexbox xl-middle  xl-gutter-0 xl-outside-0">

                                <div className="col xl-11-12">
                                  <div className="wrap xl-flexbox xl-bottom xl-gutter-0 xl-outside-0">
                                    <div className="col xl-1-12">
                                      <img src={items.itemsByID[itemID].thumbnail} alt="henlo" />
                                    </div>
                                    <div className="col xl-10-12 bg-grey video-name dark">
                                      {items.itemsByID[itemID].title}
                                    </div>
                                  </div>
                                </div>
                                <div className="xl-1-12 xl-right item-buttons">
                                  <button
                                    onClick={() => removePlaylistItem({ id: itemID }, socket)}>
                                    <MdDelete size="1.2em" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </Draggable>
                      );
                    }) :
                    <div className="wrap xl-flextbox xl-center xl-middle">
                      <div className="col xl-3-4 black" style={{ fontSize: "0.8rem" }}>
                        your list is empty <br />
                        <MdContentCopy size="0.8em" /> you can add videos with copy and paste youtube video url
                      </div>
                    </div>}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* {items?.error?.status != "OK" ?
            <div>
              Erroror {items.error.message}
            </div>
            : null} */}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return { items: state.playlist, socket: state.socket };
};


Playlist.propTypes = {
  items: PropTypes.object,
  socket: PropTypes.any
}

export default connect(mapStateToProps,
  {
    addPlaylistItem,
    movePlaylistItem,
    removePlaylistItem,
    updatePlaylist
  })(Playlist);