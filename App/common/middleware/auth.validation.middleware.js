const secret = process.env.jwt_secret,
  jwt = require("jsonwebtoken");
// const crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  /* 
  First we check if the headers include authorization header.
  This should always be in the header if the user is authorized
  */
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      /* 
      We split the authorization header and we should therefore have a "Bearer" string in the first array
      */
      if (authorization[0] !== "Bearer") {
        /* 
        If the Authorization header isn't a Bearer we assume someone has been tampering with it or it's not our JWT. Therefor not auth
        */
        return res.status(401).send();
      } else {
        /* 
        
        */
        req.jwt = jwt.verify(authorization[1], secret);
        return next();
      }
    } catch (err) {
      return res.status(401).send();
    }
  } else {
    /* 
    If the request doesn't have authorization header we assume the person is not logged in and therefore not authorized
    There might be a chance that the auth is set in cookies, so we just double check
    */
    if (req.headers.cookie === undefined) {
      return res.status(401).send();
    }
    if (req.headers.cookie.includes("auth._token.local")) {
      let split = req.headers.cookie.split("auth._token.local=");
      let split2 = split[1].split(";");
      let split3 = split2[0].split("Bearer%20");
      let bearer = split3[1];
      req.headers = {
        authorization: "Bearer " + bearer,
        ...req.headers,
      };
      return next();
    }
    return res.status(401).send("You are not authorized");
  }
};

exports.validJWTSimple = (req, res) => {
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        return res.status(401).send("You are not authorized");
      } else {
        req.jwt = jwt.verify(authorization[1], secret); //Comparison of token and expected value
        return res.sendStatus(200); //These are the only difference from above
      }
    } catch (err) {
      return res.status(401).send("You are not authorized");
    }
  } else {
    if (req.headers.cookie === undefined) {
      return res.status(401).send();
    }
    if (req.headers.cookie.includes("auth._token.local")) {
      let split = req.headers.cookie.split("auth._token.local=");
      let split2 = split[1].split(";");
      let split3 = split2[0].split("Bearer%20");
      let bearer = split3[1];
      req.headers = {
        authorization: "Bearer " + bearer,
        ...req.headers,
      };
      // return next();
      return res.sendStatus(200); //These are the only difference from above
    }
    return res.status(401).send("You are not authorized");
  }
};
