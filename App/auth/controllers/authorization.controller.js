const jwtSecret = process.env.jwt_secret,
  jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.login = (req, res) => {
  /* 
  This is used in the /auth endpoint when the user tries to login and is the last part of our JWT
  It will generate a access token to the user and also send back the user ID.

  These information will later be used by the user for all requests where it's required. 
  */
  try {
    let refreshId = req.body.userId + jwtSecret;
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
    req.body.refreshKey = salt;
    let token = jwt.sign(req.body, jwtSecret);
    let b = Buffer.from(hash);
    let refresh_token = b.toString('base64');
    res.status(201).send({
      token: token,
      refreshToken: refresh_token,
      userid: req.body.userId
    });
  } catch (err) {

    console.log("🚀 ~ file: authorization.controller.js ~ line 22 ~ err", err)
    res.status(500).send({
      errors: err
    });
  }
};
