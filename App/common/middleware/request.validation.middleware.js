exports.validateDomain = (req, res, next) => {
  console.log("VALIDATE DOMAIN", req.headers, req.body);
  console.log("CAMPAIGN ROUTE PARAMS", req.params);
  var user_agent = req.headers["user-agent"];
  if (user_agent.includes("Postman")) return next();
  const acceptedVariables = {
    host: "127.0.0.1:3008",
    origin: "http://127.0.0.1:3000",
    referer: "http://127.0.0.1:3000/",
  };
  if (req.headers.host == acceptedVariables.host) {
    console.log("Accepted host");
    if (req.headers.origin == acceptedVariables.origin) {
      console.log("Accepted origin");
      if (req.headers.referer == acceptedVariables.referer) {
        console.log("Accepted referer and now we go NEXT");
        return next();
      } else {
        console.log("REJECTED REFERER");
        res.status(401).send("Not auth from this domain");
      }
    } else {
      console.log("REJECTED ORIGIN");
      res.status(401).send("Not auth from this domain");
    }
  } else {
    console.log("REJECTED HOST");
    res.status(401).send("Not auth from this domain");
  }
};
