const campaign = require("./campaign.controller.js");

const { encrypt, decrypt } = require("../common/middleware/crypto");
const crypto = require("crypto");
const heyLoyaltyHOST = "https://api.heyloyalty.com/loyalty/v1";
const fetch = require("node-fetch");
let base64 = require("base-64");
exports.checkKeyStatus = async (req, res) => {
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
  const requestURL = `${heyLoyaltyHOST}/lists`;
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
exports.getList = async (req, res) => {
  /* 
  The request signature is generated using the API Secret and the value of the X-Request-Timestamp header. 
  It's important that the timestamp used to generate the signature is exactly the same as that sent in the header.
  */
  const header = JSON.parse(req.headers.heyloyalty);
  const API_KEY = decrypt(header.api_key);
  const API_SECRET = decrypt(header.api_secret);
  const requestTimestamp = new Date().toISOString();
  let hash = crypto
    .createHmac("SHA256", API_SECRET)
    .update(requestTimestamp)
    .digest("hex");
  hash = new Buffer(hash).toString("base64");
  const requestURL = `${heyLoyaltyHOST}/lists`;
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
    res.status(200).send(list);
  } catch (e) {
    res.status(500).send();
  }
};
exports.saveKeysForCampaign = async (req, res) => {
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
  const requestURL = `${heyLoyaltyHOST}/lists`;
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
        listID: list[0].id,
      },
    };
    const stringifyInfo = JSON.stringify(campaignheyLoyalty);
    campaign.updateheyLoyalty(req.body.campaign_id, campaignheyLoyalty);
    res.status(200).send();
  } catch (e) {
    console.log("Send error", e);
    res.status(500).send(e);
  }
};

exports.addMemberToHeyLoyalty = async (userTask) => {
  /* 
  This endpoint will add members to the list from request. The information required will normally be
  fullname and email. 
  */
  /* 
    The request signature is generated using the API Secret and the value of the X-Request-Timestamp header. 
    It's important that the timestamp used to generate the signature is exactly the same as that sent in the header.
    */
  let heyLoyaltyObject = userTask.heyloyalty;
  heyLoyaltyObject.api_key = decrypt(userTask.heyloyalty.api_key);
  heyLoyaltyObject.api_secret = decrypt(userTask.heyloyalty.api_secret);
  const requestTimestamp = new Date().toISOString();
  let hash = crypto
    .createHmac("SHA256", heyLoyaltyObject.api_secret)
    .update(requestTimestamp)
    .digest("hex");
  hash = new Buffer(hash).toString("base64");
  const listID = userTask.heyloyalty.listID;
  const userData = {
    firstname: userTask.userInfo.navn,
    email: userTask.userInfo.email,
    skipOptIn: 1,
  };

  var formBody = [];
  for (var property in userData) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(userData[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const requestURL = `${heyLoyaltyHOST}/lists/${listID}/members`;
  let headers = {
    Authorization: `Basic ${base64.encode(
      heyLoyaltyObject.api_key + ":" + hash
    )}`,
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "X-Request-Timestamp": requestTimestamp,
  };
  try {
    const addedMember = await fetch(requestURL, {
      method: "POST",
      body: formBody,
      headers: headers,
    });
    const addedMemberResponse = await addedMember.json();
    if (addedMemberResponse.id) {
      return addedMemberResponse;
    }
  } catch (e) {
    throw e;
  }
};
