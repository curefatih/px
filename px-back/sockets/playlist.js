const jwt = require("jsonwebtoken");
const { YOUTUBE_VIDEO_INFO } = require("../endpoints");

let initialPlaylist = {
  itemIDs: [1, 2],
  itemsByID: {
    '1': {
      videoID: 'YhRNX_zLAhs',
      title: 'deadmau5 - Rio (Extended Edit) [1080p HD FIXED]',
      thumbnail: 'https://i.ytimg.com/vi/YhRNX_zLAhs/default.jpg'
    },
    '2': {
      videoID: 'YhRNX_zLAhs',
      title: 'deadmau5 - Rio (Extended Edit) [1080p HD FIXED]',
      thumbnail: 'https://i.ytimg.com/vi/YhRNX_zLAhs/default.jpg'
    }
  },
}

function playlist(http) {
  console.log("Socket using now");

  var io = require('socket.io')(http);

  io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        process.env.JWT_SECRET,
        function (err, decoded) {
          if (err) return next(new Error('Authentication error'));
          socket.decoded = decoded;
          next();
        });
    } else {
      next(new Error('Authentication error'));
    }
  })
    .on('connection', function (socket) {
      console.log("connected-", socket.id);
      socket.emit('initial_playlist', initialPlaylist);

      socket.on('video_action', function (msg) {
        console.log("video_action:", msg);
        socket.broadcast.emit('video_action', {
          ...msg
        });
      });



      socket.on('playlist_action', function (msg) {
        console.log("playlist_action:", msg);
        initialPlaylist = {
          ...initialPlaylist,
          ...msg
        }

        io.emit("playlist_action", {
          ...initialPlaylist
        });
      });

      socket.on('playlist_action_add', function (msg) {
        // console.log("SENT MSG:", msg);
        console.log("playlist_action_add", msg);

        fetch(YOUTUBE_VIDEO_INFO + msg.videoID + "&key=" + process.env.YOUTUBE_API_KEY, {
          headers: {
            "ContentType": "application/json"
          }
        })
          .then(res => res.json())
          .then(res => {
            console.log(res);

            if (res.pageInfo.totalResults > 0 && res.items[0].snippet) {
              const target = res.items[0].snippet
              const snippets = {

                videoID: msg.videoID,
                title: target.title,
                thumbnail: target.thumbnails.default.url

              }
              console.log("Snippet", snippets);


              initialPlaylist = {
                itemIDs: [...initialPlaylist.itemIDs, msg.id],
                itemsByID: {
                  ...initialPlaylist.itemsByID,
                  [msg.id]: {
                    ...snippets
                  }
                }
              }

              console.log("RESPONSE:", initialPlaylist);


              io.emit("playlist_update", {
                ...initialPlaylist
              });
            }
          })
          .catch(err => console.log(err))



        // io.to('some room').emit("playlist_action", {
        //   ...initialPlaylist
        // });
      });



      socket.on('disconnect', (reason) => {
        // ref: https://socket.io/docs/client-api/#socket-disconnect

        console.log("disconnected");

      });
    });
}

module.exports = playlist;
