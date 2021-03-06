import React from 'react';
import { useState } from 'react';
import "./RoomLoginForm.scss"

import PropTypes from "prop-types";
import { LoginRoom } from '../../services/Data';
import AuthService from '../../services/Auth';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';

const RoomLogin = ({ roomID, LoginRoom, onLoginSubmit }) => {
  const [status, setStatus] = useState({
    error: {
      status: false,
      message: ""
    },
    isLoading: false,
    success: false
  })
  const [password, setPassword] = useState("");


  useEffect(() => {
    onLoginSubmit({...status})
  }, [status])

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("PASS", password);

    LoginRoom(roomID, password)
      .then(res => {
        console.log("RETURN:", res);
        if (res.authToken) {
          AuthService.setToken(res.authToken)
          setStatus({
            ...status,
            success: true
          })
        } else {
          if (res.error) {
            setStatus({
              ...status,
              error: {
                status: true,
                message: res.error.message ? res.error.message : "Error while signing!"
              }
            })
          } else {
            throw new Error("Error while logining")
          }
        }
      })
      .catch(err => {
        setStatus({
          ...status,
          error: {
            status: true,
            message: err.message
          }
        })
      })
  }

  return (
    <div className="room-login wrap xl-flexbox xl-center xl-middle" >

      <div className="col xl-2-5">
        <form onSubmit={(e) => { handleLoginSubmit(e) }}>
          <div className="wrap xl-right">
            <div className="col xl-1-1">
              <h6 className="light">Login</h6>
            </div>
            <div className="col xl-1-1">
              <Input
                autoComplete="off"
                type="password"
                name="roomPass"
                placeholder="room password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="col xl-1-1">
              <Button
                type="submit"
              >OK</Button>
            </div>
            <div className="col xl-1-1">
              {status.error.status ? status.error.message : ""}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

RoomLogin.propTypes = {
  roomID: PropTypes.string.isRequired
}

export default (props) => <RoomLogin LoginRoom={LoginRoom} {...props} />;