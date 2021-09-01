const fetch = require("node-fetch");
const querystring = require("querystring");
const { URLSearchParams } = require("url");
const { encrypt, decrypt } = require("../common/middleware/crypto");

exports.login = async (req, res) => {
  console.log("We got the authorization code", req.query.code);
  /* Lets do the OAUTH 2.0 Google endpoint to get the access_token */
  const OAUTH_CALLBACK = "http://127.0.0.1:3008/v1/api/google/login";
  const code = req.query.code;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",

    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.GOOGLE_CLIENTID,
      client_secret: process.env.GOOGLE_CLIENTSECRET,
      redirect_uri: OAUTH_CALLBACK,
      code: code,
    }),
  });
  console.log("tokenResponse", tokenResponse);
  res.status(200);
};
