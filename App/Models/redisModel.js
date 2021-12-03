const redis = require("redis");
const redisPort = 6379;

const RedisClient = (function () {
  return redis.createClient(redisPort);
})();
RedisClient.on("error", (err) => {
  console.log("Some error happened on redis", err);
});
RedisClient.connect();

module.exports = RedisClient;
