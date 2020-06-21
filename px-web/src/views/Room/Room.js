import React from 'react';
import AppInside from '../../layouts/AppInside/AppInside';
import VideoPair from '../../components/VideoPair/VideoPair';

import "./Room.scss";
import { useEffect } from 'react';
import { useParams, useHistory, Redirect, Switch, Route } from 'react-router-dom';
import AuthService from '../../services/Auth';
import { CheckIsPasswordRequired, LoginRoom, CheckTokenIsValıd } from '../../services/Data';
import { useState } from 'react';
import Login from './Login/Login';

function Room({ CheckIsPasswordRequired }) {
  let { roomID } = useParams();
  let history = useHistory();


  const [loading, setLoading] = useState({
    error: {
      status: false,
      message: ""
    },
    isLoading: true,
  });
  const [passRequired, setPassRequired] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    console.log("ROOM ID", roomID, history);
    if (!roomID) history.replace("/");

    if (!AuthService.isTokenExist() || AuthService.getDecodedToken()?.roomID != roomID) {
      CheckIsPasswordRequired(roomID)
        .then(res => {
          console.log("PASSWORD REQUIRED:", res);
          if (res.passRequired !== null || res.passRequired !== undefined) {
            if (res.passwordRequired) {
              setPassRequired(true);
            }
            if (res.passwordRequired === false) {
              setPassRequired(false);
            }
            setTimeout(() => {
              setLoading({ ...loading, isLoading: false })
            }, 1000);
          }
        })
    } else {
      CheckTokenIsValıd(roomID)
        .then(res => {
          console.log("RES", res);
          if (res) {
            setTimeout(() => {
              setLoading({ ...loading, isLoading: false })
              setPassRequired(false)
            }, 1000);
          } else {
            setLoading({ ...loading, isLoading: false })
            setPassRequired(true);
          }
        })
      console.log("PASSWORD REQUIRED2:", passRequired);
    }

    // console.log("=>", AuthService.getDecodedToken().roomID, roomID);


  }, [])

  const handleLogin = (state) => {
    if (state.success) {
      setPassRequired(false);
    }
  }

  return (
    <div className="app-with-room">
      <AppInside>
        {!loading.isLoading ?
          passRequired ?
            <Login roomID={roomID} onLoginSubmit={(state) => setIsLoggedIn(state)} /> :
            <div className="awr_container">
              <VideoPair />
            </div> :
          "loading"
        }
      </AppInside>
    </div>
  );
}

export default (props) =>
  <Room
    CheckIsPasswordRequired={CheckIsPasswordRequired}
    {...props} />; 