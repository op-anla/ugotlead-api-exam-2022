exports.validateDomain = (req, res, next) => {
  console.log("VALIDATE DOMAIN", req.headers, req.body);
  console.log("CAMPAIGN ROUTE PARAMS", req.params);
  const user_agent = req.headers["user-agent"];
  if (user_agent.includes("Postman")) {
    return next();
  }
  const acceptedVariables = {
    host: [
      "127.0.0.1:3008",
      "app.ugotlead.dk/",
      "app.ugotlead.dk",
      "127.0.0.1:8000",
      "127.0.0.1:8000",
      "api.ugotlead.dk",
    ],
    origin: [
      "http://127.0.0.1:8000",
      "localhost:8000",
      "http://localhost:8000",
      "http://127.0.0.1:8000",
      "https://app.ugotlead.dk",
      "https://app.ugotlead.dk/",
    ],
  };
  if (acceptedVariables.host.includes(req.headers.host)) {
    console.log("Accepted host");
    return next();
    if (acceptedVariables.origin.includes(req.headers.origin)) {
      console.log("Accepted origin");
      return next();
    } else {
      console.log("REJECTED ORIGIN");
      res.status(401).send("Not auth from this domain");
    }
  } else {
    console.log("REJECTED HOST");
    res.status(401).send("Not auth from this domain");
  }
};

exports.didUserPlayed = (req, res, next) => {
  /* 
  This middleware will make sure the current user has actually played in the game.
  */
  console.log("What do we have in req.body?", req.body);
};
