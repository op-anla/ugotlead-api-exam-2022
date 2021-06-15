const jwtSecret = process.env.jwt_secret,
  jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.login = (req, res) => {
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
