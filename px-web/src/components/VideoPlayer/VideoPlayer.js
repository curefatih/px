import React, { useEffect, useState, useRef } from 'react';
import { connect } from "react-redux";
import {
  removePlaylistItem,
  setSocketConnection,
  updatePlaylist
} from "../../store/actions";

import YouTube from 'react-youtube';
import { v4 as uuidv4 } from 'uuid';

import io from "socket.io-client";

import "./VideoPlayer.scss"

import { MdExposurePlus1 } from "react-icons/md";
import AuthService from '../../services/Auth';

window._sync = false;
const onStateChange = (event, socket) => {
  if (!socket) return;
  console.log("STATE CHANGED, WILL EMIT? :", !window._sync, event.data);
  if (!window._sync) {
    socket.emit('video_action', {
      user: AuthService.getUserID(),
      type: event.data,
      time: Math.floor(event.target.getCurrentTime()),
    });
  }
  console.log("---> SYNC: ", window._sync);

  window._sync = false;
}
const VideoPlayer = ({
  items,
  socket,
  updatePlaylist,
  setSocketConnection }) => {
  const videoPlayerRef = useRef(null);

  // let isSyncing = false;


  useEffect(() => {
    
    const socketClient = io("http://localhost:5000/",
      {
        query: {
          token: AuthService.getToken()
        }
      }
    );

    setSocketConnection(socketClient);

    socketClient.on("connection", data => {

      console.log("CONNECTED TO SOCKET: ", data);

    });

    socketClient.on("initial_playlist", data => {
      updatePlaylist(data, socketClient)
    })

    socketClient.on("playlist_action", data => {
      updatePlaylist(data, socketClient)
    })

    socketClient.on('video_action', function (msg) {
      window.player = videoPlayerRef.current.internalPlayer
      if (!videoPlayerRef.current) return;

      window._sync = true;
      console.log("NOT SAME USER ?:", AuthService.getUserID(), msg.user, AuthService.getUserID() !== msg.user);
      console.log("switch ? ", window._sync);


      if (AuthService.getUserID() !== msg.user) {
        // console.log("HERE", msg);

        switch (msg.type) {
          case 0: // ended

            break;

          case -1:
          case 1: // playing,
            console.log("PLAY", msg.time)
            videoPlayerRef.current.internalPlayer.seekTo(msg.time, false)
              .then(() => {
                videoPlayerRef.current.internalPlayer.playVideo()
              })
            // console.log("loaded", videoPlayerRef.current.internalPlayer.getVideoLoadedFraction());

            break;

          case 2: // paused
          case 3: // buffering
            console.log("PAUSE")
            videoPlayerRef.current.internalPlayer.pauseVideo()
            // window._sync = false
            break;

          case 5: // video cued

            break;
        }
      }
    });
    window._sync = false
  }, [])

  return (
    <div className="video-player wrap xl-flexbox xl-middle xl-center">
      {items?.itemIDs?.length ?
        <div className="col xl-1-1">
          <YouTube
            ref={videoPlayerRef}
            opts={{
              height: '570px',
              width: '100%',
            }}
            videoId={items.itemsByID[items.itemIDs[0]].videoID}                  // defaults -> null
            // id={string}                       // defaults -> null
            // className={string}                // defaults -> null
            // containerClassName={string}       // defaults -> ''
            // opts={obj}                        // defaults -> {}
            onReady={() => console.log("Im ready!!")}                    // defaults -> noop
            // onPlay={func}                     // defaults -> noop
            // onPause={func}                    // defaults -> noop
            // onEnd={func}                      // defaults -> noop
            // onError={func}                    // defaults -> noop
            onStateChange={(event) => onStateChange(event, socket)}              // defaults -> noop
          // onPlaybackRateChange={func}       // defaults -> noop
          // onPlaybackQualityChange={func}    // defaults -> noop
          />
        </div>
        :
        <div className="col">
          <div className="xl-right green"><MdExposurePlus1 size="2em" /></div>
          <h5 className="grey">add some video to your playlist</h5>
        </div>}
    </div>
  );
}


const mapStateToProps = state => {
  return { items: state.playlist, socket: state.socket.connection };
};

export default connect(mapStateToProps,
  {
    removePlaylistItem,
    updatePlaylist,
    setSocketConnection
  })(VideoPlayer);;