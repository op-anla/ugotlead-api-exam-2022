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
  } catch (e) {}
};
exports.deleteKey = async (keyName) => {
  try {
    await client.del(keyName);
    return;
  } catch (e) {
    console.log("exports.deleteKey ~ e", e);
  }
};

exports.flushAll = async (req, res) => {
  try {
    const response = await client.flushAll();
    if (response == "OK") {
      return res.status(200).send();
    } else {
      throw new Error("Something on the redis client made an error");
    }
  } catch (e) {
    console.log("Error trying to flush all cache", e);
    return res.status(500).send(e);
  }
};
exports.flushSingleCampaign = async (req, res) => {
  try {
    await this.deleteKey(`cache_allCampaigns`);
    await this.deleteKey(`cache_campaign_${req.params.campaignId}`);
    await this.deleteKey(`cache_layout_for_campaign_${req.params.campaignId}`);
    return res.status(200).send();
  } catch (e) {
    console.log("Error trying to flush all cache", e);
    return res.status(500).send(e);
  }
};
