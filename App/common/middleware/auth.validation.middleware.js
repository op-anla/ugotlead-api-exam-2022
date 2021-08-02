const secret = process.env.jwt_secret,
  jwt = require('jsonwebtoken');
// const crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  console.log("Inside the valid JWT needed middleware - with headers", req.headers)
  /* 
  First we check if the headers include authorization header.
  This should always be in the header if the user is authorized
  */
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ');
      /* 
      We split the authorization header and we should therefore have a "Bearer" string in the first array
      */
      if (authorization[0] !== 'Bearer') {
        /* 
        If the Authorization header isn't a Bearer we assume someone has been tampering with it or it's not our JWT. Therefor not auth
        */
        console.log('auth not bearer')
        return res.status(401).send();
      } else {
        /* 
        
        */
        req.jwt = jwt.verify(authorization[1], secret);
        console.log('This user is verified', req.jwt)
        return next();
      }
    } catch (err) {
      console.log("🚀 ~ file: auth.validation.middleware.js ~ line 18 ~ err", err)
      return res.status(401).send();
    }
  } else {
    /* 
    If the request doesn't have authorization header we assume the person is not logged in and therefore not authorized
    */
    console.log("Else in validation middleware")
    return res.status(401).send('You are not authorized');
  }
};
