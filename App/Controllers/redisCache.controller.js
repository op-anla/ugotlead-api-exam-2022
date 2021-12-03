const redis = require("redis");
/* 
Cache
*/
const redisPort = 6379;
const client = redis.createClient(redisPort);

//log error to the console if any occurs
client.on("error", (err) => {
  console.log(err);
});

exports.getCampaignCache = (req, res, next) => {};
