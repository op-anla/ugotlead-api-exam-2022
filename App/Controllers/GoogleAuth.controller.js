const fetch = require("node-fetch");
const querystring = require("querystring");
const { URLSearchParams } = require("url");
const { encrypt, decrypt } = require("../common/middleware/crypto");

exports.login = async (req, res) => {
  /* Lets do the OAUTH 2.0 Google endpoint to get the access_token */
  console.log("request? ", req.query);
  const OAUTH_CALLBACK = "http://127.0.0.1:3008/v1/api/google/auth";
  const {
    query: { code },
  } = req;
  console.log("We got the authorization code", code);

  const token = async () => {
    try {
      return await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.GOOGLE_CLIENTID,
          client_secret: process.env.GOOGLE_CLIENTSECRET,
          redirect_uri: OAUTH_CALLBACK,
          code: code,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .catch((err) => {
          console.log("token ~ err", err);
          return err;
        });
    } catch (err) {
      console.log("token ~ err", err);
      return err;
    }
  };
  const tokenResponse = await token();
  console.log("exports.login= ~ tokenResponse", tokenResponse);
  res.redirect("http://127.0.0.1:3000/");
};
