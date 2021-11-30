const campaign = require("./campaign.controller.js");

const { encrypt, decrypt } = require("../common/middleware/crypto");
const crypto = require("crypto");
const heyLoyaltyHOST = "https://api.heyloyalty.com";
const fetch = require("node-fetch");
let base64 = require("base-64");
exports.checkKeyStatus = async (req, res) => {
  console.log("REQ BODY IN HEYLOYALTY", req.body);
  /* 
  The request signature is generated using the API Secret and the value of the X-Request-Timestamp header. 
  It's important that the timestamp used to generate the signature is exactly the same as that sent in the header.
  */
  const API_KEY = req.body.keys.api_key;
  const API_SECRET = req.body.keys.api_secret;
  const requestTimestamp = new Date().toISOString();
  let hash = crypto
    .createHmac("SHA256", API_SECRET)
    .update(requestTimestamp)
    .digest("hex");
  hash = new Buffer(hash).toString("base64");
  const requestURL = `${heyLoyaltyHOST}/loyalty/v1/lists`;
  let headers = {
    Authorization: `Basic ${base64.encode(API_KEY + ":" + hash)}`,
    "X-Request-Timestamp": requestTimestamp,
  };

  try {
    const listResponse = await fetch(requestURL, {
      method: "GET",
      headers: headers,
    });
    const list = await listResponse.json();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
};
exports.saveKeysForCampaign = async (req, res) => {
  console.log("REQ BODY IN HEYLOYALTY", req.body);
  /* 
    The request signature is generated using the API Secret and the value of the X-Request-Timestamp header. 
    It's important that the timestamp used to generate the signature is exactly the same as that sent in the header.
    */
  const API_KEY = req.body.keys.api_key;
  const API_SECRET = req.body.keys.api_secret;
  const requestTimestamp = new Date().toISOString();
  let hash = crypto
    .createHmac("SHA256", API_SECRET)
    .update(requestTimestamp)
    .digest("hex");
  hash = new Buffer(hash).toString("base64");
  const requestURL = `${heyLoyaltyHOST}/loyalty/v1/lists`;
  let headers = {
    Authorization: `Basic ${base64.encode(API_KEY + ":" + hash)}`,
    "X-Request-Timestamp": requestTimestamp,
  };
  try {
    const listResponse = await fetch(requestURL, {
      method: "GET",
      headers: headers,
    });
    const list = await listResponse.json();
    console.log("exports.saveKeysForCampaign= ~ list", list);
    if (list.code && list.code != 200) {
      throw list.message;
    }
    /* 
    We can now encrypt the keys to the database
    */
    // Encrypt the access_token
    const hashAPI_KEY = encrypt(API_KEY);
    const hashAPI_SECRET = encrypt(API_SECRET);
    const campaignheyLoyalty = {
      heyLoyalty: {
        api_key: hashAPI_KEY,
        api_secret: hashAPI_SECRET,
      },
    };
    const stringifyInfo = JSON.stringify(campaignheyLoyalty);
    console.log(
      "🚀 ~ file: server.js ~ line 192 ~ router.get ~ stringifyInfo",
      stringifyInfo
    );
    campaign.updateheyLoyalty(req.body.campaign_id, campaignheyLoyalty);
    console.log("send 200 status");
    res.status(200).send();
  } catch (e) {
    console.log("Send error", e);
    res.status(500).send(e);
  }
};
