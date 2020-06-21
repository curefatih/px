var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config()


/**
 * Refactor note:
 * - /create and /login almost doing same things. use common function instead.
 */
router.get('/', function (req, res, next) {
  res.json({ room: true })
});

router.post('/create', function (req, res) {
  const { passwordRequired, password } = req.body;

  const roomID = uuidv4();
  const userID = uuidv4();

  console.log(process.env.JWT_SECRET);

  const token = jwt.sign(
    {
      roomID,
      userID
    },
    process.env.JWT_SECRET);

  res.status(200);
  res.json({
    roomID,
    authToken: token
  });
});

router.get('/:roomID', function (req, res) {
  res.status(200);
  res.json({
    passwordRequired: true
  })
})

router.post('/login', function (req, res) {

  const { roomID, passwordRequired, password } = req.body;

  if (password == "pass") {
    const userID = uuidv4();

    const token = jwt.sign(
      {
        roomID,
        userID
      },
      process.env.JWT_SECRET);

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
});

router.get('/:roomID/checkMember', function (req, res) {

  // check for this
  const token = req.headers.authorization.split(" ")[1];
  if (token != "") {
    try {
      const decoded = jwt.decode(token)
      if (decoded.userID == "5f057d1b-7fcf-4fa7-a94e-35bedb65395a") {
        console.log("member");
        
        res.status(200);
        res.json({ isMember: true });
      } else { throw new Error("Not a member") }
    } catch (error) {
      console.log("not member");
      res.status(401);
      res.json({ isMember: false });
    }
  }


})

module.exports = router;