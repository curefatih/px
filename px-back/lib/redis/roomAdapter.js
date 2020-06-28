const client = require('./connection').getClient();
const { v4: uuidv4 } = require('uuid');
const { objToFlattenArray } = require('../utils');
const unflatten = require("flat").unflatten

let Promise = require('bluebird'),
  smembers = Promise.promisify(client.smembers).bind(client),
  hgetall = Promise.promisify(client.hgetall).bind(client),
  hget = Promise.promisify(client.hget).bind(client),
  sismember = Promise.promisify(client.sismember).bind(client);


const ROOMS = "rooms",
  ROOM = "room";

module.exports.createRoom = async function (id, data) {
  console.log("henlo");

  // var id = uuidv4();
  var key = ROOMS + ':' + id;
  const flatted = objToFlattenArray(data);
  console.log("FLATTED: ", flatted);

  var multi = client.multi();
  multi.hmset(key, flatted);
  multi.sadd(ROOMS, key);
  return await multi.exec();
};

module.exports.getRooms = async function () {
  return smembers(ROOMS).then(function (keys) {
    var getJobs = keys.map(function (key) {
      return hgetall(key);
    });

    return Promise.all(getJobs);
  }).then(function (results) {
    return results.map(function (result) {
      return unflatten(result);
    });
  });

}

module.exports.getRoomById = function (roomID) {
  console.log("looking for:", roomID);

  const key = ROOMS + ':' + roomID;

  return hgetall(key).then(function (room) {
    if (!room) {
      throw new Error('Room id not found:' + roomID);
    }

    return unflatten(room);
  });
};

module.exports.joinRoom = function (roomID, userID) {
  const key = ROOM + ":" + roomID;
  console.log("JOIN:", key);
  let multi = client.multi();
  multi.sadd(key, userID)
  multi.exec(function (err, replies) {
    console.log("MULTI got " + replies.length + " replies");
    replies.forEach(function (reply, index) {
      console.log("REPLY  @ index " + index + ": " + reply.toString());
    });
  });

}

module.exports.checkMember = function (roomID, userID) {

  const key = ROOM + ":" + roomID;

  return sismember(key, userID)
    .then((resp) => resp)
}