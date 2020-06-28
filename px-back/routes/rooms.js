var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const roomAdapter = require('../lib/redis/roomAdapter');
const { json } = require('express');

/**
 * Refactor note:
 * - /create and /login almost doing same things. use common function instead.
 */
router.get('/', function (req, res, next) {
  res.json({ room: true })
});

router.post('/create', function (req, res) {
  const { passwordRequired, password } = req.body;

  console.log("pr: ", passwordRequired);


  const roomID = uuidv4();
  const userID = uuidv4();

  console.log(process.env.JWT_SECRET);

  const token = jwt.sign(
    {
      roomID,
      userID
    },
    process.env.JWT_SECRET);

  const room = {
    createdBy: userID,
    //members: JSON.stringify([userID]),
    id: roomID,
    password: passwordRequired ? password : "",
    passwordRequired: passwordRequired ? true : false
  }

  roomAdapter.createRoom(roomID, room);
  roomAdapter.joinRoom(roomID, userID);

  res.status(200);
  res.json({
    roomID,
    authToken: token
  });
});

router.get('/:roomID', function (req, res) {

  const { roomID } = req.params;

  roomAdapter.getRoomById(roomID)
    .then(room => {
      console.log("ROOM VALUES:", room);
      const { password, passwordRequired, ...restRoom } = room;

      res.status(200);
      res.json({
        room: {
          ...restRoom,
          passwordRequired: passwordRequired == "false" ? false : true
        }
      })

    })
    .catch(err => {
      res.status(400);
      res.json({
        error: {
          status: err.code || "0",
          message: err.message
        }
      })
    })


})

router.post('/login', function (req, res) {

  const { roomID, password } = req.body;

  roomAdapter.getRoomById(roomID)
    .then(room => {
      if (room.password === password) {
        const userID = uuidv4();
        const token = jwt.sign(
          {
            roomID,
            userID
          },
          process.env.JWT_SECRET);

        roomAdapter.joinRoom(roomID, userID)

        res.status(200);
        res.json({
          roomID,
          authToken: token
        });
      } else {
        res.status(401);
        res.json({
          error: {
            message: "Wrong credentials"
          }
        });
      }
    })
    .catch(err => {
      res.status(400);
      res.json({
        error: {
          status: err.code || "0",
          message: err.message
        }
      })
    })
});

router.get('/:roomID/checkMember', function (req, res) {

  const { roomID } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  if (token != "") {
    try {
      const decoded = jwt.decode(token)
      roomAdapter.checkMember(roomID, decoded.userID)
        .then(resp => {
          console.log("resp: ", resp);

          if (resp) {
            res.status(200);
            res.json({ isMember: true });
          } else {
            throw new Error("Not a member")
          }
        })
        .catch(err => {
          res.status(401);
          res.json({ isMember: false });
        })

    } catch (error) {
      console.log("not member");
      res.status(401);
      res.json({ isMember: false });
    }
  }else{
    console.log("not member");
    res.status(401);
    res.json({ isMember: false });F
  }


})

module.exports = router;