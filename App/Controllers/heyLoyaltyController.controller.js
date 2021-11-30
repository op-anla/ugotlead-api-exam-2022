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
  console.log("exports.checkKeyStatus= ~ headers", headers);

  const tokenResponse = await fetch(requestURL, {
    method: "GET",
    headers: headers,
  });
  console.log(
    "exports.checkKeyStatus= ~ tokenResponse",
    await tokenResponse.json()
  );
};
