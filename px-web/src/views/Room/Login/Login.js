import React from 'react';
import "./Login.scss";
import RoomLogin from '../../../components/RoomLoginForm/RoomLoginForm';

const Login = ({ roomID, onLoginSubmit }) => {
  return (
    <RoomLogin roomID={roomID} onLoginSubmit={(e) => onLoginSubmit(e)} />
  );
}

export default Login;
