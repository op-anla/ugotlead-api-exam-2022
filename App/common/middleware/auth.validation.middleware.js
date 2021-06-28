const secret = process.env.jwt_secret,
  jwt = require('jsonwebtoken');
// const crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  console.log("Inside the valid JWT needed middleware - with headers", req.headers)
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
      console.log("🚀 ~ file: auth.validation.middleware.js ~ line 18 ~ err", err)
      return res.status(403).send();
    }
  } else {
    console.log("Else in validation middleware")
    return res.status(401).send();
  }
};
