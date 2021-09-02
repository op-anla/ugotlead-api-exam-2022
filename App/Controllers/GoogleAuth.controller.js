const fetch = require("node-fetch");
const querystring = require("querystring");
const { URLSearchParams } = require("url");
const { encrypt, decrypt } = require("../common/middleware/crypto");
const User = require("../Models/user.model");

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
  /* 
  We have the access token now and will access information about the specific user that tried to sign in
  If the email / id / name is valid and in our database we log the user in.
  If not then we create that specific user. 
  https://www.googleapis.com/oauth2/v3/userinfo
  */
  let myHeader = {
    Authorization: `Bearer ${tokenResponse.access_token}`,
  };
  const userInfoFunction = async () => {
    try {
      return await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: myHeader,
      })
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          return e.json();
        });
    } catch (error) {
      return error;
    }
  };
  const userInfo = await userInfoFunction();
  console.log("exports.login= ~ userInfo", userInfo);
  /* 
Inside the variable userInfo should now be information about the user.
We first check if the user exists in our database
*/
  const userresponse = User.findByUsernameAndEmail(
    userInfo.name,
    userInfo.email
  );
  userresponse
    .then((response) => {
      console.log("ok", response);
      /* 
      Found user so we login
      */
      return res.redirect("http://127.0.0.1:3000/");
    })
    .catch((err) => {
      console.log("not ok", err);
      /* 
      Didn't find user so we create one
      */
      const user = new User({
        username: userInfo.name,
        password: null,
        email: userInfo.email,
      });
      User.create(user, (err, data) => {
        if (err) {
          console.log("ERR", err);
        }

        res.redirect("http://127.0.0.1:3000/");
      });
    });
};
