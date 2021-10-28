const secret = process.env.jwt_secret,
  jwt = require("jsonwebtoken");
// const crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  console.log("Inside the valid JWT needed middleware - with headers");
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
        console.log("auth not bearer");
        return res.status(401).send();
      } else {
        /* 
        
        */
        req.jwt = jwt.verify(authorization[1], secret);
        console.log("This user is verified", req.jwt);
        return next();
      }
    } catch (err) {
      console.log(
        "🚀 ~ file: auth.validation.middleware.js ~ line 18 ~ err",
        err
      );
      return res.status(401).send();
    }
  } else {
    /* 
    If the request doesn't have authorization header we assume the person is not logged in and therefore not authorized
    There might be a chance that the auth is set in cookies, so we just double check
    */
    console.log("Cookies?", req.headers.cookie);
    if (req.headers.cookie === undefined) {
      return res.status(401).send();
    }
    if (req.headers.cookie.includes("auth._token.local")) {
      console.log("There is actually token here");
      let split = req.headers.cookie.split("auth._token.local=");
      let split2 = split[1].split(";");
      let split3 = split2[0].split("Bearer%20");
      let bearer = split3[1];
      console.log("My bearer", bearer);
      req.headers = {
        authorization: "Bearer " + bearer,
        ...req.headers,
      };
      console.log("new header?", req.headers);
      return next();
    }
    return res.status(401).send("You are not authorized");
  }
};

exports.validJWTSimple = (req, res) => {
  console.log("Inside serverside validationMiddleware: validJWTSimple");
  console.log(
    "🚀 ~ file: auth.validation.middleware.js ~ line 66 ~ req",
    req.headers
  );
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        console.log("auth not bearer");
        return res.status(401).send("You are not authorized");
      } else {
        req.jwt = jwt.verify(authorization[1], secret); //Comparison of token and expected value
        console.log("This user is verified", req.jwt);
        return res.sendStatus(200); //These are the only difference from above
      }
    } catch (err) {
      console.log(
        "🚀 ~ file: auth.validation.middleware.js ~ line 82 ~ err",
        err
      );
      return res.status(401).send("You are not authorized");
    }
  } else {
    console.log("Else in validation middleware");
    console.log("Cookies?", req.headers.cookie);
    if (req.headers.cookie === undefined) {
      return res.status(401).send();
    }
    if (req.headers.cookie.includes("auth._token.local")) {
      console.log("There is actually token here");
      let split = req.headers.cookie.split("auth._token.local=");
      let split2 = split[1].split(";");
      let split3 = split2[0].split("Bearer%20");
      let bearer = split3[1];
      console.log("My bearer", bearer);
      req.headers = {
        authorization: "Bearer " + bearer,
        ...req.headers,
      };
      console.log("new header?", req.headers);
      // return next();
      return res.sendStatus(200); //These are the only difference from above
    }
    return res.status(401).send("You are not authorized");
  }
};

exports.validJWTTest = (req, res) => {
  console.log("Inside serverside validationMiddleware: validJWTTest");
  console.log(
    "🚀 ~ file: auth.validation.middleware.js ~ line 111 ~ req",
    req.headers
  );

  return res.sendStatus(200);
};
