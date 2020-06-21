import React from 'react';
import PropTypes from 'prop-types';


import "./Home.scss";
import { CreateRoom } from '../../services/Data';
import { useState } from 'react';
import AuthService from '../../services/Auth';
import { useHistory } from 'react-router-dom';

const Home = ({ createRoom }) => {
  let history = useHistory();
  const [error, setError] = useState({
    status: false,
    code: null,
    message: ""
  })

  const [createRoomModal, setCreateRoomModal] = useState({
    display: false,
    password: ""
  })

  const handleNewRoomClicked = () => {

    setCreateRoomModal({
      ...createRoomModal,
      display: true
    })

  }

  const handleCreateRoomForm = (event) => {
    event.preventDefault();
    console.log("PASSWORD: ", createRoomModal.password);

    createRoom(createRoomModal.password)
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

  return (
    <>
      <div className="home wrap xl-flexbox xl-middle xl-center">

        <div className="col xl-1-2">
          <div className="wrap">
            <div className="col xl-1-1 xl-center grey">Take a pill</div>
            <div className="col xl-1-2 xl-right btn-wrap">

              <button className="btn btn-red">
                Join a room
      </button>

            </div>
            <div className="col xl-1-2 xl-left btn-wrap">

              <button
                className="btn btn-blue"
                onClick={() => handleNewRoomClicked()}
              >Create a room</button>

            </div>
          </div>
        </div>

      </div>

      <div className="create-room_modal" style={{display: createRoomModal.display ? "block" : "none"}}>
        <div className="wrap xl-flexbox xl-middle xl-center">
          <div className="col xl-1-2">
            <form onSubmit={(e) => handleCreateRoomForm(e)}>
              <div className="wrap">
                <div className="col xl-1-1">
                  <label htmlFor="roomPass">Room Password</label>
                </div>
                <div className="col xl-1-1">
                  <input
                    type="text"
                    id="roomPass"
                    autoComplete="off"
                    onChange={(e) =>
                      setCreateRoomModal({
                        ...createRoomModal,
                        password: e.target.value
                      })} />
                </div>
                <div className="col xl-1-1">
                  <input type="checkbox" name="passless" id="" /> continue w/o password
                </div>
                <div className="col xl-1-1">
                  <button type="submit">OK</button>
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