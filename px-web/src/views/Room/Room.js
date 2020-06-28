import React from 'react';
import AppInside from '../../layouts/AppInside/AppInside';
import VideoPair from '../../components/VideoPair/VideoPair';

import "./Room.scss";
import { useEffect } from 'react';
import { useParams, useHistory, Redirect, Switch, Route } from 'react-router-dom';
import AuthService from '../../services/Auth';
import { CheckIsPasswordRequired, LoginRoom, CheckTokenIsValid } from '../../services/Data';
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

    CheckIsPasswordRequired(roomID)
      .then(res => {
        console.log("PASSWORD REQUIRED:", res);
        if (res?.room?.passRequired !== null || res?.room?.passRequired !== undefined) {
          if (res?.room?.passwordRequired) {
            // setPassRequired(true);

            if (!AuthService.isTokenExist() || AuthService.getDecodedToken()?.roomID != roomID) {
              setLoading({ ...loading, isLoading: false })
              setPassRequired(true);
            } else {
              CheckTokenIsValid(roomID)
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
            }

          }
          if (res?.room?.passwordRequired === false) {
            console.log("pass not required");
            setLoading({ ...loading, isLoading: false })
            setPassRequired(false);
          }
        }
      });

    console.log("PASSWORD REQUIRED2:", passRequired);

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
            <Login roomID={roomID} onLoginSubmit={(state) => handleLogin(state)} /> :
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