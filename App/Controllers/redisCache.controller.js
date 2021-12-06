const client = require("../Models/redisModel");
client.setEx("test", 60, "42");
//log error to the console if any occurs

exports.getKey = async (keyName) => {
  try {
    const cachedResponse = await client.get(keyName);
    return cachedResponse;
  } catch (e) {
    console.log("exports.getKey= ~ e", e);
  }
};
exports.saveKey = async (keyName, TTL, data) => {
  try {
    const cachedKeyValue = await client.setEx(keyName, TTL, data);
    return cachedKeyValue;
  } catch (e) {
    console.log("exports.saveKey= ~ e", e);
  }
};
exports.deleteKey = async (keyName) => {
  try {
    await client.del(keyName);
    return;
  } catch (e) {
    console.log("exports.deleteKey ~ e", e);
  }
};
