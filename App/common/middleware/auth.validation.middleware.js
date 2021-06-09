const secret = process.env.jwt_secret,
  jwt = require('jsonwebtoken');
// const crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  console.log("test", req.headers['authorization'])
  if (req.headers['authorization']) {
    try {
      console.log("try")
      let authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        console.log('auth not bearer')
        return res.status(401).send();
      } else {
        console.log('test else')
        req.jwt = jwt.verify(authorization[1], secret);
        return next();
      }
    } catch (err) {
      return res.status(403).send();
    }
  } else {
    return res.status(401).send();
  }
};
