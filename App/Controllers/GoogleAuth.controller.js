const fetch = require("node-fetch");
const querystring = require("querystring");
const { URLSearchParams } = require("url");
const { encrypt, decrypt } = require("../common/middleware/crypto");
const User = require("../Models/user.model");

exports.checkUser = async (req, res) => {
  /* 
  We have the access token now and will access information about the specific user that tried to sign in
  If the email / id / name is valid and in our database we log the user in.
  If not then we create that specific user. 
  https://www.googleapis.com/oauth2/v3/userinfo
  */
  console.log("Okay test this", req.headers["authorization"]);
  let myHeader = {
    Authorization: req.headers["authorization"],
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
      if (response.username) {
        /* We found a user */
        let userResponseObject = {
          name: userInfo.name,
          id: response.iduser,
          email: userInfo.email,
        };
        return res.status(200).send(userResponseObject);
      } else {
        /*
      Didn't find user so we create one
      */
        const user = new User({
          username: userInfo.name,
          password: null,
          email: userInfo.email,
        });
        User.create(user, (err, data) => {
          console.log("User.create ~ data", data);
          if (err) {
            console.log("ERR", err);
          }
          let userResponseObject = {
            name: userInfo.name,
            id: data.id,
            email: userInfo.email,
          };
          return res.send(userResponseObject);
        });
      }
    })
    .catch((e) => {
      console.log("exports.checkUser= ~ e", e);
      return res.status(500).send("Something went wrong");
    });
};

exports.login = async (req, res) => {
  /* Lets do the OAUTH 2.0 Google endpoint to get the access_token */
  const OAUTH_CALLBACK = "http://127.0.0.1:3000/";
  const code = req.body.code;
  console.log("We got the authorization code", code);
  if (code == undefined) return res.status(500);
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

  res.send(tokenResponse);
};
