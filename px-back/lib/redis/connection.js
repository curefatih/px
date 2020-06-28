var redis = require('redis'),
  client = null;

module.exports.getClient = function (getNew) {
  if (getNew) {
    return redis.createClient(
      {
        host: "192.168.0.10",
        no_ready_check: true
      });
  }

  if (!client) {
    client = redis.createClient(
      {
        host: "192.168.0.10",
        no_ready_check: true
      });
  }

  // console.log(client);

  // client.on("connect", function () {
  //   client.set("foo", "bar", redis.print); // => "Reply: OK"
  //   client.get("foo", redis.print); // => "Reply: bar"
  //   client.quit();
  // });

  return client;
}
