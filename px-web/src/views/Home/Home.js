import React from 'react';
import "./Home.scss";
import PropTypes from 'prop-types';

import { CreateRoom } from '../../services/Data';
import { useState } from 'react';
import AuthService from '../../services/Auth';
import { useHistory } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import {
  FaWindowClose
} from "react-icons/fa";

const Home = ({ createRoom }) => {
  let history = useHistory();
  const [error, setError] = useState({
    status: false,
    code: null,
    message: ""
  })

  const [createRoomModal, setCreateRoomModal] = useState({
    display: false,
    disabled: false,
    password: "",
    passwordRequired: true
  })

  const [joinRoomModal, setJoinRoomModal] = useState({
    display: false,
    disabled: false,
    password: ""
  })

  const handleCreateRoomForm = (event) => {
    event.preventDefault();
    console.log("PASSWORD: ", createRoomModal.password);

    createRoom(createRoomModal.password, createRoomModal.passwordRequired)
      .then(res => {
        if (res.authToken && res.roomID) {
          AuthService.setToken(res.authToken)
          history.push("/room/" + res.roomID);
        } else {
          throw new Error("Error while creating room");
        }
      })
      .catch(err => {
        console.error(err.message);
      })
  }

  const handleJoinRoomSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <>
      <div className="home wrap xl-flexbox xl-middle xl-center">

        <div className="col xl-1-2">
          <div className="wrap">
            <div className="col xl-1-1 xl-center grey">Take a pill</div>
            <div className="col xl-1-2 xl-right btn-wrap">

              <button
                className="btn btn-red"
                onClick={() =>
                  setJoinRoomModal({
                    ...joinRoomModal,
                    display: true
                  })
                }>Join a room</button>

            </div>
            <div className="col xl-1-2 xl-left btn-wrap">

              <button
                className="btn btn-blue"
                onClick={() => setCreateRoomModal({
                  ...createRoomModal,
                  display: true
                })
                }
              >Create a room</button>

            </div>
          </div>
        </div>

      </div>

      <div className="join-room_modal" style={{ display: joinRoomModal.display ? "block" : "none" }}>
        <div className="blur-background"></div>
        <div className="form_wrapper wrap xl-flexbox xl-middle xl-center">
          <div className="col xl-1-2">

            <div className="col xl-1-1">
              <form onSubmit={(e) => handleJoinRoomSubmit(e)}>
                <div className="wrap join-room_form xl-flexbox xl-middle">
                  <div className="col xl-11-12  xl-right">
                    <h5 className="grey">Paste room url</h5>
                  </div>
                  <div className="col xl-11-12">
                    <Input type="text">

                    </Input>
                  </div>
                  <div className="col xl-1-12 xl-right" style={{ padding: "10px" }}>
                    <FaWindowClose
                      size="1.2em"
                      style={{ cursor: "pointer" }}
                      onClick={() => setJoinRoomModal({ ...joinRoomModal, display: false })}
                    />
                  </div>
                </div>
              </form>
            </div>


          </div>
        </div>
      </div>

      <div className="create-room_modal" style={{ display: createRoomModal.display ? "block" : "none" }}>
        <div className="wrap xl-flexbox xl-middle xl-center">
          <div className="col xl-1-2">

            <div className="col xl-1-1 xl-right" style={{ padding: "10px" }}>
              <FaWindowClose
                size="1.2em"
                style={{ cursor: "pointer" }}
                onClick={() => setCreateRoomModal({ ...createRoomModal, display: false })}
              />
            </div>

            <form
              className="create-room-form"
              onSubmit={(e) => handleCreateRoomForm(e)}>
              <div className="wrap xl-flexbox xl-middle xl-right">
                <div className="col xl-1-1">
                  <label htmlFor="roomPass">Room Password</label>
                </div>
                <div className="col xl-1-1">
                  <Input
                    type="text"
                    id="roomPass"
                    autoComplete="off"
                    color="green"
                    onChange={(e) =>
                      setCreateRoomModal({
                        ...createRoomModal,
                        password: e.target.value
                      })}
                    disabled={createRoomModal.disabled} />

                </div>
                <div className="col xl-1-1">
                  <Input
                    type="checkbox"
                    onChange={(e) => {
                      
                      console.log(createRoomModal);
                      setCreateRoomModal({ ...createRoomModal, disabled: e.target.checked, passwordRequired: !e.target.checked })
                    }}
                  />continue w/o password
                </div>
                <div className="col xl-1-1">
                  <Button
                    type="submit"
                    color="grey">OK</Button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

Home.propTypes = {
  createRoom: PropTypes.func.isRequired
}


export default (props) => <Home createRoom={CreateRoom} {...props} />;