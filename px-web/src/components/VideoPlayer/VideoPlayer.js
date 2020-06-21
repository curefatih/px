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

// let sync = false;

const VideoPlayer = ({
  items,
  socket,
  removePlaylistItem,
  updatePlaylist,
  setSocketConnection }) => {
  const videoPlayerRef = useRef(null);
  const [sync, setSync] = useState(false);

  const onStateChange = (event) => {
    // console.log("STATUS CHANGED WILL EMIT?:", socket !== null && !sync, sync);

    if (socket !== null && !sync) {
      socket.emit('video_action', {
        user: AuthService.getUserID(),
        type: event.data,
        time: event.target.getCurrentTime(),
        pID: uuidv4()
      });
    }

  }

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

      console.log("VIDEO ACTION");
      if (videoPlayerRef.current && AuthService.getUserID() !== msg.user) {
      
        switch (msg?.type) {
          case 0: // ended

            break;

          case 1: // playing,
            setSync(true)
            videoPlayerRef.current.internalPlayer.playVideo()
              .then(() => { setSync(false) })
            break;

          case 2: // paused
     
            setSync(true)
            if (sync)
              console.log("henlo");

            videoPlayerRef.current.internalPlayer.pauseVideo()
              .then(() => { setSync(false) })

            break;

          case 3: // buffering

            break;

          case 5: // video cued

            break;
        }
      }
    });
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
            // onReady={func}                    // defaults -> noop
            // onPlay={func}                     // defaults -> noop
            // onPause={func}                    // defaults -> noop
            // onEnd={func}                      // defaults -> noop
            // onError={func}                    // defaults -> noop
            onStateChange={(event) => onStateChange(event)}              // defaults -> noop
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