import React from "react";
import Playlist from "../Playlist/Playlist";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

import "./VideoPair.scss";

function VideoPair() {
  return (
    <div className="video-pair wrap xl-center">
    
        <div className="col xl-11-12 md-1-1">
          <div className="wrap xl-table md-normal">
            <div className="col xl-8-12 md-1-1 xl-center">
              <div className="wrap xl-center">
                <div className="col xl-1-1">
                  <VideoPlayer />
                </div>
              </div>
            </div>
            <div className="col xl-4-12 md-1-1 playlist_wrapper" style={{height: "100%"}}>
              <Playlist />
            </div>
          </div>
        </div>
      
    </div >
  );
}

export default VideoPair;