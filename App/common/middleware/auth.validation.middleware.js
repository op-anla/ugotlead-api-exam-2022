const secret = process.env.jwt_secret,
  jwt = require('jsonwebtoken');
// const crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        console.log('auth not bearer')
        return res.status(401).send();
      } else {
        console.log('This user is verified')
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
