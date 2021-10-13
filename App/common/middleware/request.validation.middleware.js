exports.validateDomain = (req, res, next) => {
  console.log("VALIDATE DOMAIN", req.headers, req.body);
  console.log("CAMPAIGN ROUTE PARAMS", req.params);
  const user_agent = req.headers["user-agent"];
  if (user_agent.includes("Postman")) {
    return next();
  }
  const acceptedVariables = {
    host: ["127.0.0.1:3008", "app.ugotlead.dk/"],
    origin: [
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3005",
      "https://app.ugotlead.dk",
      "https://app.ugotlead.dk/",
    ],
  };
  if (acceptedVariables.host.includes(req.headers.host)) {
    console.log("Accepted host");
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
